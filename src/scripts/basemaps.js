import { viewer } from "./displayMap";
import * as Cesium from "cesium";

const changeBasemap = async (basemap) => {
    switch (basemap) {
        case "BingMapsAerial":
            viewer.imageryLayers.removeAll();
            viewer.imageryLayers.addImageryProvider(
                await Cesium.IonImageryProvider.fromAssetId(2)
            )
            break;
        case "OSM":
            viewer.imageryLayers.removeAll();
            viewer.imageryLayers.addImageryProvider(
                new Cesium.OpenStreetMapImageryProvider({
                    url : 'https://a.tile.openstreetmap.org/'
                })
            );
            break;
        case "GoogleMaps":
            viewer.imageryLayers.removeAll();
            viewer.imageryLayers.addImageryProvider(
                new Cesium.UrlTemplateImageryProvider({
                    url : 'https://mt1.google.com/vt/lyrs=r&x={x}&y={y}&z={z}',
                    maximumLevel: 19
                })
            );
            break;
        }
    }

export { changeBasemap };