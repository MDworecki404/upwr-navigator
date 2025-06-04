import * as Cesium from 'cesium'
import { viewer } from './displayMap'
import upwrBuildings from '../layers/upwrBuildingsWithAddresses.json'


let upwrDataSource = null;
let googleTileset = null;
let OSMTileset = null;
let Wro3dTileset = null;
let handler = null;
let lastPickedFeature = null;
let highlightedEntity = null;


const show3DBuildingsGoogle = async () => {
    const checkboxGoogle = document.getElementById('3DBuildingsGoogle');
    const checkboxOSM = document.getElementById('3DBuildingsOSM');
    const checkboxWRO = document.getElementById('3DBuildingsWRO');
    if (checkboxGoogle.checked) {
        if (!googleTileset) { // Jeśli tileset jeszcze nie istnieje, tworzymy go
            try {
                viewer.scene.primitives.remove(OSMTileset)
                viewer.scene.primitives.remove(Wro3dTileset)
                viewer.dataSources.remove(upwrDataSource);
                googleTileset = await Cesium.createGooglePhotorealistic3DTileset();
                checkboxOSM.checked = false;
                checkboxWRO.checked = false;
                viewer.scene.primitives.add(googleTileset);
            } catch (error) {
                console.log(`Failed to load tileset: ${error}`);
            }
        }
    } else {
        if (googleTileset) { // Jeśli tileset istnieje, usuwamy go
            try {
                viewer.scene.primitives.remove(googleTileset);
                googleTileset = null; // Zerujemy referencję, aby można było ponownie go dodać
            } catch (error) {
                console.log(`Failed to remove tileset: ${error}`);
            }
        }
    }
}

