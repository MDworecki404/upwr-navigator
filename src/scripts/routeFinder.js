import { viewer } from "./displayMap";
import * as Cesium from 'cesium'
import BuildingData from '../data/universityBuildings.json'
import startMarkerPNG from '../assets/startMarker.png'
import endMarkerPNG from '../assets/finishMarker.png'
import gsap from "gsap";

// Zmienna do śledzenia aktywnego workera
let activeWorker = null;

const routeFinder = async () => {
    gsap.to('#routeClear', {opacity: 0, pointerEvents: 'none', duration: 0.2})
    console.log("Rozpoczęcie wyszukiwania trasy:", Date.now());
    
    // Anuluj poprzedniego workera jeśli istnieje
    if (activeWorker) {
        activeWorker.terminate();
        activeWorker = null;
    }
    
    viewer.entities.removeAll();
    const loadingIconSVG = document.querySelector('.loadingSVG');
    
    const startChoice = document.querySelector('.startChoice').value;
    const endChoice = document.querySelector('.endChoice').value;

    // Sprawdzenie czy wybrano budynki
    if (!startChoice || !endChoice) {
        console.error("Nie wybrano budynków");
        alert("Wybierz budynki początkowy i docelowy");
        return;
    }

    let startNode, endNode;

    // Znajdowanie węzłów dla wybranych budynków
    for (let building of BuildingData.buildings) {
        if (building[0].code === startChoice) {
            startNode = building[0].node;
        }
        if (building[0].code === endChoice) {
            endNode = building[0].node;
        }
        // Przerwij pętlę, jeśli już znaleziono oba budynki
        if (startNode && endNode) break;
    }

    if (!startNode || !endNode) {
        console.error("Nie znaleziono wybranych budynków.");
        alert("Nie znaleziono wybranych budynków. Spróbuj ponownie wybrać budynki.");
        return;
    } 
    
    // Pokaż animację ładowania
    gsap.to(loadingIconSVG, {visibility: 'visible', opacity: 1, duration: 0.5});
    gsap.fromTo(loadingIconSVG, {rotation: 0}, {rotation: "360", repeat: -1, ease: "none"});

    try {
        // Ładujemy dane sieci drogowej
        const network = await import('../layers/osm_wroclaw_roads.json');
        const selectedMode = document.querySelector('input[name="transportTypeRadio"]:checked').value;

        // Tworzymy nowego workera
        activeWorker = new Worker(new URL('./pathWorker.js', import.meta.url), { type: 'module' });

        // Ustawiamy timeout - jeśli worker nie odpowie w 30 sekund, przerywamy
        const workerTimeout = setTimeout(() => {
            if (activeWorker) {
                console.warn("Worker timeout - przerywanie");
                activeWorker.terminate();
                activeWorker = null;
                gsap.to(loadingIconSVG, {opacity: 0, duration: 0.5});
                gsap.to(loadingIconSVG, {visibility: 'hidden', delay: 0.5});
                alert("Obliczanie trasy zajęło zbyt dużo czasu. Spróbuj ponownie.");
            }
        }, 30000);

        // Wysyłamy dane do workera
        activeWorker.postMessage({
            start: startNode,
            goal: endNode,
            network: network.default,
            mode: selectedMode
        });

        // Reakcja na otrzymanie ścieżki z workera
        activeWorker.onmessage = function(e) {
            clearTimeout(workerTimeout);
            const { path } = e.data;

            if (!path || path.length === 0) {
                console.warn("Brak trasy.");
                gsap.to(loadingIconSVG, {opacity: 0, duration: 0.5});
                gsap.to(loadingIconSVG, {visibility: 'hidden', delay: 0.5});
                alert("Nie udało się znaleźć trasy. Spróbuj z innymi budynkami lub rodzajem transportu.");
                activeWorker.terminate();
                activeWorker = null;
                return;
            }

            // Dodaj trasę
            const positions = path.map(coord => Cesium.Cartesian3.fromDegrees(coord[0], coord[1]));
            viewer.entities.add({
                polyline: {
                    positions: positions,
                    width: 7,
                    material: new Cesium.PolylineOutlineMaterialProperty({
                        color: Cesium.Color.DEEPSKYBLUE,
                        outlineWidth: 3,
                        outlineColor: Cesium.Color.DIMGRAY
                    }),
                    clampToGround: true
                }
            });

            // Dodaj marker końcowy
            viewer.entities.add({
                position: Cesium.Cartesian3.fromDegrees(endNode[0], endNode[1]),
                billboard: {
                    image: endMarkerPNG,
                    width: 64,
                    height: 64,
                    heightReference: Cesium.HeightReference.CLAMP_TO_GROUND
                }
            });

            // Ukryj ikonę ładowania
            gsap.to('#userPositionPicker', {opacity: 1, pointerEvents: 'auto', duration: 0.5})
            gsap.to('#routeClear', {opacity: 1, pointerEvents: 'auto', duration: 0.2})
            gsap.to(loadingIconSVG, {opacity: 0, duration: 1})
            gsap.to(loadingIconSVG, {visibility: 'hidden', delay: 1})
            
            
            // Zakończ workera
            activeWorker.terminate();
            activeWorker = null;
        };

        // Obsługa błędów workera
        activeWorker.onerror = function(error) {
            clearTimeout(workerTimeout);
            console.error("Błąd workera:", error);
            gsap.to(loadingIconSVG, {opacity: 0, duration: 0.5});
            gsap.to(loadingIconSVG, {visibility: 'hidden', delay: 0.5});
            alert("Wystąpił błąd podczas wyszukiwania trasy. Spróbuj ponownie.");
            activeWorker.terminate();
            activeWorker = null;
        };
    } catch (error) {
        console.error("Błąd podczas wyszukiwania trasy:", error);
        gsap.to(loadingIconSVG, {opacity: 0, duration: 0.5});
        gsap.to(loadingIconSVG, {visibility: 'hidden', delay: 0.5});
        alert("Wystąpił nieoczekiwany błąd. Spróbuj ponownie.");
    }
};

export default routeFinder;