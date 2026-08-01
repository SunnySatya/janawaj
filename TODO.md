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

---

# Fix: Featured News Card Style Matches News Card

## Steps

- [x] 1. Analyze `NewsCard.jsx` — featured cards used full-bleed image + gradient overlay style
- [x] 2. Update featured card rendering to use same white-card layout as regular news card (image on top, content below)
- [x] 3. Verify client builds

---

# Fix: Google Login Not Working

## Root Cause

- `AuthContext.loginWithGoogle` did NOT return the result → after successful Google auth, Login/Signup pages never received `success: true` so `navigate("/")` never ran — user stayed stuck on login page.
- Google Identity Services (GIS) script was only loaded _after_ button click via `await` — this broke the user gesture so the popup could be blocked by popup blockers.
- CSP (added earlier for images) did not include `frame-src` for Google domains → Google OAuth popup/iframe could be blocked in production.

## Steps

- [x] 1. Analyze Google login flow (client hook, AuthContext, backend route, .env config)
- [x] 2. Test backend `/api/auth/google` → responds correctly (400 on invalid payload = route working)
- [x] 3. Verify `VITE_GOOGLE_CLIENT_ID` is set and valid format
- [x] 4. Fix `AuthContext.loginWithGoogle` to return `{ success, user, token }`
- [x] 5. Preload GIS script on mount in `useSocialAuth` (prevents popup blocker) + add `prompt: "select_account"`
- [x] 6. Add `frame-src` for Google domains in server CSP
- [x] 7. Verify client build + server syntax
- [x] 8. Commit `d63609c` + push to master (auto-deploy to Render)

---

# Fix: Image Slider Style Matches News Card

## Steps

- [x] 1. Analyze `ImageSlider.jsx` — slider used full-bleed image + gradient overlay style
- [x] 2. Update slider slide to use same white-card layout as news card (image on top, content below, category badge overlay)
- [x] 3. Verify client builds
