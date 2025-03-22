import * as Cesium from "cesium";
import "cesium/Build/Cesium/Widgets/widgets.css";
import UPWRNetwork from '../layers/UPWR_network.json'

Cesium.Ion.defaultAccessToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiJmY2Q0MDIzZC1iODVjLTQ0ODItYWY1Yi1kNWNmNzljNzNiNmQiLCJpZCI6Mjg2NDc0LCJpYXQiOjE3NDI1NzA0MTd9.3Pa6jje6WlfLT6Dm-fn2z2waSBsLDuEAmxcIT0oDZFc";



// Funkcja inicjalizująca mapę
export async function initCesium(containerId) {

    const viewer = new Cesium.Viewer('cesiumContainer', {
        terrain: Cesium.Terrain.fromWorldTerrain(),
        animation: false,
        timeline: false,
        shouldAnimate: false,
        //geocoder: Cesium.IonGeocodeProviderType.GOOGLE,
        
    });  
    //const osmBuildingsTileset = await Cesium.createOsmBuildingsAsync();
    //viewer.scene.primitives.add(osmBuildingsTileset);

    //try {
    //    const tileset = await Cesium.createGooglePhotorealistic3DTileset();
    //    viewer.scene.primitives.add(tileset);
    //} catch (error) {
    //    console.log(`Failed to load tileset: ${error}`);
    //}

    viewer.homeButton.viewModel.command.beforeExecute.addEventListener(function (e) {
        e.cancel = true; // Zapobiega domyślnemu zachowaniu
        viewer.camera.flyTo({
            destination: Cesium.Cartesian3.fromDegrees(17.036280982133945, 51.11319852112475, 5000), // 📍 Współrzędne Wrocławia
            orientation: {
                heading: Cesium.Math.toRadians(0.0),
                pitch: Cesium.Math.toRadians(-90.0), // Pochylenie kamery
                roll: 0,
            },
          duration: 2, // Czas animacji w sekundach
        });
    });
  
      // Fly the camera to San Francisco at the given longitude, latitude, and height.
    viewer.camera.setView({
        destination: Cesium.Cartesian3.fromDegrees(17.036280982133945, 51.11319852112475, 5000),
        orientation: {
            heading: Cesium.Math.toRadians(0.0),
            pitch: Cesium.Math.toRadians(-90.0),
        }
    });

    const Network = viewer.dataSources.add(Cesium.GeoJsonDataSource.load(UPWRNetwork, {
        stroke: Cesium.Color.HOTPINK,
        fill: Cesium.Color.PINK,
        strokeWidth: 3,
        clampToGround: true,
        classificationType: Cesium.ClassificationType.TERRAIN
    }))

}


  
