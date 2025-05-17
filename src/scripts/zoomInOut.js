import { viewer } from "./displayMap";

const zoomInOut = (target) => {
    const camera = viewer.camera;

    switch (target) {
        case 'in':
            camera.zoomIn(1000);
            break;
        case 'out':
            camera.zoomOut(1000);
            break;
        default:
            console.error('Invalid target for zoomInOut function');
    }
}

export { zoomInOut };