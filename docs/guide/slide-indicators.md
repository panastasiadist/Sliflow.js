# Slide Indicators

## Overview

Sliflow provides developers with the ability to craft arbitrary HTML controls that lie within a slider's main HTML
block. These controls correspond to different slides and receive special classes that signify each control's
relationship to the slide being displayed at any given time. By implementing such functionality, developers can build
rich user experiences that provide visual feedback on slide transitions.

## Usage

To act as a slide indicator, an HTML element must be marked with the
**`data-sliflow-slide-indicator="[CORRESPONDING_ZERO_BASED_ACTIVE_SLIDE_NUMBER]"`** attribute, as shown in the example:

**HTML**

```html

<div class="sliflow">
    <div class="sliflow-projector">
        <div class="sliflow-slide">
            <!-- This is the content of the first active slide -->
        </div>
        <div class="sliflow-slide">
            <!-- This is the content of the second active slide -->
        </div>
        <div class="sliflow-slide slide-inactive">
            <!-- This is the content of the third (inactive) slide -->
        </div>
    </div>
    <div class="sliflow-indicators">
        <div data-sliflow-slide-indicator="0">
            <!-- This is the indicator for the first active slide -->
        </div>
        <div data-sliflow-slide-indicator="0">
            <!-- This is another indicator for the first active slide -->
        </div>
        <div data-sliflow-slide-indicator="1">
            <!-- This is the indicator for the second active slide -->
        </div>
        <div data-sliflow-slide-indicator="2">
            <!-- This is the indicator for the third (inactive) slide -->
        </div>
    </div>
</div>
```

**Key points:**

- The first and the second indicators correspond to the same slide, the first one. This is perfectly valid as you can
  have as many indicators as needed, all of them corresponding to the same slide.
- The last indicator corresponds to the last slide which is inactive (hidden). Although the indicator
  itself is not hidden (although it should be in a real scenario), it will not be used until its corresponding slide has
  been made active (visible).
- Indicators' indices refer to the indices of the active slides only. Therefore, if the original slide of an indicator
  becomes inactive or removed, its previously corresponding indicators will be linked to the new active slide that has
  taken the position of the previous one. For example, if the first slide becomes inactive or removed, the first two 
  indicators will start referring to the second slide which will become the first active slide.

:::info
When a slide is the current one, its corresponding slide indicator will be marked with the class **`sliflow-current`**.
The rest of the indicators will receive classes in the format of **`sliflow-current-pN`** or **`sliflow-current-nN`**.
This denotes whether they correspond to slides placed **N** positions **before** or **after** the currently presented
slide, respectively.
:::
