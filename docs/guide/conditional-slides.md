# Conditional Slides

## Overview

It's not uncommon for different slides, each containing content better suited to a particular screen size, to better fit
a usage scenario.

The most obvious scenario is one where several different images, placed in different slides, are required for different
screen environments, with only one of them being visible at any given time.

When Sliflow initially loads on a specific device, or when it detects viewport layout changes after its initial load, it
queries the browser to identify which of its slides are intended to be hidden because of a **display** CSS property that
applies to them.

As a result, developers can target Slide elements using CSS selectors and conditionally apply a **`display: block`**
or **`display: none`** style property to them.

Sliflow refreshes its understanding of which Slide elements should be considered viewable on a device in the
following situations:

- During initial loading.
- After initial loading, when the browser window is resized.
- After initial loading, when the **`class`** HTML attribute of a Slide element is modified.

## Example

**HTML**

```html

<div class="sliflow">
  <div class="sliflow-projector">
    <div class="sliflow-slide slide1 hidden-on-smaller-device">
      <!-- This is the content of the first slide that is shown only on smaller devices -->
    </div>
    <div class="sliflow-slide slide1 hidden-on-larger-device">
      <!-- This is the (alternative) content of the first slide that is shown only on larger devices -->
    </div>
    <div class="sliflow-slide slide2 hidden-on-smaller-device">
      <!-- This is the content of the second slide that is shown only on smaller devices -->
    </div>
    <div class="sliflow-slide slide2 hidden-on-larger-device">
      <!-- This is the (alternative) content of the second slide that is shown only on larger devices -->
    </div>
  </div>
</div>
```

**CSS**

```css
@media (max-width: 768px) {
    .hidden-on-smaller-device {
        display: none
    }
}

@media (min-width: 769px) {
    .hidden-on-larger-device {
        display: none
    }
}
```

:::info

- It's recommended that you endow your **`img`** or **`iframe`** elements in your slides with the **`loading="lazy"`**
  HTML attribute, to avoid loading any unnecessary resources for slides that are not yet, or will never be, visible on a
  particular device.
- Modern browsers avoid loading any resources marked with the aforementioned HTML attribute when they or their container
  are not visible (for example, due to the **`display: none`** CSS property).
:::
