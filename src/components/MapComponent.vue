<script>
    import { onMounted } from "vue";
    import { initCesium } from "../scripts/displayMap";
    import './cesium.css'
    import gsap from "gsap";
    import UniversityBuildings from '../data/universityBuildings.json'
    import { ref } from "vue";
    import routeFinder from "../scripts/routeFinder";
    import { show3DBuildingsGoogle, show3DBuildingsOSM, show3DBuildingsWroclaw } from "../scripts/layers";
    import {userRouteFinder} from "../scripts/userRouteFinder";
    import 'bootstrap/dist/css/bootstrap.min.css';
    import 'bootstrap/dist/js/bootstrap.bundle.min.js'
    import userPositionFollow from "../scripts/userLocation";

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
            changeRoutingMode(){
                const routingMethodRadio = document.querySelector('input[name="typeOfRouting"]:checked').value
                switch(routingMethodRadio){
                    case "userToBuilding":
                        console.log('xd1')
                        gsap.to('.buildingToBuildingPanel', {opacity: 0, duration: 0.3})
                        gsap.to('.buildingToBuildingPanel', {visibility: 'hidden', delay: 0.3})
                        gsap.to('#userToBuildingPanel', {visibility: 'visible', delay: 0})
                        gsap.to('#userToBuildingPanel', {opacity: 1, duration: 0.3})
                        break
                    case "buildingToBuilding":
                        console.log('xd2')
                        gsap.to('#userToBuildingPanel', {opacity: 0, duration: 0.3})
                        gsap.to('#userToBuildingPanel', {visibility: 'hidden', delay: 0.3})
                        gsap.to('.buildingToBuildingPanel', {visibility: 'visible', delay: 0})
                        gsap.to('.buildingToBuildingPanel', {opacity: 1, delay: 0.1, duration: 0.3})
                        break
                }
            },
            routeFinder,
            userRouteFinder,
            show3DBuildingsGoogle,
            show3DBuildingsOSM,
            show3DBuildingsWroclaw,
            userPositionFollow
        }
    };
    
</script>

