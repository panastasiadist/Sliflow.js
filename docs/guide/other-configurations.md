# Other Configurations

## Overview

This section includes configuration attributes that are not covered by other sections of this guide.

## The Initial Slide

Sliflow supports displaying a specific slide after initialization, rather than the default behavior of showing the first
available slide. To specify a different initial slide, the Slider element must be marked with the 
**`data-sliflow-initial-slide-index=[ZERO_BASED_SLIDE_INDEX]`** attribute. The **[ZERO_BASED_SLIDE_INDEX]** corresponds
to the index of the slide, with counting starting at zero.

**Example:**

```html

<div class="sliflow" data-sliflow-initial-slide-index="1">
    <!-- Rest of the HTML content required by the slider -->
    <!-- The slider will switch to the second (zero based index = 1) slide just after loading.
</div>
```
