# Swiping

## Overview

Sliflow provides built-in functionality that allows users to perform slide transitions using their mouse or touch-driven
gestures:

- Left-to-right and vice versa movements are supported when a slider operates in horizontal mode.
- Top-to-bottom and vice versa movements are supported when a slider operates in vertical mode.

### Activation

Add the **`data-sliflow-swipe="true"`** HTML attribute to a Slider element as in the following example:

```html

<div class="sliflow" data-sliflow-swipe="true">
  <!-- Rest of the HTML content required by the slider -->
</div>
```

:::info
For any other configuration attribute shown in this section to take effect, this attribute must be present.
:::

## Sliding Distance Multiplier

A numeric multiplier can be set to increase or decrease the amount of distance in pixels covered due to swiping. For
example, Sliflow can be configured to swipe its Strip by 10px for every pixel of sliding performed by the user.

By default, the numeric multiplier equals **1px** which means that there is a **1 to 1 relationship** between the
sliding distance covered due to the user's gesture and the actual length of content revealed by the Strip.

### Usage

Add the **`data-sliflow-swipe-distance-multiplier="[NUMBER]"`** HTML attribute to a Slider element, replacing the
**[NUMBER]** part with a numeric value, as follows:

```html

<div class="sliflow" data-sliflow-swipe="true" data-sliflow-swipe-distance-multiplier="2">
  <!-- Rest of the HTML content required by the slider -->
</div>
```

In the example above, the slider would slide its Strip by 2 pixels for every pixel of a horizontal or vertical swipe
gesture performed by the user.

## Automatic Slide Transitions

By default, when a user swipes a slider, the relevant part of the Strip is revealed but without fully transitioning to
the previous or next slide. This behavior can be modified by configuring a Sliflow instance to automatically switch to
the previous or next slide when a certain sliding distance in pixels has been covered due to swipe gesture.

### Usage

Add the **`data-sliflow-swipe-transition-threshold="[NUMBER]"`** HTML attribute to the Slider element, replacing the
**[NUMBER]** part with a numeric value, as follows:

```html

<div class="sliflow" data-sliflow-swipe="true" data-sliflow-swipe-transition-threshold="10">
  <!-- Rest of the HTML content required by the slider -->
</div>
```

In the example above, the slider will automatically switch to the previous or next slide, depending on the direction of
the user's gesture, once the latter has covered a sliding distance of 10px.
