import { viewer } from "./displayMap";
import { buildGraph, aStar } from "./aStar/aStar";
import * as Cesium from 'cesium'
import BuildingData from '../data/universityBuildings.json'
import startMarkerPNG from '../assets/startMarker.png'
import endMarkerPNG from '../assets/finishMarker.png'
import gsap from "gsap";


const routeFinder = async () => {
    console.log(Date.now())
    viewer.entities.removeAll();
    gsap.to('#routeClear', {opacity: 0, pointerEvents: 'none', duration: 0.2})
    const loadingIconSVG = document.querySelector('.loadingSVG')
    

    const startChoice = document.querySelector('.startChoice').value;
    const endChoice = document.querySelector('.endChoice').value;

    let startNode, endNode;

    for (let building of BuildingData.buildings) {
        if (building[0].code === startChoice) {
            startNode = building[0].node;
        }
        if (building[0].code === endChoice) {
            endNode = building[0].node;
        }
    }

    if (!startNode || !endNode) {
        console.error("Nie znaleziono budynków.");
        return;
    } else {
        gsap.to(loadingIconSVG, {visibility: 'visible', opacity: 1, duration: 1})
        gsap.fromTo(loadingIconSVG, {rotation: 0}, {rotation: "360", repeat: -1, ease: "none"})
    }

    // Ładujemy dane sieci drogowej (do przesłania do workera)
    const network = await import('../layers/osm_wroclaw_roads.json');

    // Uruchamiamy workera (UPEWNIJ się że masz pathWorker.js obok)
    const worker = new Worker(new URL('./pathWorker.js', import.meta.url), { type: 'module' });

    const selectedMode = document.querySelector('input[name="transportTypeRadio"]:checked').value

    // Wysyłamy dane do workera
    worker.postMessage({
        start: startNode,
        goal: endNode,
        network: network.default,
        mode: selectedMode
    });

    // Reakcja na otrzymanie ścieżki z workera
    worker.onmessage = function(e) {
        const { path } = e.data;

        if (!path || path.length === 0) {
            console.warn("Brak trasy.");
            return;
        }

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

        viewer.entities.add({
            position: Cesium.Cartesian3.fromDegrees(endNode[0], endNode[1]),
            billboard: {
                image: endMarkerPNG,
                width: 64,
                height: 64,
                heightReference: Cesium.HeightReference.CLAMP_TO_GROUND
            }
        });

        gsap.to('#userPositionPicker', {opacity: 1, pointerEvents: 'auto', duration: 0.5})
        gsap.to('#routeClear', {opacity: 1, pointerEvents: 'auto', duration: 0.2})
        gsap.to(loadingIconSVG, {opacity: 0, duration: 1})
        gsap.to(loadingIconSVG, {visibility: 'hidden', delay: 1})
    };
    
};


export default routeFinder