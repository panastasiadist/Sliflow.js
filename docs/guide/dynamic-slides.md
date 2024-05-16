# Dynamic Slides

## Overview

Sliflow can handle any slides that the developer adds or removes after its initial loading. For instance, one could
create a slider whose Slides are dynamically created or destroyed using JavaScript in response to user actions. Sliflow
does not provide an API to handle such cases as it reactively takes into account any Slide modifications made through
third-party means, such as a frontend framework or plain JavaScript code.

## Example

**HTML**

```html

<div class="sliflow">
  <div class="sliflow-projector">
    <div class="sliflow-slide">
      <!-- This is the content of the first slide and it is intended to be permanently shown -->
    </div>
    <div class="sliflow-slide slide-temporary">
      <!-- This is the content of the second slide and it is intended to be removed 3 seconds after the initial load -->
    </div>
    <div class="sliflow-slide">
      <!-- This is the content of the third slide and it is intended to be permanently shown -->
    </div>
  </div>
</div>
```

**JavaScript**

```javascript
// This will delete all slides with a "slide-temporary" class 3 seconds after the initial loading.
(function() {
  window.addEventListener('load', () => {
    setTimeout(() => {
      document
        .querySelectorAll('.slide-temporary')
        .forEach((element) => {
          element.remove()
        });
    }, 3000);
  });
})();
```

:::warning
When new Slide elements are added, their structure and classes have to adhere to the rules set by Sliflow, as outlined
in
the [Core Concepts](/guide/core-concepts) chapter.
:::
