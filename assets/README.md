# assets/

Placeholder for static assets (photos, audio, downloadable invites, etc.).

Right now the gallery photos are embedded as base64 data URIs inside
[`js/data.js`](../js/data.js) so the app is fully self-contained and works
offline with zero extra requests.

## Optional: move photos out of data.js

If `js/data.js` ever feels too large to edit comfortably, you can move the
images here as real files and shrink the data module dramatically:

1. Drop the JPEGs in this folder, e.g. `assets/photo-00.jpg … photo-09.jpg`.
2. In `js/data.js`, change each entry's `b64:"data:image/jpeg;base64,…"`
   to `b64:"./assets/photo-00.jpg"` (the renderers just use it as an
   `<img src>`, so a path works the same as a data URI).
3. Add the new files to the `APP_SHELL` list (or let the runtime cache them)
   in [`sw.js`](../sw.js) if you want them available offline.

No build step is required either way — it stays a static site.