const show3DBuildingsOSM = async () => {
    const checkboxGoogle = document.getElementById('3DBuildingsGoogle');
    const checkboxOSM = document.getElementById('3DBuildingsOSM');
    const checkboxWRO = document.getElementById('3DBuildingsWRO');


    if (checkboxOSM.checked) {
        if (!OSMTileset) { // Jeśli tileset jeszcze nie istnieje, tworzymy go
            try {
                viewer.scene.primitives.remove(googleTileset)
                viewer.scene.primitives.remove(Wro3dTileset)
                viewer.dataSources.remove(upwrDataSource);
                googleTileset = null;
                Wro3dTileset = null;
                upwrDataSource = null;
                OSMTileset = await Cesium.Cesium3DTileset.fromIonAssetId(96188);
                const translation = Cesium.Cartesian3.fromElements(0, 0, 0);
                OSMTileset.modelMatrix = Cesium.Matrix4.fromTranslation(translation);
                viewer.scene.primitives.add(OSMTileset);
            } catch (error) {
                console.log(`Failed to load tileset: ${error}`);
            }
        }
    } else {
        if (OSMTileset) { // Jeśli tileset istnieje, usuwamy go
            try {
                viewer.scene.primitives.remove(OSMTileset);
                OSMTileset = null; // Zerujemy referencję, aby można było ponownie go dodać
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
    const checkboxGoogle = document.getElementById('3DBuildingsGoogle');
    const checkboxOSM = document.getElementById('3DBuildingsOSM');
    const checkboxWRO = document.getElementById('3DBuildingsWRO');

    if (checkboxWRO.checked) {

        if (!Wro3dTileset) {
            try {
                viewer.scene.primitives.remove(googleTileset)
                viewer.scene.primitives.remove(OSMTileset)
                viewer.dataSources.remove(upwrDataSource);
                googleTileset = null;
                OSMTileset = null;
                upwrDataSource = null;
                Wro3dTileset = await Cesium.Cesium3DTileset.fromIonAssetId(3294785);
                Wro3dTileset.shadows = Cesium.ShadowMode.DISABLED;

                // Przesunięcie
                const boundingSphere = Wro3dTileset.boundingSphere;
                const cartographic = Cesium.Cartographic.fromCartesian(boundingSphere.center);
                const surface = Cesium.Cartesian3.fromRadians(cartographic.longitude, cartographic.latitude, -42.0);
                const offset = Cesium.Cartesian3.fromRadians(cartographic.longitude, cartographic.latitude, 0);
                const translation = Cesium.Cartesian3.subtract(offset, surface, new Cesium.Cartesian3());
                Wro3dTileset.modelMatrix = Cesium.Matrix4.fromTranslation(translation);

                viewer.scene.primitives.add(Wro3dTileset);

                // Event handler tylko raz
                if (!handler) {
                    handler = new Cesium.ScreenSpaceEventHandler(viewer.scene.canvas);

                    handler.setInputAction(function (movement) {
                        const picked = viewer.scene.pick(movement.endPosition);

                        if (Cesium.defined(picked) && picked.primitive === Wro3dTileset && picked instanceof Cesium.Cesium3DTileFeature) {
                            if (lastPickedFeature && lastPickedFeature !== picked) {
                                // Przywróć poprzedni kolor
                                lastPickedFeature.color = Cesium.Color.fromCssColorString('#CCCCCC').withAlpha(1.0);
                            }

                            picked.color = Cesium.Color.fromCssColorString('#3399ff').withAlpha(0.8);
                            lastPickedFeature = picked;
                        } else {
                            // Gdy nie wskazujemy nic — przywróć kolor
                            if (lastPickedFeature) {
                                lastPickedFeature.color = Cesium.Color.fromCssColorString('#CCCCCC').withAlpha(1.0);
                                lastPickedFeature = null;
                            }
                        }
                    }, Cesium.ScreenSpaceEventType.MOUSE_MOVE);
                }

                // Domyślny styl tilesetu (na szaro)
                Wro3dTileset.style = new Cesium.Cesium3DTileStyle({
                    color: "color('#CCCCCC')"
                });

            } catch (error) {
                console.log(`Failed to load tileset: ${error}`);
            }
        }

    } else {
        if (Wro3dTileset) {

            try {
                viewer.scene.primitives.remove(Wro3dTileset);
                Wro3dTileset = null;
                lastPickedFeature = null;
            } catch (error) {
                console.log(`Failed to remove tileset: ${error}`);
            }
        }
    }
};

const originalColors = new Map();


const showUPWRBuildings = async () => {
    const checkbox = document.getElementById('3DBuildingsUPWR');

    if (checkbox.checked) {
        if (!upwrDataSource) {
            upwrDataSource = await Cesium.GeoJsonDataSource.load(upwrBuildings, {
                fill: Cesium.Color.fromBytes(120, 40, 52, 255),
                stroke: Cesium.Color.fromBytes(120, 40, 52, 0),
                strokeWidth: 1.0,
                clampToGround: false // ważne: budynki mają być "w powietrzu"
            });

            viewer.scene.primitives.remove(googleTileset);
            viewer.scene.primitives.remove(OSMTileset);
            viewer.scene.primitives.remove(Wro3dTileset);
            googleTileset = null;
            OSMTileset = null;
            Wro3dTileset = null;
            viewer.dataSources.add(upwrDataSource);

            // Dodaj wysokość do każdego budynku (jeśli nie ma)
            upwrDataSource.entities.values.forEach(entity => {
                if (entity.polygon) {
                    // np. 15m wysokości — możesz zmodyfikować wg właściwości
                    entity.polygon.extrudedHeight = 165;
                    entity.polygon.height = 0;
                }
            });

            const handler = new Cesium.ScreenSpaceEventHandler(viewer.scene.canvas);

            handler.setInputAction(function (movement) {
                const pickedObject = viewer.scene.pick(movement.endPosition);

                if (Cesium.defined(pickedObject) && pickedObject.id && upwrDataSource.entities.contains(pickedObject.id)) {
                    const entity = pickedObject.id;

                    if (highlightedEntity !== entity) {
                        if (highlightedEntity && originalColors.has(highlightedEntity)) {
                            highlightedEntity.polygon.material = originalColors.get(highlightedEntity);
                        }

                        if (!originalColors.has(entity)) {
                            originalColors.set(entity, entity.polygon.material);
                        }

                        entity.polygon.material = Cesium.Color.SKYBLUE.withAlpha(0.8);
                        highlightedEntity = entity;
                    }
                } else {
                    if (highlightedEntity && originalColors.has(highlightedEntity)) {
                        highlightedEntity.polygon.material = originalColors.get(highlightedEntity);
                        highlightedEntity = null;
                    }
                }
            }, Cesium.ScreenSpaceEventType.MOUSE_MOVE);
        }
    } else {
        if (upwrDataSource) {
            viewer.dataSources.remove(upwrDataSource);
            upwrDataSource = null;
        }
    }
};


export {show3DBuildingsGoogle, show3DBuildingsOSM, show3DBuildingsWroclaw, showUPWRBuildings}