# The switcher

The control that switches states. It sits over the thing being judged, so build the spec below and leave it alone.

## Deliberately outside the design system

Never style the switcher with the project's tokens, fonts or colors. One that looks native to the product becomes part of what you are looking at.

One dark neutral surface, the system font stack and no project variables. It does not follow the theme, because dark reads as chrome over both light and dark pages.

## Behavior

- It sets a `__state` search param and reads the active state back from it. The URL is the source of truth, so every state is a link.
- Left and right arrows step through the states. Number keys 1–9 jump to the first nine directly.
- `H` hides and shows the switcher, for screenshots and screen recordings.
- Key handling ignores events with a modifier key, events already `defaultPrevented` and events from inputs, textareas, selects and contenteditable elements.
- The active button carries `aria-pressed="true"`, and the container carries a label.
- Switching is instant, with no transition, and keeps the scroll position.
- The active state does not reset on resize. Never render the switcher conditionally on viewport width.

## Structure

One button per state, in the order **Find the states in the code** listed them.

```html
<nav class="state-switcher" aria-label="States">
  <button type="button" data-state="loading" aria-pressed="false">Loading</button>
  <button type="button" data-state="empty" aria-pressed="true">Empty</button>
  <button type="button" data-state="enterprise" aria-pressed="false">Enterprise</button>
</nav>
```

## Placement and styling

Fixed, bottom centre, above everything the page can stack. On a narrow viewport it stays 16px from each edge and scrolls sideways, so every state stays reachable. Arrow keys scroll the active button into view. Where the component sits at the bottom of the viewport, move the switcher to top centre and say so.

```css
.state-switcher {
  all: unset;
  position: fixed;
  bottom: max(24px, env(safe-area-inset-bottom));
  left: 50%;
  translate: -50% 0;
  z-index: 9999;
  display: flex;
  gap: 2px;
  max-width: calc(100vw - 32px);
  overflow-x: auto;
  scrollbar-width: none;
  padding: 4px;
  border-radius: 999px;
  background: rgb(20 20 20 / 0.9);
  box-shadow: inset 0 0 0 1px rgb(255 255 255 / 0.1), 0 8px 24px rgb(0 0 0 / 0.25);
  font: 13px/1 system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
  user-select: none;
}

.state-switcher button {
  all: unset;
  flex: none;
  padding: 7px 14px;
  border-radius: 999px;
  font: inherit;
  color: rgb(255 255 255 / 0.6);
  cursor: pointer;
}

.state-switcher button:hover {
  color: rgb(255 255 255 / 0.85);
}

.state-switcher button[aria-pressed="true"] {
  background: rgb(255 255 255 / 0.14);
  color: rgb(255 255 255);
}

.state-switcher button:focus-visible {
  outline: 2px solid rgb(255 255 255 / 0.7);
  outline-offset: 2px;
}
```

`all: unset` keeps the project's global button and nav styles out. In a framework, keep the class names and the structure and change only the rendering syntax.
