# Orientation

## Overview

Sliflow supports either horizontal or vertical orientation for slide placement:

- In a horizontal orientation, slides are arranged sequentially along the X-axis. Slide transitions occur from left to
  right and vice versa.
- With vertical orientation, slides stack on top of each other along the Y-axis. Slide transitions happen from top to
  bottom and vice versa.

:::info
When the text direction of the webpage or slider is left-to-right (or right-to-left) and the slider's orientation is
horizontal, transitions happen left-to-right (or right-to-left) while navigating to subsequent slides.
:::

## Configuration

Specify the orientation of a slider by assigning the **`data-sliflow-orientation-mode="[ORIENTATION]"`** HTML
attribute to a Slider element. Replace **[ORIENTATION]** with the appropriate value:

- **`horizontal`** for **Horizontal** slide placement.
- **`vertical`** for the **Vertical** slide placement.

**Example:**

```html

<div class="sliflow" data-sliflow-orientation-mode="vertical">
    <!-- Rest of the HTML content required by the slider -->
</div>
```

:::info
By default, the horizontal orientation is enabled, hence assigning the related attribute is not required. However, 
developers may opt to explicitly define the orientation of a slide to clarify their intent.
:::

:::warning
A vertical slider requires its height to be set to a specific value as shown in the 
[Getting Started](/guide/getting-started) section.
:::
