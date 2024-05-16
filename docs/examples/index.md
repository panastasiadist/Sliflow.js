# Examples

## Replay Strategies

<SliderCollection :configurations="ReplayStrategies" />

## Swiping

<SliderCollection :configurations="Swiping" />

## Timed Transitions

<SliderCollection :configurations="TimedTransitions" />

<script setup lang="ts">
import SliderCollection from '../../demos/Components/SliderCollection.vue';
import ReplayStrategies from './configurations/replay-strategies.json';
import Swiping from './configurations/swiping.json';
import TimedTransitions from './configurations/timed-transitions.json';
</script>

<style>
.slider {
    font-family: var(--vp-font-family-mono);
}

.slider .header,
.sliflow-controls button {
    background: var(--vp-sidebar-bg-color);
}

.slider .header,
.slider .header .spinner {
    border-color: var(--vp-c-divider);
}

.collection .item {
    margin-top: 15px;
}
</style>
