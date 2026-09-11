# Aaron CSS Sprite Loader

A lightweight, dependency-free running loader made from a 10-frame transparent PNG sprite.

## Plain HTML/CSS

Open `index.html` in a browser. Copy the `.runner-viewport`, `.runner-strip`, and `@keyframes run-cycle` styles into your project.

## React

1. Copy `AaronLoader.jsx` and `AaronLoader.css` into your component folder.
2. Copy `aaron-run-sprite.png` into your app's `public` folder.
3. Render the component:

```jsx
<AaronLoader size={220} label="Loading your experience" />
```

## Customize

- Speed: change `0.82s` in the animation rule.
- Size: change the `size` prop in React or `.loader-stage` width in the demo.
- Background: the sprite has genuine transparency, so it works on any background.

The loader respects `prefers-reduced-motion` for accessibility.
