import * as Cesium from 'cesium'
import { viewer } from './displayMap'

let tileset = null; // Przechowujemy referencję do tilesetu

const show3DBuildingsGoogle = async () => {
    const checkbox = document.getElementById('3DBuildingsGoogle');
    if (checkbox.checked) {
        if (!tileset) { // Jeśli tileset jeszcze nie istnieje, tworzymy go
            document.getElementById('3DBuildingsOSM').setAttribute('disabled', '')
            try {
                tileset = await Cesium.createGooglePhotorealistic3DTileset();
                viewer.scene.primitives.add(tileset);
            } catch (error) {
                console.log(`Failed to load tileset: ${error}`);
            }
        }
    } else {
        if (tileset) { // Jeśli tileset istnieje, usuwamy go
            document.getElementById('3DBuildingsOSM').removeAttribute('disabled', '')
            try {
                viewer.scene.primitives.remove(tileset);
                tileset = null; // Zerujemy referencję, aby można było ponownie go dodać
            } catch (error) {
                console.log(`Failed to remove tileset: ${error}`);
            }
        }
    }
}

const show3DBuildingsOSM = async () => {
    const checkbox = document.getElementById('3DBuildingsOSM');


    if (checkbox.checked) {
        document.getElementById('3DBuildingsGoogle').setAttribute('disabled', '')
        if (!tileset) { // Jeśli tileset jeszcze nie istnieje, tworzymy go
            try {
                tileset = await Cesium.createOsmBuildingsAsync();
                viewer.scene.primitives.add(tileset);
            } catch (error) {
                console.log(`Failed to load tileset: ${error}`);
            }
        }
    } else {
        if (tileset) { // Jeśli tileset istnieje, usuwamy go
            document.getElementById('3DBuildingsGoogle').removeAttribute('disabled', '')
            try {
                viewer.scene.primitives.remove(tileset);
                tileset = null; // Zerujemy referencję, aby można było ponownie go dodać
            } catch (error) {
                console.log(`Failed to remove tileset: ${error}`);
            }
        }
    }
    
}

//Do dodania
//const tileset = viewer.scene.primitives.add(
//    await Cesium.Cesium3DTileset.fromIonAssetId(3294785),
//);

export {show3DBuildingsGoogle, show3DBuildingsOSM}