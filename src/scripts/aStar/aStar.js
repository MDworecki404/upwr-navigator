import Network from '../../layers/Network_with_roads.json'; // Importowanie danych o sieci drogowej w formacie GeoJSON

// Funkcja budująca graf na podstawie danych GeoJSON
export const buildGraph = () => {
    console.log('Rozpoczęcie budowy grafu');

    let nodes = new Set();
    let edges = new Map();
    let pedestrianPaths = 0; // Licznik tras dla pieszych

    Network.features.forEach(feature => {
        const allowedClasses = ["footway", "pedestrian", "path", "cycleway", "steps"];
        if (!allowedClasses.includes(feature.properties.fclass)) {
            return;
        }

        pedestrianPaths++; // Zliczanie dróg pieszych

        if (feature.geometry.type === "MultiLineString") {
            feature.geometry.coordinates.forEach(line => {
                for (let i = 0; i < line.length; i++) {
                    const point = line[i];
                    const key = JSON.stringify(point);
                    
                    nodes.add(key);

                    if (i > 0) {
                        const prevPoint = line[i - 1];
                        addEdge(edges, prevPoint, point, feature.properties.oneway);
                    }
                }
            });
        }
    });

    console.log('Liczba tras pieszych:', pedestrianPaths);
    console.log('Liczba węzłów:', nodes.size);
    console.log('Liczba połączeń:', edges.size);
    
    return { nodes: Array.from(nodes).map(JSON.parse), edges };
    
};

const addEdge = (edges, from, to, oneway) => {
    const fromKey = JSON.stringify(from);
    const toKey = JSON.stringify(to);

    if (!edges.has(fromKey)) edges.set(fromKey, []);
    edges.get(fromKey).push(to);

    if (oneway !== "F") { // Jeśli droga nie jest jednokierunkowa, dodaj krawędź w drugą stronę
        if (!edges.has(toKey)) edges.set(toKey, []);
        edges.get(toKey).push(from);
    }
};

// Heurystyka dla algorytmu A* (oblicza odległość euklidesową między dwoma punktami)
const heuristic = (a, b) => {
    return Math.sqrt(Math.pow(a[0] - b[0], 2) + Math.pow(a[1] - b[1], 2));
};

export const aStar = (start, goal, graph) => {
    const { nodes, edges } = graph; // Pobranie węzłów i krawędzi z grafu
    const startKey = JSON.stringify(start); // Konwersja punktu początkowego na string (dla Map)
    const goalKey = JSON.stringify(goal); // Konwersja punktu docelowego na string (dla Map)

    let openSet = new Set([startKey]); // Zbiór węzłów do odwiedzenia (zaczynamy od startowego)
    let cameFrom = new Map(); // Mapa śledząca, skąd przyszliśmy do danego węzła
    let gScore = new Map(nodes.map(node => [JSON.stringify(node), Infinity])); // Koszt dojścia do każdego węzła (Infinity na start)
    let fScore = new Map(nodes.map(node => [JSON.stringify(node), Infinity])); // Szacowany koszt do celu (Infinity na start)

    gScore.set(startKey, 0); // Koszt dojścia do punktu startowego wynosi 0
    fScore.set(startKey, heuristic(start, goal)); // Szacowany koszt od startu do celu

    while (openSet.size > 0) { // Dopóki są węzły do odwiedzenia
        let current = [...openSet].reduce((a, b) => fScore.get(a) < fScore.get(b) ? a : b); // Znalezienie węzła o najniższym fScore
        
        if (current === goalKey) { // Jeśli osiągnęliśmy cel, odtwarzamy ścieżkę
            let path = [];
            while (cameFrom.has(current)) {
                path.push(JSON.parse(current)); // Dodajemy aktualny węzeł do ścieżki
                current = cameFrom.get(current); // Przechodzimy do poprzedniego węzła
            }
            path.push(start); // Dodajemy punkt startowy na początek ścieżki
            return path.reverse(); // Odwracamy, aby uzyskać poprawną kolejność od startu do celu
        }

        openSet.delete(current); // Usuwamy aktualny węzeł z listy do odwiedzenia
        let neighbors = edges.get(current) || []; // Pobranie sąsiadów bieżącego węzła

        for (let neighbor of neighbors) { // Iterowanie przez sąsiadów
            let neighborKey = JSON.stringify(neighbor);
            let tentativeGScore = gScore.get(current) + heuristic(JSON.parse(current), neighbor); // Obliczenie nowego kosztu dojścia

            if (tentativeGScore < gScore.get(neighborKey)) { // Jeśli znaleźliśmy krótszą drogę
                cameFrom.set(neighborKey, current); // Zapisujemy skąd przyszliśmy
                gScore.set(neighborKey, tentativeGScore); // Aktualizujemy koszt dojścia
                fScore.set(neighborKey, tentativeGScore + heuristic(neighbor, goal)); // Aktualizujemy całkowity szacowany koszt
                openSet.add(neighborKey); // Dodajemy sąsiada do zbioru do odwiedzenia
            }
        }
    }
    
    return []; // Jeśli nie znaleziono ścieżki, zwracamy pustą tablicę
    
};