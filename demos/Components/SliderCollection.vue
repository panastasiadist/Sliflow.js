<template>
    <div class="collection">
        <div class="item" v-for="(data, index) in sliders">
            <Slider :instance="index" :attributes="data.attributes" :slide-count="3" />
        </div>
    </div>
</template>

<script setup lang="ts">
import { ConfigurationSet } from '../types';
import { computed } from 'vue';
import generateSliderDefinitions from '../Utilities/generateSliderDefinitions';
import Slider from './Slider.vue';

const props = defineProps<{
    configurations: ConfigurationSet[];
}>();

const sliders = computed(() => generateSliderDefinitions(props.configurations));
</script>
