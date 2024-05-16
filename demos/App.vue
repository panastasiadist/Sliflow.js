<template>
    <SliderCollection :configurations="ConfigurationsAll" />
</template>

<script setup lang="ts">
import SliderCollection from './Components/SliderCollection.vue';
import ConfigurationsAll from './Configurations/all.json';
import ConfigurationsSingle from './Configurations/single.json';

function setRealViewportWidth() {
    let rvw = document.documentElement.clientWidth;
    document.documentElement.style.setProperty('--rvw', `${rvw}px`);
}

window.addEventListener('load', setRealViewportWidth);
window.addEventListener('resize', setRealViewportWidth);
</script>
