# Replay Strategies

## Overview

A Replay strategy refers to how Sliflow acts when the user tries to navigate beyond the first or last slide. The Replay
strategy can be **None**, **Rewind**, or **Loop**.

## The None Strategy

When the Replay strategy is set to None, the slider does nothing when the user tries to navigate past the first or last
slide. For instance, if the user reaches the final slide and clicks a "Next" button, nothing will happen because there
is no next slide. The user will need to click on a "Back" button or use another method to navigate to slides that
precede the last one.

### Scenario

1. Assume a slider with 3 slides.
2. The user lands on the last (3rd) slide and tries to navigate to a 4th, non-existent slide.
3. The slider does not respond.
4. The user starts navigating backward to previous slides.
5. Eventually, the user lands on the initial slide from where they began and tries to navigate to a non-existent slide
   before the first one.
6. Again, the slider does not respond.

## The Rewind Strategy

The Rewind strategy enables the user to "jump" to the first (last) slide when trying to get past the last (first) slide.
In other words, the strategy "rewinds" the user's navigation sequence.

### Scenario

1. Assume a slider with 3 slides.
2. The user lands on the last (3rd) slide and tries to navigate to a 4th, non-existent slide.
3. The slider "jumps" to the first slide, essentially "rewinding" the navigation experience of the user.
4. Now, the user lands on the first slide and tries to navigate to a non-existent slide placed before the first one.
5. The slider "jumps" again, landing the user on the last slide.

## The Loop Strategy

The Loop strategy enables a user to navigate to slides that appear before or after the first and last slides,
respectively. But how is this possible when no slides exist before the first and after the last one? Sliflow is capable
of "recycling" slides, replicating them in a continuous manner for as long as necessary.

### Scenario

1. Assume a slider with 3 slides.
2. The user lands on the last (3rd) slide and tries to navigate to a 4th, non-existent slide.
3. The slider allows the user to land on a 4th virtual slide, which is essentially the 1st slide projected in the 4th
   position.
4. Now, the user proceeds to land on the 5th slide. Again, this slide does not physically exist. However, Sliflow
   "projects" the 2nd slide as if it were a real 5th slide.
5. This process is endlessly repeated, enabling users to recycle through the slides indefinitely.

:::info
The Loop strategy does not actually repeat the slides, DOM-wise. It only "projects" the actual HTML elements into
virtual positions using CSS transforms.
:::

## Configuration

The Replay strategy can be configured by marking the Slider with a **`data-sliflow-replay-strategy="[STRATEGY]"`** HTML
attribute, replacing the **[STRATEGY]** part with the proper value:

- **`none`** for the **None** strategy.
- **`rewind`** for the **Rewind** strategy.
- **`loop`** for the **Loop** strategy.

**Example:**

```html

<div class="sliflow" data-sliflow-replay-strategy="loop">
    <!-- Rest of the HTML content required by the slider -->
</div>
```

:::warning
The implementation of CSS transitions is necessary for the visual differences between the **Rewind** and **Loop**
strategies to be apparent. Otherwise, the two strategies will appear to produce identical visual feedback.
:::

:::info
The default Replay strategy is **None**, which is equivalent to not marking the slider element with the aforementioned
attribute. Alternatively, developers can explicitly use the **`none`** value if they want to indicate their intention.
:::

