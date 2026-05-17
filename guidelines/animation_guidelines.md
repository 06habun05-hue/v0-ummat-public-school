# Animation Guidelines

Animations should make the UI feel fluid but snappy. They must serve a purpose and never feel sluggish.

## Mounting & Page Layouts
* All main content blocks and new pages must slide up and fade in. Nothing should instantly "blink" onto the screen.
* **Standard Framer Motion Config:** `initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.2 }}`

## Hover Physics
* Interactive cards should "float" slightly when hovered to feel tactile.
* **Standard Hover Classes:** `transition-all duration-300 hover:-translate-y-1 hover:shadow-xl`
* Buttons should slightly scale or brighten on hover.

## Micro-Interactions
* Dropdowns, modals, and tooltips should scale/slide in gracefully (e.g., `animate-slide-in`).
* **Charts:** All ECharts (`ReactECharts`) must use smooth, ease-in-out rendering animations so data flows onto the screen.
