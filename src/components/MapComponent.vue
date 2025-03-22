<template>
    <div id="cesiumContainer"></div>
</template>
  
<script>
    import { onMounted } from "vue";
    import { initCesium } from "../scripts/displayMap";
  
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

</style>