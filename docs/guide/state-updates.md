# State Updates

## Overview

Sliflow updates a Slide element with different classes to signal different states or when various events take place.
For example, the Slide element that holds the current slide is marked with the **`sliflow-current`** class. These
classes allow developers to program against them, such as making use of various CSS driven operations.

Sliflow applies different classes to its HTML elements to denote various states or events. For instance, the Slide
element that contains the current slide is tagged with the **`sliflow-current`** class. These classes enable developers 
to carry out operations against them, such as various CSS-driven actions.

An list of all supported state classes is provided below:

| Class                       | Application                | Description                                                                                                                   |
|-----------------------------|----------------------------|-------------------------------------------------------------------------------------------------------------------------------|
| **`sliflow-ready`**         | Slider element             | Applied when Sliflow has loaded for a specific HTML block.                                                                    |
| **`sliflow-transitioning`** | Slider element             | Applied while a slide transition is in progress, even if not actually resulting in a different slide than the current one.    |
| **`sliflow-swiping`**       | Slider element             | Applied while a swiping gesture is in progress, even if it doesn't result in a different part of the Strip becoming visible.. |
| **`sliflow-start`**         | Slider element             | When the current slide is the first in the list of active slides.                                                             |                                                               |
| **`sliflow-end`**           | Slider element             | When the current slide is the last in the list of active slides.                                                              |                                                               |
| **`sliflow-first`**         | Slide or indicator element | Applied to the first active slide and its corresponding indicators.                                                           ||
| **`sliflow-last`**          | Slide or indicator element | Applied to the last active slide and its corresponding indicators.                                                            ||
| **`sliflow-current`**       | Slide or indicator element | Applied to the current slide and its corresponding indicators.                                                                ||
| **`sliflow-current-pN`**    | Slide or indicator element | Applied to an active slide (and its corresponding indicators) positioned **N** places **before** the current slide.           |
| **`sliflow-current-nN`**    | Slide or indicator element | Applied to an active slide (and its corresponding indicators) positioned **N** places **after** the current slide.            |
