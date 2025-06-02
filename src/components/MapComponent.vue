<script>
    import { onMounted } from "vue";
    import { initCesium } from "../scripts/displayMap";
    import './cesium.css'
    import gsap from "gsap";
    import UniversityBuildings from '../data/universityBuildings.json'
    import { ref } from "vue";
    import routeFinder from "../scripts/routeFinder";
    import { show3DBuildingsGoogle, show3DBuildingsOSM, show3DBuildingsWroclaw, showUPWRBuildings } from "../scripts/layers";
    import {userRouteFinder} from "../scripts/userRouteFinder";
    import 'bootstrap/dist/css/bootstrap.min.css';
    import 'bootstrap/dist/js/bootstrap.bundle.min.js'
    import {userPositionFollow} from "../scripts/userLocation";
    import { clearRoutes } from "../scripts/clearRoutes";
    import {zoomInOut} from "../scripts/zoomInOut";

    export default {
        setup() {
        const buildings = ref(UniversityBuildings.buildings.flat()); // Używamy danych z importowanego JSON
        const selectedStartBuilding = ref('');
        const selectedEndBuilding = ref('');
        onMounted(() => {
            initCesium("cesiumContainer");
        });
        return {
                buildings,
                selectedStartBuilding,
                selectedEndBuilding,
            }
        },
        methods: {
            show3DBuildingsGoogle,
            show3DBuildingsOSM,
            show3DBuildingsWroclaw,
            showUPWRBuildings,
        }
    }
        
</script>

<template>
    <div id="cesiumContainer" @click="hidePanel"></div>
    <v-card title="Warstwy" class="layerPanel position-absolute top-0 right-0 w-auto ">
            <v-checkbox @click="show3DBuildingsGoogle" id="3DBuildingsGoogle" class="layerCheckbox" color="info" label="Budynki 3D Google"></v-checkbox>
            <v-checkbox @click="show3DBuildingsOSM" id="3DBuildingsOSM" class="layerCheckbox" color="info" label="Budynki OpenStreetMap"></v-checkbox>
            <v-checkbox @click="show3DBuildingsWroclaw" id="3DBuildingsWRO" class="layerCheckbox" color="info" label="Budynki 3D Wrocław LOD1"></v-checkbox>
            <v-checkbox @click="showUPWRBuildings" id="3DBuildingsUPWR" class="layerCheckbox" color="info" label="Budynki UPWr"></v-checkbox>
    </v-card>
</template>

<style lang="scss">

    #cesiumContainer{
        width: 100vw;
        height: 100vh;
        position: absolute;
        top: 0;
        left: 0;
    }

    .layerPanel{
        margin-top: 50px;
        margin-right: 25px;
        padding: 5px;
    }
    .layerCheckbox{
        height: 40px;
    }
    
    
</style>