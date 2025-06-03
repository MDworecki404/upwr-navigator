import { viewer } from "./displayMap";
import * as Cesium from 'cesium'

const homeView = () => {
    viewer.camera.flyTo({
        destination: Cesium.Cartesian3.fromDegrees(17.086280982133945, 51.10719852112475, 5000), // 📍 Współrzędne Wrocławia
        orientation: {
            heading: Cesium.Math.toRadians(0.0),
            pitch: Cesium.Math.toRadians(-90.0), // Pochylenie kamery
            roll: 0,
        },
        duration: 2, // Czas animacji w sekundach
    });
}

export { homeView };