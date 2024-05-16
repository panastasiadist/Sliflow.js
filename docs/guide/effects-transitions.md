# Effects & Transitions

## Overview

Sliflow empowers developers to leverage CSS rules to fine-tune its presentational behavior under various conditions.
Using [state classes](/guide/state-updates) that flag a slider's HTML elements based on different scenarios, it greatly
simplifies the creation of basic and advanced CSS effects and transitions.

This guide does not cover all the possible ways to customize Sliflow's presentational behavior. Developers are
encouraged to consult the [State Updates](/guide/state-updates) section of this guide to devise creative usage
scenarios.

A common effect that is of interest to many developers is the smooth navigation between slides using a CSS transition.
The following example illustrates this:

```html

<div class="sliflow">
    <div class="sliflow-projector">
        <div class="sliflow-slide">
            <!-- Slide content goes here -->
        </div>
        <!-- Repeat the previous block for additional slides -->
    </div>
</div>
```

```css

.sliflow-projector:not(.sliflow-swiping) {
    transition: transform 0.3s linear;
}
```

In the above code, applying a CSS transition property to the **`sliflow-projector`** element enables Sliflow to smoothly
navigate between slides. Note that the transition does not apply while the user is swiping the slider, ensuring a smooth
swipe gesture.

## Bundled Effects

For added convenience, Sliflow packages a few [utility classes](/guide/utility-classes) that facilitate simple slide
transitions. As demonstrated in the example below, these classes are intended to be used on the Slider element:

```html

<div class="sliflow sliflow-utility-transition">
    <!-- Rest of the HTML content required by the slider -->
</div>
```



