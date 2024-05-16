# Core Concepts

## Overview

Sliflow requires a minimal amount of HTML. It contains the content to be organized in slides, using HTML elements which
group together the content items of each slide.

Additionally, it requires that developers use some reserved class names essential to the system's proper operation.

Moreover, it uses a few HTML attributes and classes, prefixed as **`data-sliflow-`** and **`sliflow-`** respectively. 
These enable and configure additional functionally provided out-of-the-box by Sliflow.

The following HTML block depicts a typical Sliflow slider. This is the minimum HTML required for a Sliflow instance to 
function:

```html

<!-- This is the top level HTML element, referred to as the "Slider" (element) and is unique -->
<div class="sliflow">
    <!-- This is the second level HTML element, referred to as the "Projector" (element) and is unique -->
    <div class="sliflow-projector">
        <!-- This is the third level HTML element, referred to as the "Slide" (element) and can be repeated -->
        <div class="sliflow-slide">
            <!-- This is the content of the first slide -->
            <!-- Insert content here (for example, an <img> element) -->
        </div>
        <!-- The previous block (Slide) is repeated as necessary -->
    </div>
</div>
```

The first element, **`sliflow`**, is the top-level HTML element required for a Sliflow instance. It can optionally take
additional (non-reserved) class names, as well as special (reserved) attributes that enable certain functionalities, as
shown in the following example:

```html

<div class="sliflow my-class" data-sliflow-projection-strategy="reset">
    <div class="sliflow-projector my-another-class">
        <div class="sliflow-slide my-special-slide-class">
            <!-- This is the content of the first slide -->
            <!-- Insert content here (for example, an <img> element) -->
        </div>
        <!-- Repeat the slide element as necessary -->
    </div>
</div>
```

## Slider

The **Slider** refers to the top level HTML element presented above, recognized by the **`sliflow`** class. It
encompasses everything required for a specific Sliflow instance to function, creating a region within a website used for
a slider's operational needs.

:::warning
In vertical mode, the Slider element must have a specific height set, for example, by means of a CSS rule.
:::

## Projector

The **Projector** is the HTML element directly under the Slider element, characterized by the **`sliflow-projector`**
class. It hosts the HTML elements that serve as container elements for various slides and serves as the viewing area
of the slider through which the Strip (a part of which at any given time) is "projected".

:::warning
Only one Projector HTML element can exist within a Slider element.
:::

## Slides

**Slides** refer to the HTML elements under the Projector element. These contain each slide's content, such as an image
or another HTML structure. They are recognized by the **`sliflow-slide`** class.

:::info

- Any number of Slide elements can exist within a Projector element.
- In horizontal (vertical) mode, the width (height) of the Slides equals the width (height) of the Projector's viewing
  area.
- In horizontal mode, all Slides have equal height, derived from the Slide with the greatest height.
- To avoid showing Slides in a inconsistent state while their Sliflow instance is loading, they **remain hidden** until
  the Sliflow instance is loaded.
  :::

## Strip

The collection of all Slide elements within a slider is referred to as the **Slide Strip** or **Strip** for short. The
Strip can be horizontal or vertical, depending on the adjacent placement of the Slides. Only a specific region of the
Strip is visible at a time, making either a single Slide visible or parts of the content of two different adjacent
Slides.

## The "current" Slide

When Sliflow switches to a specific Slide, that slide's content becomes fully visible, as the Strip is coordinated to
fill the Projector's view space.

Sliflow can switch to a specific Slide either through a pagination/navigation control or due to automatic
slide-switching.

A Slide is considered **current** once it is the Slide to which Sliflow has most recently switched, meaning it has been
brought entirely into the Projector's view

:::info
Manually performing a swipe gesture that brings into view a Slide different from the current one **does not change**
the status of the current Slide. For a Slide to become **current**, Sliflow must switch to it.
:::

## Reserved Keywords

### `sliflow-` Prefixed Class Names

These are special class names reserved by Sliflow. The **`sliflow`**, **`sliflow-projector`**, and **`sliflow-slide`**
classes are absolutely necessary for a Sliflow instance to function properly. Other **`sliflow-`** prefixed class names
are employed to enable bundled functionality or represent different slider states

### `data-sliflow-` Prefixed Attributes

These refer to special HTML attributes reserved by Sliflow, which serve as the primary means of activating or
configuring bundled functionalities in Sliflow. For instance, developers could configure a specific Sliflow instance to
perform automatic slide transitions every five seconds by setting the necessary reserved HTML attribute on its HTML
block.

:::warning

- Every HTML attribute and class name reserved by Sliflow will always begin with the **`data-sliflow-`** and
  **`sliflow-`** prefixes, respectively. Therefore, it is strongly recommended that developers avoid specifying
  attributes or class names beginning with the aforementioned prefixes, to prevent collisions with Sliflow-specific
  functionality.
- Under no circumstances should developers implement styling using the **`style`** attribute on any elements within a
  Sliflow HTML block. The reason for this is that Sliflow uses inline styling for its operational needs.
  :::

