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
    import { homeView } from "../scripts/homeView";
    import { changeBasemap } from "../scripts/basemaps";
    import PopUpComponent from "./PopUpComponent.vue";
    import { rail, rail2 } from "../scripts/railVisible";
    import { watch } from "vue";


    export default {
        setup() {
        const buildings = ref(UniversityBuildings.buildings.flat()); // Używamy danych z importowanego JSON
        const selectedStartBuilding = ref();
        const selectedEndBuilding = ref();
        const selectedMode = ref('bikeFoot');
        const drawer = ref(true)
        const drawer2 = ref(true)
        const layerCheckboxes = ref({
            google: false,
            osm: false,
            wroclaw: false,
            upwr: false
        });
        const baseMapRadio = ref('bma');

        watch(rail, (newValue) => {
            if(newValue === false) rail2.value = true
        })
        watch(rail2, (newValue) => {
            if(newValue === false) rail.value = true
        })

        onMounted(() => {
            initCesium("cesiumContainer");
        });
        return {
                buildings,
                selectedStartBuilding,
                selectedEndBuilding,
                selectedMode,
                layerCheckboxes,
                baseMapRadio,
                drawer,
                drawer2,
                rail,
                rail2

            }
        },
        components: {
            PopUpComponent
        },
        methods: {
            show3DBuildingsGoogle,
            show3DBuildingsOSM,
            show3DBuildingsWroclaw,
            showUPWRBuildings,
            userPositionFollow,
            homeView,
            zoomInOut,
            clearRoutes,
            changeBasemap,
            callRouteFinder(){
                if(!this.selectedStartBuilding || !this.selectedEndBuilding){
                    alert("Wybierz budynki początkowy i końcowy");
                    return;
                }

                routeFinder(
                    this.selectedStartBuilding,
                    this.selectedEndBuilding,
                    this.selectedMode
                );
            },
            callUserRouteFinder(){
                if(!this.selectedEndBuilding){
                    alert("Wybierz budynek końcowy");
                    return;
                }

                userRouteFinder(
                    this.selectedEndBuilding,
                    this.selectedMode
                );
            },
            async toggleGoogleLayer() {
                this.layerCheckboxes.osm = false;
                this.layerCheckboxes.wroclaw = false;
                this.layerCheckboxes.upwr = false;
                await show3DBuildingsGoogle();
                
            },
            async toggleOSMLayer() {
                this.layerCheckboxes.google = false;
                this.layerCheckboxes.wroclaw = false;
                this.layerCheckboxes.upwr = false;
                await show3DBuildingsOSM();
                
            },
            async toggleWroLayer() {
                this.layerCheckboxes.google = false;
                this.layerCheckboxes.osm = false;
                this.layerCheckboxes.upwr = false;
                await show3DBuildingsWroclaw();
                
            },
            async toggleUPWRLayer() {
                this.layerCheckboxes.google = false;
                this.layerCheckboxes.osm = false;
                this.layerCheckboxes.wroclaw = false;
                await showUPWRBuildings();
                
            }
        }
    }
        
</script>