<template>
    <div id="cesiumContainer" @click="hidePanel"></div>
    <div id="otherContainer">
        <div id="loadingIcon">
            <img class="loadingSVG" src="../assets/loading-process-svgrepo-com.svg" />
        </div>
        <div id="layerPicker" @click="panelVisibility('layer')">
            <img src="../assets/layers-svgrepo-com.svg">
        </div>
        <div id="layerPanel">
            <h4>Warstwy 3D</h4>
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
            <hr style="outline: 0.5px solid white;">

            <h4>Warstwy 2D</h4>
        </div>
        <div id="navigationPicker" @click="panelVisibility('navigation')">
            <img src="../assets/route-svgrepo-com.svg">
        </div>
        <div id="userPositionPicker" @click="userPositionFollow">
            <img src="../assets/location-arrow-svgrepo-com.svg">
        </div>
        <div id="navigationPanel">
            <div id="typeOfRouting">
                <span><input @click="changeRoutingMode" type="radio" name="typeOfRouting" value="userToBuilding" class="form-check-input" ><label class="form-check-label">Użytkownik => Budynek</label></span>
                <span><input @click="changeRoutingMode" type="radio" name="typeOfRouting" value="buildingToBuilding" class="form-check-input" checked><label class="form-check-label">Budynek => Budynek</label></span>
            </div>
            <div class="buildingToBuildingPanel">
            <div id="startingBuilding">
                <span class="lead">Wybierz punkt początkowy</span>
                <select class="form-select-sm mb-1 startChoice" v-model="selectedStartBuilding">
                    <option value="">Wybierz budynek</option>
                    <option 
                        v-for="building in buildings" 
                        :key="building.code" 
                        :value="building.code"
                    >
                    {{ building.code +" - "+ building.name }}
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
                    {{ building.code +" - "+ building.name }}
                    </option>
                </select>
            </div>
            <div id="typeOfTransport">
                <span class="lead">Wybierz rodzaj transportu</span>
                <label class="form-check-label"><input type="radio" name="transportTypeRadio" value="bikeFoot" class="bikeFoot form-check-input" checked>Pieszo/Rowerem</label>
                <label class="form-check-label"><input type="radio" name="transportTypeRadio" value="car" class="car form-check-input">Samochodem</label>
            </div>

            <div id="buttonDiv">
                <button class="btn btn-secondary" @click="routeFinder" type="button">Sprawdź trasę</button>
            </div>
        </div>
        <div id="userToBuildingPanel">
            <span class="lead">Wybierz budynek</span>
            <select class="form-select-sm mb-1 userEndChoice" v-model="selectedEndBuilding">
                <option value="">Wybierz budynek</option>
                <option 
                v-for="building in buildings" 
                :key="building.code" 
                :value="building.code"
                >
                {{ building.code +" - "+ building.name }}
                </option>
            </select>
            <br>
            <span class="lead">Wybierz rodzaj transportu</span>
            <label class="form-check-label"><input type="radio" name="userTransportTypeRadio" value="bikeFoot" class="bikeFoot form-check-input" checked>Pieszo/Rowerem</label>
            <label class="form-check-label"><input type="radio" name="userTransportTypeRadio" value="car" class="car form-check-input">Samochodem</label>
            <br>
            <button class="btn btn-secondary" v-on:click="userRouteFinder">Pokaż trasę</button>
            
        </div>
    </div>
    <button class="btn btn-secondary" id="routeClear">Wyczyść trasę</button>
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
        width: 100dvw;
        height: 100dvh;
        position: fixed;
    }
    #otherContainer{
        width: 100dvw;
        height: 100dvh;
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
        z-index: 1000 !important;

        h4{
            color: white;
            margin-top: 10px;
            margin-left: 10px;
        }

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

        .layerContainer:first-of-type{
            margin-top: 0px;
        }
        hr{
            color: white;
            width: 90%;
            margin-left: 5%;
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
    #userPositionPicker{
        position: absolute;
        right: 85px;
        top: 5px;
        width: 32px;
        height: 32px;
        border-radius: 14%;
        background-color: #303336;
        border: 1px solid #444;
        opacity: 0;
        pointer-events: none;

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
        max-height: auto;
        opacity: 0;
        background-color: rgba(38, 38, 38, 0.75);
        border-radius: 10px;
        visibility: hidden;
        display: flex;
        flex-direction: column;
        font-family: sans-serif;
        padding-left: 10px;
        padding-right: 10px;

        #buildingToBuildingPanel, #userToBuildingPanel{
            position: absolute;
        }
        #userToBuildingPanel{
            visibility: hidden;
            opacity: 0;
            display: flex;
            flex-direction: column;
            width: 80%;
            color: white;
            position: absolute;
            top: 100px;
            left: 10%;
            text-align: center;
            
        }

        & > *{
            padding-top: 10px;
            padding-bottom: 10px;
        }

        #typeOfRouting{
            height: auto;
            color: white;
            
            display: flex;
            flex-direction: row;
            text-align: center;

            span{
                display: flex;
                flex-direction: column;

                input{
                    margin-left: auto;
                    margin-right: auto;
                }
            }
        }


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
        #typeOfTransport{
            width: 100%;
            text-align: center;
            color: white;
            
            label{
                width: 100%;
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

    #loadingIcon{
        
        img{
            width: 40px;
            height: 40px;
            position: absolute;
            left: calc(50% - 20px);
            bottom: 60px;
        }
        visibility: hidden;
        
        .loadingSVG{
            opacity: 0;
        }
    }

    #routeClear{
        width: 130px;
        position: absolute;
        bottom: 50px;
        left: calc(50% - 65px);
        pointer-events: none;
        opacity: 0;
    }
</style>