import Network from '../../layers/UPWR_network.json'; // Importowanie danych o sieci drogowej w formacie GeoJSON

// Funkcja budująca graf na podstawie danych GeoJSON
export const buildGraph = () => {
    //console.log('Rozpoczęcie budowy grafu');

    let nodes = []; // Lista przechowująca unikalne węzły grafu
    let edges = new Map(); // Mapa przechowująca krawędzie (połączenia między węzłami)
    const coords = Network.features[0].geometry.coordinates; // Pobieranie współrzędnych z pierwszej geometrii w pliku JSON
    
    // Iterowanie przez każdą linię w danych GeoJSON
    coords.forEach(line => {
        for (let i = 0; i < line.length; i++) {
            const point = line[i]; // Pobranie punktu (współrzędne [x, y])
            
            // Sprawdzenie, czy punkt już istnieje w liście węzłów
            const exists = nodes.some(node => node[0] === point[0] && node[1] === point[1]);
            if (!exists) {
                nodes.push(point); // Dodanie nowego węzła, jeśli nie istnieje
            }
            
            // Dodanie krawędzi (połączenia) między kolejnymi punktami w linii
            if (i > 0) {
                const prevPoint = line[i - 1]; // Poprzedni punkt w linii
                addEdge(edges, prevPoint, point); // Dodanie połączenia (z prevPoint do point)
                addEdge(edges, point, prevPoint); // Dodanie połączenia w drugą stronę (graf nieskierowany)
            }
        }
    });
    
    //console.log('Węzły grafu:', nodes);
    //console.log('Połączenia grafu:', edges);
    return { nodes, edges }; // Zwrócenie zbudowanego grafu (węzły + krawędzie)
};

// Funkcja dodająca krawędź między dwoma punktami
const addEdge = (edges, from, to) => {
    const key = JSON.stringify(from); // Konwersja współrzędnych na string, aby móc używać ich jako klucza w Map
    
    if (!edges.has(key)) {
        edges.set(key, []); // Inicjalizacja listy sąsiadów, jeśli jeszcze nie istnieje
    }
    
    const neighbors = edges.get(key); // Pobranie listy sąsiadów
    
    // Sprawdzenie, czy krawędź już istnieje, aby uniknąć duplikacji
    if (!neighbors.some(n => n[0] === to[0] && n[1] === to[1])) {
        neighbors.push(to); // Dodanie nowego sąsiada
    }
};

// Heurystyka dla algorytmu A* (oblicza odległość euklidesową między dwoma punktami)
const heuristic = (a, b) => {
    return Math.sqrt(Math.pow(a[0] - b[0], 2) + Math.pow(a[1] - b[1], 2));
};

// Implementacja algorytmu A* do wyszukiwania najkrótszej ścieżki
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