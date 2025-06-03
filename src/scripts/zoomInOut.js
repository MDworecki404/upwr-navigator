import { viewer } from "./displayMap";
import * as Cesium from "cesium";

const zoomInOut = (target) => {
    const camera = viewer.camera;

    // Uzyskaj aktualną wysokość kamery nad powierzchnią Ziemi
    const cartographic = Cesium.Cartographic.fromCartesian(camera.position);
    const currentHeight = cartographic.height;

    // Zoom o 10% aktualnej wysokości
    const zoomFactor = 0.5;
    const zoomAmount = currentHeight * zoomFactor;

    // Kierunek patrzenia kamery
    const direction = camera.direction;

    // Oblicz nową pozycję kamery
    let newPosition;
    if (target === 'out') {
        newPosition = Cesium.Cartesian3.add(
            camera.position,
            Cesium.Cartesian3.multiplyByScalar(direction, -zoomAmount, new Cesium.Cartesian3()),
            new Cesium.Cartesian3()
        );
    } else if (target === 'in') {
        newPosition = Cesium.Cartesian3.add(
            camera.position,
            Cesium.Cartesian3.multiplyByScalar(direction, zoomAmount, new Cesium.Cartesian3()),
            new Cesium.Cartesian3()
        );
    } else {
        console.error('Invalid target for zoomInOut function');
        return;
    }

    // Płynne przejście kamery
    camera.flyTo({
        destination: newPosition,
        duration: 0.5, // czas animacji
        easingFunction: Cesium.EasingFunction.QUADRATIC_IN_OUT
    });
};

export { zoomInOut };
