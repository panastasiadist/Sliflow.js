# Navigation

## Overview

Sliflow empowers developers to incorporate navigation controls into their Sliflow-powered sliders. It offers a way for
HTML elements within a slider's DOM to prompt the slider to navigate to specific slides based on their indices, or to
slides relative to the current one, by using relative indices, when clicked.

## Usage

1. Insert the required number of HTML controls such as buttons, links, etc., within a slider's HTML and style them as
   needed.
2. Mark the controls with the **`data-sliflow-navigation-target="[ABSOLUTE_OR_RELATIVE_ZERO_BASED_SLIDE_INDEX]"`** HTML
   attribute, replacing the **[ABSOLUTE_OR_RELATIVE_ZERO_BASED_SLIDE_INDEX]** part with an absolute index value like
   "0", "1", or a relative index value like "-1", "+1", etc.
3. When a user clicks on a navigation control marked with an absolute slide index, the slider will transition to the
   associated slide.
4. If a user clicks on a navigation control marked with a relative **N** slide index, the slider will transition to the
   slide that is positioned **N** places before or after the current slide, depending on the sign of the relative index.

## Examples

### Absolute Navigation Controls

```html

<div class="sliflow">
    <!-- Rest of the HTML content required by the slider -->
    <div>
        <button data-sliflow-navigation-target="3">Switch to the 4nd slide</button>
    </div>
</div>
```

When clicked, the above control will instruct Sliflow to navigate the user to the 4th slide, on the condition that one
exists.

### Relative Navigation Controls

```html

<div class="sliflow">
    <!-- Rest of the HTML content required by the slider -->
    <div>
        <button data-sliflow-navigation-target="-1">PREVIOUS</button>
        <button data-sliflow-navigation-target="+1">NEXT</button>
    </div>
</div>
```

When clicked, the above controls will instruct Sliflow to navigate the user to the slide positioned before or after the 
current slide.

:::info
[Replay Strategies](/guide/replay-strategies) play a crucial role in the outcome of clicking a navigation control.
:::
