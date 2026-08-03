# Garet font files

Garet is not on Google Fonts, so it can't be imported from a CDN like Montserrat is.
It has to be self-hosted, which means the font files live here in the repo.

## What to put in this folder

Drop these five files in (exact names — `src/index.css` looks for them):

```
Garet-Light.woff2      (weight 300)
Garet-Regular.woff2    (weight 400)
Garet-Medium.woff2     (weight 500)
Garet-SemiBold.woff2   (weight 600)
Garet-Bold.woff2       (weight 700)
```

You don't need all five. Any that are missing simply fall back to Montserrat,
so it's fine to start with just Regular and Bold and add the rest later.

## Getting the files

Garet is published by Type Forward / SpaceType. Buy or download it from a source
you're comfortable with licensing-wise — https://www.myfonts.com is the official
commercial route. Check the licence covers **web embedding**, not just desktop
use; those are priced separately by most foundries.

If what you get is `.ttf` or `.otf` rather than `.woff2`, convert it first —
https://transfonter.org or https://cloudconvert.com/ttf-to-woff2 both do this.
WOFF2 is roughly half the size of TTF, which matters because these files download
before any text can render.

## How it's wired up

- `src/index.css` — the `@font-face` blocks that point at these files
- `tailwind.config.ts` — `sans: ["Garet", "Montserrat", ...]`

Anything using `font-sans` (which is the whole site body) picks up Garet.
Headings use `font-display`, which is Montserrat.

## Checking it worked

Run `npm run dev`, open DevTools → Network → filter to "Font". You should see the
`.woff2` files loading with status 200. If they 404, the filename doesn't match
what `index.css` expects.
