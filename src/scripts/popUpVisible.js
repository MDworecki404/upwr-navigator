import { ref } from "vue";
import { viewer } from "./displayMap";
import * as Cesium from 'cesium';

export const popUpVisible = ref(false);
export const popUpInfo = ref({
    title: '',
    description: '',

})
