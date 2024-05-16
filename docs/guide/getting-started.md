# Getting Started

## Overview

### Websites

1. Download a release zip from [GitHub](https://github.com/panastasiadist/Sliflow.js/releases).
2. Link to the **`sliflow.umd.cjs`** and **`sliflow.css`** files.
3. Code the required HTML/CSS as outlined in the [next section](#html-css).
4. Initialize Sliflow for your HTML block (and every other in the page):

```javascript
// Prefer putting this snippet close to the </body> tag
(function() {
    window.addEventListener('load', () => {
        document.querySelectorAll('.sliflow').forEach((element) => {
            try {
                Sliflow.createSlider(element);
            } catch (e) {}
        });
    });
})();
```

### Node.js - CommonJS

1. Install the **sliflow** package from NPM: **`npm install --save sliflow`**
2. Code the required HTML/CSS as outlined in the [next section](#html-css).
3. Include the main Sliflow style in your app from the **`sliflow/styles`** path, as required by your toolchain.
4. Require Sliflow and initialize it for your HTML block.

```javascript
const Sliflow = require('sliflow');
// The "sliflow/styles" file must also be included in your app.
// ...
// fetch/create an HTML element that will act as the slider's main HTML element and store it in a "element" variable.
// ...
try {
    Sliflow.createSlider(element);
} catch (e) {}
```

### Node.js - ESM

1. Install the **sliflow** package from NPM: **`npm install --save sliflow`**
2. Code the required HTML/CSS as outlined in the [next section](#html-css).
3. Include the main Sliflow style in your app from the **`sliflow/styles`** path, as required by your toolchain.
4. Import Sliflow and initialize it for your HTML block.

```javascript
import Sliflow from 'sliflow';
// The "sliflow/styles" file must also be included in your app.
// ...
// fetch/create an HTML element that will act as the slider's main HTML element and store it in a "element" variable.
// ...
try {
    Sliflow.createSlider(element);
} catch (e) {}
```

## HTML & CSS

Each Sliflow instance has a one-to-one relationship to an HTML block that contains its slides, their content, and any
configuration attributes.

**HTML**

```html

<div class="sliflow">
    <div class="sliflow-projector">
        <div class="sliflow-slide">
            <!-- Insert a URL to an image -->
            <img src="" class="sliflow-cover">
        </div>
        <div class="sliflow-slide">
            <!-- Insert a URL to an image -->
            <img src="" class="sliflow-cover">
        </div>
        <!-- Repeat the previous block for additional slides -->
    </div>
</div>
```

**CSS**

```css
.sliflow {
    /* Developers could set their own height, according to the requirements. */
    height: 300px;
}
```

:::warning
A vertical slider requires its height to be set to a specific value.
:::

:::info

- The slider shown above by default operates in horizontal orientation. In horizontal mode, setting a specific height as
  shown above is not necessary but recommended, especially if the height reserved by the slide's content is unequal.
  Read the [Core Concepts](/guide/core-concepts) section for more information.
- All classes, except for **`sliflow-cover`**, are required. The aforementioned class is a utility class bundled by
  Sliflow. It makes an image fill a slide's available space. Read the [Utility Classes](/guide/utility-classes) section 
  for more information.
- The width of a slider depends on the Slider's available horizontal space or any applied CSS rules.
  :::
