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

    export default {
        setup() {
        const buildings = ref(UniversityBuildings.buildings.flat()); // Używamy danych z importowanego JSON
        const selectedStartBuilding = ref('');
        const selectedEndBuilding = ref('');
        const selectedMode = ref('bikeFoot');
        const layerCheckboxes = ref({
            google: false,
            osm: false,
            wroclaw: false,
            upwr: false
        });
        const baseMapRadio = ref('bma'); // Domyślnie Bing Maps Aerial
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

            }
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
    <div id="cesiumContainer" @click="hidePanel"></div>
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
    <v-expansion-panels 
        class="panels d-flex mr-0 position-absolute right-0" variant="popout"
    >
        <v-expansion-panel
            class="layerPanel h-auto"
            title="Nawigacja"
            expand-icon="mdi-road-variant"
            focusable="true"
            >

            <v-expansion-panel-text>
                <v-expansion-panels variant="popout">
                    <v-expansion-panel
                    title="Od użytkownika do budynku">
                        <v-expansion-panel-text>
                            <v-select
                            v-model="selectedEndBuilding"
                            class="userEndChoice"
                            label="Wybierz budynek"
                            :items="buildings"
                            item-value="code"
                            :item-title="item => `${item.code} - ${item.name}`"
                            >
                            </v-select>
                            <v-radio-group v-model="selectedMode" name="userTransportTypeRadio">
                                <v-radio label="Pieszo/Rowerem" value="bikeFoot" class="bikeFoot"></v-radio>
                                <v-radio label="Samochodem" value="car" class="car"></v-radio>
                            </v-radio-group>
                            <v-btn @click="callUserRouteFinder" color="primary">Szukaj trasy</v-btn>
                        </v-expansion-panel-text>
                    </v-expansion-panel>
                    <v-expansion-panel
                    title="Od budynku do budynku">
                        <v-expansion-panel-text>
                            <v-select
                            v-model="selectedStartBuilding"
                            class="startChoice"
                            label="Budynek początkowy"
                            :items="buildings"
                            item-value="code"
                            :item-title="item => `${item.code} - ${item.name}`"
                            >
                            </v-select>
                            <v-select
                            v-model="selectedEndBuilding"
                            class="endChoice"
                            label="Budynek końcowy"
                            :items="buildings"
                            item-value="code"
                            :item-title="item => `${item.code} - ${item.name}`"
                            >
                            </v-select>
                            <v-radio-group v-model="selectedMode" name="transportTypeRadio">
                                <v-radio label="Pieszo/Rowerem" value="bikeFoot" class="bikeFoot"></v-radio>
                                <v-radio label="Samochodem" value="car" class="car"></v-radio>
                            </v-radio-group>
                            <v-btn @click="callRouteFinder" color="primary">Szukaj trasy</v-btn>
                        </v-expansion-panel-text>
                    </v-expansion-panel>
                </v-expansion-panels>
            </v-expansion-panel-text>
            
        </v-expansion-panel>
        <v-expansion-panel
            class="layerPanel h-auto"
            title="Warstwy"
            expand-icon="mdi-layers"
            >
            <v-expansion-panel-text>
                <v-radio-group v-model="baseMapRadio">
                    <v-radio @change="changeBasemap('BingMapsAerial')" label="Bing Maps Aerial" value="bma"></v-radio>
                    <v-radio @change="changeBasemap('OSM')" label="OpenStreetMap" value="osm"></v-radio>
                    <v-radio @change="changeBasemap('GoogleMaps')" label="Google Maps" value="googlemaps"></v-radio>
                </v-radio-group>
            <v-divider></v-divider>
                <v-checkbox @click="toggleGoogleLayer" id="3DBuildingsGoogle"
                    v-model="layerCheckboxes.google" 
                    class="layerCheckbox ma-0 pa-0" 
                    color="info" 
                    label="Budynki 3D Google">
                </v-checkbox>
                <v-checkbox @click="toggleOSMLayer" id="3DBuildingsOSM"
                    v-model="layerCheckboxes.osm" 
                    class="layerCheckbox ma-0 pa-0" 
                    color="info" 
                    label="Budynki OpenStreetMap">
                </v-checkbox>
                <v-checkbox @click="toggleWroLayer" id="3DBuildingsWRO" 
                    v-model="layerCheckboxes.wroclaw"
                    class="layerCheckbox ma-0 pa-0" 
                    color="info" 
                    label="Budynki 3D Wrocław LOD1">
                </v-checkbox>
                <v-checkbox @click="toggleUPWRLayer" id="3DBuildingsUPWR" 
                    v-model="layerCheckboxes.upwr"
                    class="layerCheckbox ma-0 pa-0" 
                    color="info" 
                    label="Budynki UPWr">
                </v-checkbox>
            </v-expansion-panel-text>
        </v-expansion-panel>
    </v-expansion-panels>
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

    
    
    
</style>