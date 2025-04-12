import * as Cesium from "cesium";
import "cesium/Build/Cesium/Widgets/widgets.css";
import Network from '../layers/Network_with_roads.json'

Cesium.Ion.defaultAccessToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiJmY2Q0MDIzZC1iODVjLTQ0ODItYWY1Yi1kNWNmNzljNzNiNmQiLCJpZCI6Mjg2NDc0LCJpYXQiOjE3NDI1NzA0MTd9.3Pa6jje6WlfLT6Dm-fn2z2waSBsLDuEAmxcIT0oDZFc";

let viewer

export async function initCesium(containerId) {

    viewer = new Cesium.Viewer('cesiumContainer', {
        terrain: Cesium.Terrain.fromWorldTerrain(),
        animation: false,
        timeline: false,
        shouldAnimate: false,
        geocoder: true
        
    });  

    viewer.scene.globe.enableLighting = true;

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


    //Pobieranie współrzędnych

    const handler = new Cesium.ScreenSpaceEventHandler(viewer.canvas);

    // Nasłuchiwanie na kliknięcia na mapie
    handler.setInputAction(function (click) {
    // Pobranie współrzędnych kliknięcia
        const ray = viewer.camera.getPickRay(click.position);
        const scene = viewer.scene;
        const intersection = scene.globe.pick(ray, scene);

        // Sprawdzamy, czy punkt przecięcia istnieje
        if (Cesium.defined(intersection)) {
            const cartographic = Cesium.Cartographic.fromCartesian(intersection);
            const longitude = Cesium.Math.toDegrees(cartographic.longitude);
            const latitude = Cesium.Math.toDegrees(cartographic.latitude);

            // Wyświetlenie współrzędnych w konsoli
            console.log(`Wpółrzędne:  ${longitude}, ${latitude}`);
            
        } else {
            console.log("Kliknięcie poza powierzchnią Ziemi");
        }
        }, Cesium.ScreenSpaceEventType.LEFT_CLICK);

    //Koniec pobierania współrzędnych

    
}

export {viewer}

