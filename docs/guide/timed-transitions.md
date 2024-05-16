# Timed Transitions

## Overview

Sliflow can automatically perform slide transitions based on a configured time span. In other words, Sliflow will switch
to the next available slide each time its internal timer, configured by the developer, goes off.

### Activation

Add the **`data-sliflow-timed-transition-interval="[NUMBER_IN_SECONDS]"`** HTML attribute to a Slider element as shown
in the following example:

```html

<div class="sliflow" data-sliflow-timed-transition-interval="3">
  <!-- Rest of the HTML content required by the slider -->
</div>
```

The slider represented by the example above would automatically switch to the next available slide **every 3 seconds**.

:::info
For any other configuration attribute shown in this section to take effect, this attribute must be present.
:::

## Pause on Hover

You can configure a Sliflow instance to temporarily pause the automatic transition process while users hover their mouse
cursor over or touch the slider element. This gives users the necessary time to view the current slide.

### Usage

Add the **`data-sliflow-timed-transition-hover-strategy="pause"`** HTML attribute to a Slider element as shown in the
following example:

```html

<div class="sliflow" data-sliflow-timed-transition-interval="3" data-sliflow-timed-transition-hover-strategy="pause">
  <!-- Rest of the HTML content required by the slider -->
</div>
```

## Early Slide Transitions

Between two subsequent timed slide transitions, the user may manually navigate to a Slide. In this case, the timed
transition may happen too soon for the user to comprehend the content of the slide they have switched to.

To prevent such cases, Sliflow intentionally avoids performing the timed transition that would typically occur after the
user-initiated slide transition. However, provided the user doesn't perform another manual slide navigation, the next
scheduled transition will occur as expected.

:::info
This behavior of Sliflow is fixed and cannot be adjusted by the developer.
:::
