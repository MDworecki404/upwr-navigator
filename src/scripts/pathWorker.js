import { buildGraph, aStar } from './aStar/aStar.js';

onmessage = function(e) {
    const { start, goal, network } = e.data;
    
    console.log("👷‍♂️ Worker otrzymał dane:", { start, goal });

    const graph = buildGraph(network);

    console.log("📈 Zbudowano graf:", graph.nodes.length, "węzłów");

    // znajdź najbliższe węzły
    const findNearestNode = (point, nodes) => {
        let nearest = null;
        let minDist = Infinity;

        nodes.forEach(node => {
            const dist = Math.sqrt(
                Math.pow(node[0] - point[0], 2) + Math.pow(node[1] - point[1], 2)
            );
            if (dist < minDist) {
                minDist = dist;
                nearest = node;
            }
        });

        return nearest;
    };

    const nearestStart = findNearestNode(start, graph.nodes);
    const nearestGoal = findNearestNode(goal, graph.nodes);

    console.log("🚩 Najbliższy węzeł start:", nearestStart);
    console.log("🏁 Najbliższy węzeł cel:", nearestGoal);

    const path = aStar(nearestStart, nearestGoal, graph);

    console.log("🗺️ Znaleziona ścieżka, długość:", path.length);

    postMessage({ path });
    console.log(Date.now())
};
