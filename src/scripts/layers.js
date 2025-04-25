import * as Cesium from 'cesium'
import { viewer } from './displayMap'
import upwrBuildings from '../layers/upwrBuildingsWithAddresses.json'


let tileset = null; // Przechowujemy referencję do tilesetu
let upwrDataSource = null;

const show3DBuildingsGoogle = async () => {
    const checkbox = document.getElementById('3DBuildingsGoogle');
    if (checkbox.checked) {
        if (!tileset) { // Jeśli tileset jeszcze nie istnieje, tworzymy go
            document.getElementById('3DBuildingsOSM').setAttribute('disabled', '')
            document.getElementById('3DBuildingsWroclaw').setAttribute('disabled', '')
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
            document.getElementById('3DBuildingsWroclaw').removeAttribute('disabled', '')
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
        document.getElementById('3DBuildingsWroclaw').setAttribute('disabled', '')
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
            document.getElementById('3DBuildingsWroclaw').removeAttribute('disabled', '')
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

const show3DBuildingsWroclaw = async () => {
    const checkbox = document.getElementById('3DBuildingsWroclaw');

    if (checkbox.checked) {
        document.getElementById('3DBuildingsGoogle').setAttribute('disabled', '')
        document.getElementById('3DBuildingsOSM').setAttribute('disabled', '')
        if (!tileset) { // Jeśli tileset jeszcze nie istnieje, tworzymy go
            try {
                tileset = await Cesium.Cesium3DTileset.fromIonAssetId(3294785)
                
                tileset.shadows = Cesium.ShadowMode.DISABLED;

                const boundingSphere = tileset.boundingSphere;
                const cartographic = Cesium.Cartographic.fromCartesian(boundingSphere.center);
            
                const surface = Cesium.Cartesian3.fromRadians(cartographic.longitude, cartographic.latitude, 0.0);
                const offset = Cesium.Cartesian3.fromRadians(cartographic.longitude, cartographic.latitude, 42); 
            
                const translation = Cesium.Cartesian3.subtract(offset, surface, new Cesium.Cartesian3());
                tileset.modelMatrix = Cesium.Matrix4.fromTranslation(translation);
            
                tileset.style = new Cesium.Cesium3DTileStyle({
                    color: "color('#CCCCCC')"
                })

                viewer.scene.primitives.add(tileset)


            } catch (error) {
                console.log(`Failed to load tileset: ${error}`)
            }
        }
    } else {
        if (tileset) { // Jeśli tileset istnieje, usuwamy go
            document.getElementById('3DBuildingsGoogle').removeAttribute('disabled', '')
            document.getElementById('3DBuildingsOSM').removeAttribute('disabled', '')
            try {
                viewer.scene.primitives.remove(tileset)
                tileset = null // Zerujemy referencję, aby można było ponownie go dodać
            } catch (error) {
                console.log(`Failed to remove tileset: ${error}`)
            }
        }
    }
}

const showUPWRBuildingsPoints = async () => {
    const checkbox = document.getElementById('UPWRBuildingsPoints');

    if (checkbox.checked) {
        if (!upwrDataSource) {
            upwrDataSource = await Cesium.GeoJsonDataSource.load(upwrBuildings, {
                stroke: Cesium.Color.fromBytes(120,40,52,255),
                fill: Cesium.Color.fromBytes(120,40,52,255),
                strokeWidth: 3,
                clampToGround: true,
            });
            viewer.dataSources.add(upwrDataSource);
        }
    } else {
        if (upwrDataSource) {
            viewer.dataSources.remove(upwrDataSource);
            upwrDataSource = null;
        }
    }
};

export {show3DBuildingsGoogle, show3DBuildingsOSM, show3DBuildingsWroclaw, showUPWRBuildingsPoints}