import { viewer } from "./displayMap";
import { buildGraph, aStar } from "./aStar/aStar";
import * as Cesium from 'cesium'
import BuildingData from '../data/universityBuildings.json'
import startMarkerPNG from '../assets/startMarker.png'
import endMarkerPNG from '../assets/finishMarker.png'
import gsap from "gsap";

// Zmienna do śledzenia aktywnego workera
let activeWorker = null;

const getCurrentPosition = () => {
    return new Promise((resolve, reject) => {
        // Wymuś świeżą lokalizację przez opcje
        const options = {
            enableHighAccuracy: true,
            maximumAge: 0,    // Ważne: nie używaj buforowanych danych
            timeout: 10000    // Timeout po 10 sekundach
        };
        navigator.geolocation.getCurrentPosition(resolve, reject, options);
    });
}

const userRouteFinder = async () => {
    console.log("Rozpoczęcie wyszukiwania trasy:", Date.now());
    
    // Anuluj poprzedniego workera jeśli istnieje
    if (activeWorker) {
        activeWorker.terminate();
        activeWorker = null;
    }
    
    viewer.entities.removeAll();
    const loadingIconSVG = document.querySelector('.loadingSVG');
    
    // Pokaż animację ładowania od razu
    gsap.to(loadingIconSVG, {visibility: 'visible', opacity: 1, duration: 0.5});
    gsap.fromTo(loadingIconSVG, {rotation: 0}, {rotation: "360", repeat: -1, ease: "none"});

    let startNode = [];
    try {
        const position = await getCurrentPosition();
        startNode = [position.coords.longitude, position.coords.latitude];
        console.log('Pobrano pozycję startową:', startNode);
    } catch (error) {
        console.error("Nie udało się pobrać lokalizacji:", error);
        // Ukryj animację ładowania w przypadku błędu
        gsap.to(loadingIconSVG, {opacity: 0, duration: 0.5});
        gsap.to(loadingIconSVG, {visibility: 'hidden', delay: 0.5});
        alert("Nie udało się pobrać lokalizacji. Sprawdź uprawnienia lub spróbuj ponownie.");
        return;
    }
    
    const endChoice = document.querySelector('.userEndChoice').value;
    if (!endChoice) {
        console.error("Nie wybrano budynku docelowego");
        gsap.to(loadingIconSVG, {opacity: 0, duration: 0.5});
        gsap.to(loadingIconSVG, {visibility: 'hidden', delay: 0.5});
        alert("Wybierz budynek docelowy");
        return;
    }
    
    let endNode;
    for (let building of BuildingData.buildings) {
        if (building[0].code === endChoice) {
            endNode = building[0].node;
            break; // Dodaj break po znalezieniu, dla optymalizacji
        }
    }

    if (!endNode) {
        console.error("Nie znaleziono budynku o podanym kodzie:", endChoice);
        gsap.to(loadingIconSVG, {opacity: 0, duration: 0.5});
        gsap.to(loadingIconSVG, {visibility: 'hidden', delay: 0.5});
        alert("Nie znaleziono wybranego budynku");
        return;
    }

    try {
        // Ładujemy dane sieci drogowej
        const network = await import('../layers/osm_wroclaw_roads.json');
        const selectedMode = document.querySelector('input[name="userTransportTypeRadio"]:checked').value;

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
                alert("Nie udało się znaleźć trasy. Spróbuj z innym budynkiem lub rodzajem transportu.");
                return;
            }

            // Dodaj marker startowy
            viewer.entities.add({
                position: Cesium.Cartesian3.fromDegrees(startNode[0], startNode[1]),
                billboard: {
                    image: startMarkerPNG,
                    width: 64,
                    height: 64,
                    heightReference: Cesium.HeightReference.CLAMP_TO_GROUND
                }
            });

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


            // Ukryj ikonę ładowania
            gsap.to(loadingIconSVG, {opacity: 0, duration: 0.5});
            gsap.to(loadingIconSVG, {visibility: 'hidden', delay: 0.5});
            
            // Wyśrodkuj widok na trasie
            
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

export default userRouteFinder;