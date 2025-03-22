<template>
    <div id="cesiumContainer"></div>
    <div id="layerPicker">
        <img src="../assets/layers-svgrepo-com.svg">
    </div>
</template>
  
<script>
    import { onMounted } from "vue";
    import { initCesium } from "../scripts/displayMap";
    import './cesium.css'
  
    export default {
        setup() {
        onMounted(() => {
            initCesium("cesiumContainer");
        });
        },
    };
</script>
<style>

    #cesiumContainer{
        width: 100vw;
        height: 100vh;
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
    }
    #layerPicker img{
        width: 28px;
        height: 28px;
        margin-left: 2px;
        margin-top: 2px;
    }
    #layerPicker:hover{
        background-color: #4488bb;
        box-shadow: 0px 0px 50px #4488bb;
        border: 1px solid #aaeeff;
    }

</style>