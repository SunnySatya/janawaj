# Fix: News Images Not Showing on Render

## Root Cause

- Images uploaded via Multer `diskStorage` are written to `server/uploads/` (local disk).
- `uploads/*` is gitignored → files never reach the repo → Render's ephemeral filesystem has no images.
- DB stores relative paths like `/uploads/file-xxx.jpeg` → 404 on Render.

## Steps

- [x] 1. Analyze repo & confirm root cause
- [x] 2. Add `cloudinary` + `multer-storage-cloudinary` deps to `server/package.json`
- [x] 3. Create `server/config/cloudinary.js`
- [x] 4. Update `server/middleware/upload.js` → Cloudinary storage (with disk fallback for dev)
- [x] 5. Update `server/controllers/uploadController.js` → return full CDN URL + cloudinary delete
- [x] 6. Add client-side `onError` fallback in `client/src/components/NewsCard.jsx`
- [x] 7. Add client-side `onError` fallback in `client/src/pages/NewsDetails.jsx`
- [x] 8. Update `README.md` with new env vars
- [x] 9. Verify server starts & client builds
- [x] 10. Recreate missing `client/index.html` (Vite entry point) — was missing, causing build failures

---

# Fix: Drag & Drop Image Upload Not Working in Admin

## Root Cause

- `ImageUploader.jsx` only rendered the drop zone when `preview` was empty → drag & drop impossible when editing existing news/sliders or replacing an uploaded image.
- Drag handlers flickered because `onDragLeave` fired when moving over child elements (icon, text, hidden input).

## Steps

- [x] 1. Rewrite `ImageUploader.jsx` — always render drop zone (with preview it becomes a "replace" overlay)
- [x] 2. Add drag-depth counter (`useRef`) to eliminate flicker from nested elements
- [x] 3. Add `e.stopPropagation()` + `dropEffect` to drag handlers
- [x] 4. Add "Drop to upload" highlight overlay when dragging over
- [x] 5. Verify client builds with the updated component

## Follow-up (manual)

- [ ] Add `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET` to Render dashboard
- [ ] Redeploy on Render
- [ ] Re-upload images for existing news via admin panel (old `/uploads/...` entries will show fallback placeholder)
