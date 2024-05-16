# Utility Classes

## Overview

Sliflow is designed with simplicity and widespread use cases in mind. That's why it includes several utility classes
designed to offer common functionality.

## Images

One typical use case involves sliders displaying images as slide content. These images normally completely fill the
slider's window. To ensure this, developers can apply the **`sliflow-utility-cover`** class to each **`img`** element
directly enclosed within a Slide HTML element.

**Example:**

```html

<div class="sliflow">
    <div class="sliflow-projector">
        <div class="sliflow-slide">
            <!-- Insert the URL for an image -->
            <img src="" class="sliflow-utility-cover">
        </div>
        <!-- Repeat the previous block for additional slides -->
    </div>
</div>
```

## Slide Transitions

### Classes

| Class                                        | Duration | Easing      |
|----------------------------------------------|----------|-------------|
| **`sliflow-utility-transition`**             | 250ms    | linear      |
| **`sliflow-utility-transition-500`**         | 500ms    | -           |
| **`sliflow-utility-transition-1000`**        | 1000ms   | -           |
| **`sliflow-utility-transition-2000`**        | 2000ms   | -           |
| **`sliflow-utility-transition-linear`**      | -        | linear      |
| **`sliflow-utility-transition-ease-in-out`** | -        | ease-in-out |

### How to apply

```html

<div class="sliflow sliflow-utility-transition sliflow-utility-transition-1000">
    <div class="sliflow-projector">
        <!-- Insert slides here. -->
        <!-- Transitions between slides will occur smoothly using a linear, one-second effect -->
    </div>
</div>
```

:::warning
The **`sliflow-utility-transition`** class must be present for the remaining transition utility classes to take effect.
:::

:::info
Visit the [Effects & Transitions](/guide/effects-transitions) section to learn more.
:::

