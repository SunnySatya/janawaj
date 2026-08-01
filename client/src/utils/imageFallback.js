// Shared fallback image (inline SVG data URI) used when an image fails to load
// on the client (e.g., /uploads/... references that no longer exist after deploy).
export const FALLBACK_IMAGE =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='800' height='450' viewBox='0 0 800 450'%3E%3Crect fill='%231f2937' width='800' height='450'/%3E%3Ctext fill='%236b7280' font-family='Arial' font-size='24' x='400' y='225' text-anchor='middle' dominant-baseline='middle'%3EImage not available%3C/text%3E%3C/svg%3E";

// Attach an onError handler to an image element that swaps in the fallback.
export const handleImageError = (e) => {
  e.target.onerror = null; // prevent infinite loop
  e.target.src = FALLBACK_IMAGE;
};
