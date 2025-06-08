import * as Cesium from "cesium";
import "cesium/Build/Cesium/Widgets/widgets.css";
import { popUpVisible } from "./popUpVisible";
import { rail, rail2 } from "./railVisible";

Cesium.Ion.defaultAccessToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiJmY2Q0MDIzZC1iODVjLTQ0ODItYWY1Yi1kNWNmNzljNzNiNmQiLCJpZCI6Mjg2NDc0LCJpYXQiOjE3NDI1NzA0MTd9.3Pa6jje6WlfLT6Dm-fn2z2waSBsLDuEAmxcIT0oDZFc";

let viewer

export async function initCesium(containerId) {

    viewer = new Cesium.Viewer(containerId, {
        terrain: Cesium.Terrain.fromWorldTerrain(),
        animation: false,
        timeline: false,
        shouldAnimate: false,
        geocoder: true,
        selectionIndicator : false,
        infoBox: false,
        
    });
    
    const handler = new Cesium.ScreenSpaceEventHandler();

    if (viewer) {
        const handler = new Cesium.ScreenSpaceEventHandler(viewer.scene.canvas);

        handler.setInputAction(() => {
            popUpVisible.value = false;
            rail.value = true;
            rail2.value = true;
        }, Cesium.ScreenSpaceEventType.LEFT_CLICK);
    }
    

    const fixedTime = Cesium.JulianDate.fromDate(new Date(Date.UTC(2025, 6, 1, 14, 0, 0)));

    viewer.clock.currentTime = fixedTime;
    viewer.clock.shouldAnimate = false;

    viewer.scene.globe.enableLighting = true;

    viewer.shadows = false;

    viewer.homeButton.viewModel.command.beforeExecute.addEventListener(function (e) {
        e.cancel = true; // Zapobiega domyślnemu zachowaniu
        viewer.camera.flyTo({
            destination: Cesium.Cartesian3.fromDegrees(17.086280982133945, 51.10719852112475, 5000), // 📍 Współrzędne Wrocławia
            orientation: {
                heading: Cesium.Math.toRadians(0.0),
                pitch: Cesium.Math.toRadians(-90.0), // Pochylenie kamery
                roll: 0,
            },
          duration: 2, // Czas animacji w sekundach
        });
    });

    //viewer.scene.primitives.add(
    //    await Cesium.Cesium3DTileset.fromIonAssetId(3258014),
    //);

    viewer.camera.setView({
        destination: Cesium.Cartesian3.fromDegrees(17.086280982133945, 51.10719852112475, 5000),
        orientation: {
            heading: Cesium.Math.toRadians(0.0),
            pitch: Cesium.Math.toRadians(-90.0),
        }
    });

    //viewer.dataSources.add(Cesium.GeoJsonDataSource.load(Network, {
    //    stroke: Cesium.Color.GRAY,
    //    fill: Cesium.Color.GRAY,
    //    strokeWidth: 3,
    //    clampToGround: true,
    //    
    //}));


    
}

const progressTrigger = document.querySelector('.progressTrigger')

export {viewer, progressTrigger}

