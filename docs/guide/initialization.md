# Initialization

## Overview

Developers can initialize a Sliflow instance for a specific HTML block by calling the **`Sliflow.createSlider()`**
JavaScript function, preferably within a **`try-catch`** block.

## In-Page Initialization

### Per Slider

```javascript
(function() {
    window.addEventListener('load', () => {
        const element = document.getElementById("Sliflow"); // or another way of retrieving an HTML element.
        
        // The try-catch serves as a way to handle any inability to initialize a slider for the specific element.
        // This may happen when the HTML element does not exist or its improperly formed.
        try {
            Sliflow.createSlider(element);
        } catch (e) {}
    });
})();
```

### Per Page

Alternatively, one could initialize all Sliflow HTML blocks at once:

```javascript
/**
 * The following JavaScript snippet is required only once within a page.
 * It finds all Sliflow-oriented HTML blocks and activates a Sliflow instance for each of them.
 * Moreover, the snippet can be located everywhere within the page, but it is recommended that you place it as close to the </body> tag as possible.
 */
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












