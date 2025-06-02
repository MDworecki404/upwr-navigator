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
            };
        },
        methods: {
            panelVisibility(panel) {
                const layerPanel = document.querySelector('#layerPanel')
                const navigationPanel = document.querySelector('#navigation_panel')
                const layerVisibility = window.getComputedStyle(layerPanel).visibility
                const navigationVisibility = window.getComputedStyle(navigationPanel).visibility

                if(panel == 'navigation'){
                    if(layerVisibility == 'visible'){
                        gsap.to('#layerPanel', {opacity: 0, duration: 0.1, ease: 'linear'})
                        gsap.to('#layerPanel', {visibility: 'hidden',zIndex: -1000, duration: 0, delay: 0.1, ease: 'linear'})
                        gsap.to('#navigation_panel', {visibility: 'visible', duration: 0, delay: 0.1, ease: 'linear'})
                        gsap.to('#navigation_panel', {opacity: 1, duration: 0.1, delay: 0.2, ease: 'linear'})
                    }
                    if(layerVisibility == 'hidden' && navigationVisibility == 'hidden'){
                        gsap.to('#navigation_panel', {visibility: 'visible', duration: 0, delay: 0, ease: 'linear'})
                        gsap.to('#navigation_panel', {opacity: 1, duration: 0.1, delay: 0, ease: 'linear'})
                    }
                }
                if(panel == 'layer'){
                    if(navigationVisibility == 'visible'){
                        gsap.to('#navigation_panel', {opacity: 0, duration: 0.1, ease: 'linear'})
                        gsap.to('#navigation_panel', {visibility: 'hidden',zIndex: -1000, duration: 0, delay: 0.1, ease: 'linear'})
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
                const navigationPanel = document.querySelector('#navigation_panel')
                const layerVisibility = window.getComputedStyle(layerPanel).visibility
                const navigationVisibility = window.getComputedStyle(navigationPanel).visibility
                if(layerVisibility == 'visible' || navigationVisibility == 'visible'){
                    
                    gsap.to('#layerPanel', {opacity: 0, duration: 0.1, ease: 'linear'})
                    gsap.to('#layerPanel', {visibility: 'hidden', duration: 0, delay: 0.1, ease: 'linear'})
                    gsap.to('#navigation_panel', {opacity: 0, duration: 0.1, ease: 'linear'})
                    gsap.to('#navigation_panel', {visibility: 'hidden', duration: 0, delay: 0.1, ease: 'linear'})
                

                }
            },
            showBuildingToBuildingPanel() {
                gsap.to('#buildingToBuilding_panel', {
                    duration: 0,
                    display: 'flex',
                    ease: 'power2.inOut'
                });
                gsap.to('#userToBuilding_panel', {
                    duration: 0,
                    display: 'none',
                    ease: 'power2.inOut'
                });
                gsap.to('#buildingToBuilding', {
                    duration: 0,
                    backgroundColor: '#28a745',
                    borderColor: '#28a745',
                    color: 'white',
                    ease: 'power2.inOut'
                });
                gsap.to('#userToBuilding', {
                    duration: 0,
                    backgroundColor: '#0d6efd',
                    borderColor: '#0d6efd',
                    color: 'white',
                    ease: 'power2.inOut'
                });
            },
            showUserToBuildingPanel() {
                gsap.to('#userToBuilding_panel', {
                    duration: 0,
                    display: 'flex',
                    ease: 'power2.inOut'
                });
                gsap.to('#buildingToBuilding_panel', {
                    duration: 0,
                    display: 'none',
                    ease: 'power2.inOut'
                });
                gsap.to('#userToBuilding', {
                    duration: 0,
                    backgroundColor: '#28a745',
                    borderColor: '#28a745',
                    color: 'white',
                    ease: 'power2.inOut'
                });
                gsap.to('#buildingToBuilding', {
                    duration: 0,
                    backgroundColor: '#0d6efd',
                    borderColor: '#0d6efd',
                    color: 'white',
                    ease: 'power2.inOut'
                });
    },
            routeFinder,
            userRouteFinder,
            show3DBuildingsGoogle,
            show3DBuildingsOSM,
            show3DBuildingsWroclaw,
            userPositionFollow,
            showUPWRBuildings,
            clearRoutes,
            zoomInOut
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
            <h4>Warstwy: </h4>
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
            <div class="layerContainer">
                <input type="checkbox" class="form-check-input"  id="UPWRBuildingsPoints" @click="showUPWRBuildings">
                <span>Budynki UPWr</span>
            </div>
        </div>
        <div id="navigationPicker" @click="panelVisibility('navigation')">
            <img src="../assets/route-svgrepo-com.svg">
        </div>
        <div id="userPositionPicker" @click="userPositionFollow">
            <svg width="800px" height="800px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <g id="SVGRepo_bgCarrier" stroke-width="0"/>            
                <g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"/>
                <g id="SVGRepo_iconCarrier"> <path id="locationArrowSVG" d="M5.36328 12.0523C4.01081 11.5711 3.33457 11.3304 3.13309 10.9655C2.95849 10.6492 2.95032 10.2673 3.11124 9.94388C3.29694 9.57063 3.96228 9.30132 5.29295 8.76272L17.8356 3.68594C19.1461 3.15547 19.8014 2.89024 20.2154 3.02623C20.5747 3.14427 20.8565 3.42608 20.9746 3.7854C21.1106 4.19937 20.8453 4.85465 20.3149 6.16521L15.2381 18.7078C14.6995 20.0385 14.4302 20.7039 14.0569 20.8896C13.7335 21.0505 13.3516 21.0423 13.0353 20.8677C12.6704 20.6662 12.4297 19.99 11.9485 18.6375L10.4751 14.4967C10.3815 14.2336 10.3347 14.102 10.2582 13.9922C10.1905 13.8948 10.106 13.8103 10.0086 13.7426C9.89876 13.6661 9.76719 13.6193 9.50407 13.5257L5.36328 12.0523Z" stroke="#303030" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/> </g>
            </svg>
        </div>
        <div id="navigation_panel">
            <div id="menu">
        <button class="btn btn-primary" id="buildingToBuilding" @click="showBuildingToBuildingPanel">Budynek - Budynek</button>
        <button class="btn btn-primary" id="userToBuilding" @click="showUserToBuildingPanel">Użytkownik - Budynek</button>
    </div>
    <div id="buildingToBuilding_panel">
        <span>Wybierz punkt początkowy</span>
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
        <span>Wybierz punkt końcowy</span>
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
        <span>Wybierz rodzaj transportu</span>
        <label class="form-check-label"><input type="radio" name="transportTypeRadio" value="bikeFoot" class="bikeFoot form-check-input" checked>Pieszo/Rowerem</label>
        <label class="form-check-label"><input type="radio" name="transportTypeRadio" value="car" class="car form-check-input">Samochodem</label>
        <button class="btn btn-secondary" @click="routeFinder" type="button">Sprawdź trasę</button>
    </div>
    <div id="userToBuilding_panel">
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
        <button class="btn btn-secondary" @click="userRouteFinder">Pokaż trasę</button>
    </div>
    </div>
    <button class="btn btn-secondary" id="routeClear" @click="clearRoutes">Wyczyść trasę</button>
    </div>
    <div id="zoomInOut">
        <span @click="zoomInOut('in')"><span>+</span></span>
        <span @click="zoomInOut('out')"><span>-</span></span>
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

    #zoomInOut{
        position: absolute;
        top: 10px;
        left: 10px;
        width: 32px;
        height: 64px;
        background-color: #fff;
        border-radius: 5%;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;

        span{
            font-size: 30px;
            height: 50%;
            color: #000;
            width: 100%;
            cursor: pointer;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;

            span{
                user-select: none;
            }


            &:hover{
            background-color: rgb(224, 224, 224);
        }
        }

        
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
        background-color: #fff;
        border: 1px solid #444;

        img{
        width: 28px;
        height: 28px;
        position: relative;
        left: 1px;
        top: 1px;
        }

        &:hover{
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
        padding-top: 5px;
        padding-bottom: 10px;
        opacity: 0;
        background-color: rgb(255, 255, 255);
        border-radius: 2px;
        outline: 2px solid rgba(173,171,171,125);
        visibility: hidden;
        display: flex;
        flex-direction: column;
        flex-wrap: wrap;
        justify-content: flex-start;
        align-items: stretch;
        align-content: stretch;
        z-index: 1000 !important;

        input[type="checkbox"]{
            outline: black 0.1px solid;
        }

        h4{
            color: rgb(0, 0, 0);
            margin-left: 10px;
        }

        .layerContainer{
            text-align: left;
            margin-left: 10px;
            margin-top: 10px;
            color: rgb(0, 0, 0);
            font-family: sans-serif;
            
            span{
                margin-left: 10px;
            }
        }

        .layerContainer:first-of-type{
            margin-top: 0px;
        }
        hr{
            color: rgb(0, 0, 0);
            width: 90%;
            margin-left: 5%;
            height: 1px;
            margin-top: 5%;
            margin-bottom: 5%;
        }
    }
    #navigationPicker{
        position: absolute;
        right: 45px;
        top: 5px;
        width: 32px;
        height: 32px;
        border-radius: 14%;
        background-color: #fff;
        border: 1px solid #444;

        img{
        width: 28px;
        height: 28px;
        margin-left: 2px;
        margin-top: 2px;
        }

        &:hover{
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
        background-color: #ffffff;
        border: 1px solid #444;

        svg{
        width: 28px;
        height: 28px;
        margin-left: 2px;
        margin-top: 2px;
        }

        &:hover{
            box-shadow: 0px 0px 50px #4488bb;
            border: 1px solid #aaeeff;
            cursor: pointer;
        }
    }
    #navigation_panel {
    position: absolute;
    top: 55px;
    right: 10px;
    z-index: 1000;
    width: 300px;
    height: auto;
    background-color: white;
    border-radius: 2px;
    outline: 2px solid rgba(173,171,171,125);
    visibility: hidden;

    #menu{
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        gap: 10px;
        padding: 10px;
        width: 100%;
        height: 100%;
    }

    #buildingToBuilding_panel{
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        gap: 10px;
        padding: 10px;
        width: 100%;
        height: 100%;
        display: none;
    }
    #userToBuilding_panel{
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        gap: 10px;
        padding: 10px;
        width: 100%;
        height: 100%;
        display: none;
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