# Introduction

## Why Sliflow?

Sliflow.js (Sliflow for short) offers a low effort, declarative, HTML & CSS first approach to incorporating
hardware-accelerated image and content sliders into websites or web applications.

It provides a reduced but important set of features designed to be mixed and matched as necessary, without the need for
complex JavaScript rituals.

Furthermore, Sliflow is built with today's rich front-end environment in mind, offering the tools to construct
highly adaptable content sliders.

## How it Works

Each Sliflow instance relies on a piece of HTML, which contains the necessary structural markup, configuration
attributes, and the content of the slides.

Sliflow makes no distinction between images or other types of content. It has the capability to slide entire DOM trees of
content organized into slides.

Each slide's content is hosted by an HTML element that serves as its container. These containers are sequenced one after
the other, forming a horizontal or vertical strip of slides.

A size-constrained view which acts as a "window" ensures that the user can only view a specific region of the slide
strip at any time.

Sliflow exploits CSS transforms, which are hardware accelerated when supported by the device/browser, to "project" the
necessary region of the slide strip through the aforementioned "window".

By dynamically updating a slider's HTML with state classes, Sliflow enables developers to resort to plain and simple
CSS-driven operations, such as CSS-based slide transition effects.

Additionally, Sliflow continuously monitors the runtime environment (e.g., text direction) to allow adaptation to
different circumstances, even after the website's initial loading.

## Features

- Mobile friendly.
- Heavily unit-tested.
- Hardware accelerated.
- Text-direction awareness.
- Support for custom slide indicators.
- Support for custom navigation controls.
- Support for horizontal or vertical sliding.
- State-driven HTML updates using CSS classes.
- Dynamic display of slides depending on CSS rules.
- Automatic layout adaptation on viewport/slider resize.
- Support for different slide transition strategies.
- Support for automatic or fine-tuned slider initialization.
- Support for slide addition and removals after initial load.
- Use of modern browser-technologies with no external dependencies.
- Progressive activation of built-in features by means of simple HTML modification.
- Dynamic observation of DOM/CSS modifications for behavioral adjustment after initial load.
- Optional, automatic, time-based slide switching with support for pause-on-hover functionality.
- Optional, mouse and touch based swiping with support for slide movement acceleration and auto-switching thresholds.

## Compatibility

- Browsers with support for [ES2015](https://caniuse.com/es6). Generally speaking, support includes versions of major
  browser software that have been released **since 2017**.
