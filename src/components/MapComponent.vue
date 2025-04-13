<script>
    import { onMounted } from "vue";
    import { initCesium } from "../scripts/displayMap";
    import './cesium.css'
    import gsap from "gsap";
    import UniversityBuildings from '../data/universityBuildings.json'
    import { ref } from "vue";
    import routeFinder from "../scripts/routeFinder";
    import { show3DBuildingsGoogle, show3DBuildingsOSM, show3DBuildingsWroclaw } from "../scripts/layers";
    import 'bootstrap/dist/css/bootstrap.min.css';
    import 'bootstrap/dist/js/bootstrap.bundle.min.js'

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
            };
        },
        methods: {
            panelVisibility(panel) {
                const layerPanel = document.querySelector('#layerPanel')
                const navigationPanel = document.querySelector('#navigationPanel')
                const layerVisibility = window.getComputedStyle(layerPanel).visibility
                const navigationVisibility = window.getComputedStyle(navigationPanel).visibility

                if(panel == 'navigation'){
                    if(layerVisibility == 'visible'){
                        gsap.to('#layerPanel', {opacity: 0, duration: 0.1, ease: 'linear'})
                        gsap.to('#layerPanel', {visibility: 'hidden', duration: 0, delay: 0.1, ease: 'linear'})
                        gsap.to('#navigationPanel', {visibility: 'visible', duration: 0, delay: 0.1, ease: 'linear'})
                        gsap.to('#navigationPanel', {opacity: 1, duration: 0.1, delay: 0.2, ease: 'linear'})
                    }
                    if(layerVisibility == 'hidden' && navigationVisibility == 'hidden'){
                        gsap.to('#navigationPanel', {visibility: 'visible', duration: 0, delay: 0, ease: 'linear'})
                        gsap.to('#navigationPanel', {opacity: 1, duration: 0.1, delay: 0, ease: 'linear'})
                    }
                }
                if(panel == 'layer'){
                    if(navigationVisibility == 'visible'){
                        gsap.to('#navigationPanel', {opacity: 0, duration: 0.1, ease: 'linear'})
                        gsap.to('#navigationPanel', {visibility: 'hidden', duration: 0, delay: 0.1, ease: 'linear'})
                        gsap.to('#layerPanel', {visibility: 'visible', duration: 0, delay: 0.1, ease: 'linear'})
                        gsap.to('#layerPanel', {opacity: 1, duration: 0.1, delay: 0.1, ease: 'linear'})
                    }
                    if(layerVisibility == 'hidden' && navigationVisibility == 'hidden'){
                        gsap.to('#layerPanel', {visibility: 'visible', duration: 0, delay: 0, ease: 'linear'})
                        gsap.to('#layerPanel', {opacity: 1, duration: 0.1, delay: 0, ease: 'linear'})
                    }
                }

            },
            hidePanel(){
                const layerPanel = document.querySelector('#layerPanel')
                const navigationPanel = document.querySelector('#navigationPanel')
                const layerVisibility = window.getComputedStyle(layerPanel).visibility
                const navigationVisibility = window.getComputedStyle(navigationPanel).visibility
                if(layerVisibility == 'visible' || navigationVisibility == 'visible'){
                    
                    gsap.to('#layerPanel', {opacity: 0, duration: 0.1, ease: 'linear'})
                    gsap.to('#layerPanel', {visibility: 'hidden', duration: 0, delay: 0.1, ease: 'linear'})
                    gsap.to('#navigationPanel', {opacity: 0, duration: 0.1, ease: 'linear'})
                    gsap.to('#navigationPanel', {visibility: 'hidden', duration: 0, delay: 0.1, ease: 'linear'})
                }
            },
            routeFinder,
            show3DBuildingsGoogle,
            show3DBuildingsOSM,
            show3DBuildingsWroclaw
        }
    };
    
</script>

