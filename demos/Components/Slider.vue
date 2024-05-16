<template>
    <div class="slider">
        <div class="header">
            <div class="attributes">
                <div class="label">ATTRIBUTES</div>
                <div>{{ attributeString }}</div>
            </div>
            <div class="spinner">
                <div class="label">SLIDES</div>
                <input type="number" min="0" v-model="slideCount" />
            </div>
        </div>
        <div :data-sliflow-instance="instance" v-bind="attributes" class="sliflow" ref="handle">
            <div class="sliflow-projector">
                <div class="sliflow-slide" v-for="(slide, slideIndex) in slides">
                    <div class="sliflow-slide-content" :style="slide.style">
                        <div class="title">SLIDER {{ instance }} | SLIDE {{ slideIndex }}</div>
                    </div>
                    <!-- Anything else can go here, ex. an image -->
                </div>
            </div>
            <div class="sliflow-controls sliflow-controls-arrows">
                <button class="sliflow-control-previous" data-sliflow-navigation-target="-1">PREV</button>
                <button class="sliflow-control-next" data-sliflow-navigation-target="+1">NEXT</button>
            </div>
            <div class="sliflow-indicators">
                <button
                    v-for="(slide, slideIndex) in slides"
                    :data-sliflow-slide-indicator="slideIndex"
                    :data-sliflow-navigation-target="slideIndex">
                    I-{{ slideIndex }}
                </button>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import Sliflow from '../../lib/Sliflow';
import generateRandomHexColor from '../Utilities/generateRandomHexColor';

const props = defineProps<{
    instance: number;
    slideCount: number;
    description?: string;
    attributes: Record<string, string>;
}>();

const slideCount = ref(props.slideCount);

const slides = computed(() =>
    new Array(slideCount.value).fill(null).map((value, index) => {
        const color1 = generateRandomHexColor();
        const color2 = generateRandomHexColor();

        return {
            style: {
                backgroundImage: `linear-gradient(45deg, ${color1} 25%, ${color2} 25%, ${color2} 50%, ${color1} 50%, ${color1} 75%, ${color2} 75%, ${color2} 100%)`,
                backgroundSize: '50px 50px',
            },
        };
    }),
);

const attributeString = computed(() => {
    return (
        Object.entries(props.attributes)
            .map((keyValue) => `${keyValue[0]}="${keyValue[1]}"`)
            .join(' ') || 'Default configuration'
    );
});

const handle = ref<HTMLElement>(null);

onMounted(() => {
    Sliflow.createSlider(handle.value);
});
</script>

<style>
.slider {
    --slider-radius: 10px;
    --slider-spacing: 10px;
}

.slider .header {
    border-radius: var(--slider-radius);
    padding: var(--slider-spacing);
    background: #ffffff;
    border: 2px solid rgba(0, 0, 0, 0.2);
    margin-bottom: 15px;
    display: flex;
    align-items: center;
}

.slider .header .label {
    font-weight: bold;
}

.slider .header .attributes {
    width: 100%;
}

.slider .header .spinner {
    border-left: 1px solid rgba(0, 0, 0, 0.2);
    padding-left: var(--slider-spacing);
    margin-left: var(--slider-spacing);
}

.slider .header .spinner input {
    width: 50px;
}

.sliflow {
    border-radius: var(--slider-radius);
    height: 300px;
}

.sliflow:not(.sliflow-swiping) .sliflow-projector {
    transition: all 0.3s linear;
}

.sliflow-controls button {
    position: absolute;
    z-index: 10;
    top: 50%;
    transform: translateY(-50%);
    background-color: rgba(255, 255, 255, 0.8);
    outline: none;
    padding: 6px 14px;
    border-radius: calc(var(--slider-radius) / 2);
    font-weight: bold;
    border: 2px solid transparent;
    transition: all 0.3s linear;
}

.sliflow-slide-content {
    position: absolute;
    inset: 0;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    color: #ffffff;
}

.sliflow-slide-content .title {
    display: inline-block;
    border-radius: var(--slider-radius);
    padding: 6px 14px;
    border: 1px solid rgba(0, 0, 0, 0.7);
    font-size: 14px;
    background-color: rgba(0, 0, 0, 0.7);
}

.sliflow-controls button:hover {
    border-color: black;
}

.sliflow-control-previous {
    left: var(--slider-spacing);
}

.sliflow-control-next {
    right: var(--slider-spacing);
}

.sliflow-indicators {
    position: absolute;
    bottom: var(--slider-spacing);
    left: 0;
    right: 0;
    text-align: center;
    color: #ffffff;
}

.sliflow-indicators > button {
    display: inline-block;
    background: #333333;
    margin: 0 5px;
    padding: 2px 8px;
    border-radius: 5px;
    color: #fff;
    border: none;
}

.sliflow-indicators > button.sliflow-current {
    background: green;
}
</style>
