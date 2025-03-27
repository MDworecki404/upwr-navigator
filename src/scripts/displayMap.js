import * as Cesium from "cesium";
import "cesium/Build/Cesium/Widgets/widgets.css";

Cesium.Ion.defaultAccessToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiJmY2Q0MDIzZC1iODVjLTQ0ODItYWY1Yi1kNWNmNzljNzNiNmQiLCJpZCI6Mjg2NDc0LCJpYXQiOjE3NDI1NzA0MTd9.3Pa6jje6WlfLT6Dm-fn2z2waSBsLDuEAmxcIT0oDZFc";

let viewer

export async function initCesium(containerId) {

    viewer = new Cesium.Viewer('cesiumContainer', {
        terrain: Cesium.Terrain.fromWorldTerrain(),
        animation: false,
        timeline: false,
        shouldAnimate: false,
        
        geocoder: Cesium.IonGeocodeProviderType.GOOGLE,
        
    });  

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



}

export {viewer}