<template>
    <div id="cesiumContainer" @click="hidePanel"></div>
    <div id="otherContainer">
        <div class="progress">
            <div class="progress-bar progressTrigger" role="progressbar" style="width: 0%" aria-valuemin="0" aria-valuemax="100"></div>
        </div>
        <div id="layerPicker" @click="panelVisibility('layer')">
            <img src="../assets/layers-svgrepo-com.svg">
        </div>
        <div id="layerPanel">
            <div class="layerContainer">
                <input type="checkbox" class="form-check-input"  id="3DBuildingsGoogle" @click="show3DBuildingsGoogle">
                <span>Budynki 3D Google</span>
            </div>
            <div class="layerContainer">
                <input type="checkbox" class="form-check-input" id="3DBuildingsOSM" @click="show3DBuildingsOSM">
                <span>Budynki 3D OpenStreetMap</span>
            </div>
            <div class="layerContainer">
                <input type="checkbox" class="form-check-input" id="3DBuildingsWroclaw" @click="show3DBuildingsWroclaw">
                <span>Budynki 3D Wrocław LOD1</span>
            </div>
        </div>
        <div id="navigationPicker" @click="panelVisibility('navigation')">
            <img src="../assets/route-svgrepo-com.svg">
        </div>
        <div id="navigationPanel">
            <div id="startingBuilding">
                <span class="lead">Wybierz punkt początkowy</span>
                <select class="form-select-sm mb-1 startChoice" v-model="selectedStartBuilding">
                    <option value="">Wybierz budynek</option>
                    <option 
                        v-for="building in buildings" 
                        :key="building.code" 
                        :value="building.code"
                    >
                    {{ building.code }}
                    </option>
                </select>
                <br><br>
            </div>
            <div id="endBuilding">
                <span class="lead">Wybierz punkt końcowy</span>
                <select class="form-select-sm mb-1 endChoice" v-model="selectedEndBuilding">
                    <option value="">Wybierz budynek</option>
                    <option 
                    v-for="building in buildings" 
                    :key="building.code" 
                    :value="building.code"
                    >
                    {{ building.code }}
                    </option>
                </select>
            </div>
            <div id="buttonDiv">
                <button class="btn btn-secondary" @click="routeFinder" type="button">Sprawdź trasę</button>
            </div>
        </div>
    </div>
</template>

<style lang="scss">

    @font-face {
        font-family: Roboto;
        src: url(../assets/Roboto/Roboto-VariableFont_wdthwght.ttf);
    }
    *{
        font-family: Roboto;
    }

    #cesiumContainer{
        width: 100vw;
        height: 100vh;
        position: fixed;
    }
    #otherContainer{
        width: 100vw;
        height: 100vh;
        position: fixed;
    }
    #otherContainer {
        pointer-events: none;
    }

    #otherContainer > * {
        pointer-events: auto;
    }
    
    #layerPicker{
        position: absolute;
        right: 5px;
        top: 5px;
        width: 32px;
        height: 32px;
        border-radius: 14%;
        background-color: #303336;
        border: 1px solid #444;

        img{
        width: 28px;
        height: 28px;
        margin-left: 2px;
        margin-top: 2px;
        }

        &:hover{
            background-color: #4488bb;
            box-shadow: 0px 0px 50px #4488bb;
            border: 1px solid #aaeeff;
            cursor: pointer;
        }
    }
    
    #layerPanel{
        position: absolute;
        top: 45px;
        right: 5px;
        width: 300px;
        max-width: 90vw;
        min-height: 200px;
        max-height: 801px;
        opacity: 0;
        background-color: rgba(38, 38, 38, 0.75);
        border-radius: 10px;
        visibility: hidden;
        display: flex;
        flex-direction: column;
        flex-wrap: wrap;
        justify-content: flex-start;
        align-items: stretch;
        align-content: stretch;

        .layerContainer{
            text-align: left;
            margin-left: 10px;
            margin-top: 10px;
            color: white;
            font-family: sans-serif;

            
            
            span{
                margin-left: 10px;
            }
        }
    }
    #navigationPicker{
        position: absolute;
        right: 45px;
        top: 5px;
        width: 32px;
        height: 32px;
        border-radius: 14%;
        background-color: #303336;
        border: 1px solid #444;

        img{
        width: 28px;
        height: 28px;
        margin-left: 2px;
        margin-top: 2px;
        }

        &:hover{
            background-color: #4488bb;
            box-shadow: 0px 0px 50px #4488bb;
            border: 1px solid #aaeeff;
            cursor: pointer;
        }
    }
    #navigationPanel{
        position: absolute;
        top: 45px;
        right: 5px;
        background-color: white;
        width: 300px;
        max-width: 90vw;
        min-height: 200px;
        max-height: 801px;
        opacity: 0;
        background-color: rgba(38, 38, 38, 0.75);
        border-radius: 10px;
        visibility: hidden;
        display: grid;
        grid-template-columns: 1fr;
        grid-template-rows: repeat(3, 1fr);
        grid-column-gap: 0px;
        grid-row-gap: 10px;
        font-family: sans-serif;
        padding: 10px;


        #startingBuilding{
            width: 100%;
            text-align: center;
            color: white;
            display: flex;
            flex-direction: column;
            flex-wrap: nowrap;
            justify-content: center;
            align-items: flex-start;
            align-content: flex-start;
            
            
            select{
                width: 75%;
                margin-left: auto;
                margin-right: auto;
            }
            span{
                width: 100%;
                text-align: center;
                font-size: 25px;
            }
        }
        #endBuilding{
            width: 100%;
            text-align: center;
            color: white;
            
            select{
                width: 75%;
                margin-left: auto;
                margin-right: auto;
            }
            span{
                width: 100%;
                text-align: center;
                font-size: 25px;
            }
        }
        #buttonDiv{
            width: 100%;
            text-align: center;
        }
        
    }
    .progress{
        width: 200px;
        height: 20px;
        position: absolute;
        left: calc(50vw - 100px);
        bottom: 50px;
        z-index: 100;
        border-radius: 10%;

    }
</style>