<template>
    <PopUpComponent></PopUpComponent>
    <div id="cesiumContainer" @click="hidePanel"></div>
    <v-fab 
        id="loadingIcon" 
        icon="mdi-cog-outline" >
    </v-fab>
    <v-fab 
        @click="userPositionFollow"
        class="position-absolute bottom-0 left-0 mt-5 ml-5 mb-5" 
        icon="mdi-navigation-variant-outline">
    </v-fab>
    <v-fab 
        @click="clearRoutes"
        id="routeClear"
        class="clearRouteButton position-absolute bottom-0 left-0" 
        icon="mdi-close">
    </v-fab>
    <v-fab 
        @click="homeView"
        class="homeButton position-absolute bottom-0 left-0 mt-5 ml-5 mb-" 
        icon="mdi-home">
    </v-fab>
    <v-fab 
        @click="zoomInOut('out')"
        class="zoomOut position-absolute bottom-0 left-0 mt-5 ml-5 mb-" 
        icon="mdi-minus">
    </v-fab>
    <v-fab 
        @click="zoomInOut('in')"
        class="zoomIn position-absolute bottom-0 left-0 mt-5 ml-5 mb-" 
        icon="mdi-plus">
    </v-fab>
    <v-navigation-drawer
        v-model="drawer"
        :rail="rail"
        permanent
        :width="320"
        location="right"
        elevation="12"
        @click = "rail = false"
        style="height: min-content; max-height: 80vh; overflow: hidden;"
        class="m-2"
    >

    <v-list-item prepend-icon="mdi-layers" title="Warstwy"
        @click.stop="rail = !rail"
    >
        <template v-slot:append>
            <v-btn
            icon="mdi-chevron-left"
            variant="text"
        
            ></v-btn>
        </template>
    </v-list-item>
    <v-list-item v-if="!rail">
    <v-radio-group v-model="baseMapRadio">
            <v-radio @change="changeBasemap('BingMapsAerial')" label="Bing Maps Aerial" value="bma" />
            <v-radio @change="changeBasemap('OSM')" label="OpenStreetMap" value="osm" />
            <v-radio @change="changeBasemap('GoogleMaps')" label="Google Maps" value="googlemaps" />
        </v-radio-group>
        <v-divider></v-divider>
        <v-checkbox
            @click="toggleGoogleLayer"
            id="3DBuildingsGoogle"
            v-model="layerCheckboxes.google"
            class="layerCheckbox ma-0 pa-0"
            color="info"
            label="Budynki 3D Google"
        />
        <v-checkbox
            @click="toggleOSMLayer"
            id="3DBuildingsOSM"
            v-model="layerCheckboxes.osm"
            class="layerCheckbox ma-0 pa-0"
            color="info"
            label="Budynki OpenStreetMap"
        />
        <v-checkbox
            @click="toggleWroLayer"
            id="3DBuildingsWRO"
            v-model="layerCheckboxes.wroclaw"
            class="layerCheckbox ma-0 pa-0"
            color="info"
            label="Budynki 3D Wrocław LOD1"
        />
        <v-checkbox
            @click="toggleUPWRLayer"
            id="3DBuildingsUPWR"
            v-model="layerCheckboxes.upwr"
            class="layerCheckbox ma-0 pa-0"
            color="info"
            label="Budynki UPWr"
        />
        </v-list-item>
    </v-navigation-drawer>
    <v-navigation-drawer
        v-model="drawer2"
        :rail="rail2"
        :width="320"
        location="right"
        elevation="12"
        @click = "rail2 = false"
        style="height: min-content; max-height: 80vh;"
        class="v-navigation-drawer mr-6 mt-2"
    >
    <v-list-item prepend-icon="mdi-map-marker-path" title="Nawigacja"
        @click.stop="rail2 = !rail2"
    >
        <template v-slot:append>
            <v-btn
            icon="mdi-chevron-left"
            variant="text"
        
            ></v-btn>
        </template>
    </v-list-item>
    <v-expansion-panels v-if="!rail2">
                <v-expansion-panel title="Od użytkownika do budynku">
                <v-expansion-panel-text>
                <v-select
                v-model="selectedEndBuilding"
                class="formSelect userEndChoice"
                attach="body"
                label="Wybierz budynek"
                :items="buildings"
                
                item-value="code"
                :item-title="item => `${item.code} - ${item.name}`"
                />
                <v-radio-group v-model="selectedMode" name="userTransportTypeRadio">
                <v-radio label="Pieszo/Rowerem" value="bikeFoot" class="bikeFoot" />
                <v-radio label="Samochodem" value="car" class="car" />
                </v-radio-group>
                <v-btn @click="callUserRouteFinder" color="primary">Szukaj trasy</v-btn>
            </v-expansion-panel-text>
            </v-expansion-panel>

            <v-expansion-panel title="Od budynku do budynku">
            <v-expansion-panel-text>
                <v-select
                v-model="selectedStartBuilding"
                class="formSelect startChoice"
                attach="body"
                label="Budynek początkowy"
                variant="underlined"
                :items="buildings"
                item-value="code"
                :item-title="item => `${item.code} - ${item.name}`"
                />
                <v-select
                v-model="selectedEndBuilding"
                class="formSelect endChoice"
                attach="body"
                label="Budynek końcowy"
                variant="underlined"
                :items="buildings"
                item-value="code"
                :item-title="item => `${item.code} - ${item.name}`"
                />
                <v-radio-group v-model="selectedMode" name="transportTypeRadio">
                <v-radio label="Pieszo/Rowerem" value="bikeFoot" class="bikeFoot" />
                <v-radio label="Samochodem" value="car" class="car" />
                </v-radio-group>
                <v-btn @click="callRouteFinder" color="primary">Szukaj trasy</v-btn>
            </v-expansion-panel-text>
            </v-expansion-panel>
        </v-expansion-panels>
    </v-navigation-drawer>
</template>

<style lang="scss">

    #cesiumContainer{
        width: 100vw;
        height: 100vh;
        position: absolute;
        top: 0;
        left: 0;
    }
    .layerCheckbox{
        height: 50px;
    }
    .panels{
        width: 300px;
    }
    .homeButton{
        margin-bottom: 105px;
    }
    .zoomOut{
        margin-bottom: 165px;
    }
    .zoomIn{
        margin-bottom: 225px;
    }
    .clearRouteButton{
        margin-left: calc(50vw - 24px);
        margin-bottom: 40px;
        opacity: 0;
        visibility: hidden;
        pointer-events: none;
    }
    #loadingIcon{
        
        position: absolute;
        left: calc(50vw - 24px);
        bottom: 0;
        margin-bottom: 40px;
        visibility: hidden;
        opacity: 0;
        
    }
    .v-navigation-drawer {
        overflow: visible !important;
        z-index: 1000 !important;
    }
    .formSelect{
        z-index: 1000 !important;
    }
    
    
    
</style>