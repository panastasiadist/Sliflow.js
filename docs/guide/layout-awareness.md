# Layout Awareness

## Overview

Sliflow performs layout-oriented calculations that are vital to its correct operation. These calculations take into
consideration the dimensions and text direction of a slider. The necessary calculations are automatically carried out
under the following conditions:

- On initial loading.
- After initial loading, when the dimensions of the viewport change.
- After initial loading, when the class names of a slide container are modified.

:::warning
Sliflow cannot anticipate a developer's intentions regarding slide content in different device/screen/text-direction
environments in advance. Therefore, managing the content of the slides in a responsive manner remains a responsibility
of the developer.
:::
