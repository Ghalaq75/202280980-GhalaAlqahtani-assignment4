# Technical Documentation
## Ghala Alqahtani — Personal Portfolio Website
### Assignment 4 | SWE Course | KFUPM | April 2026

---

## 1. Project Architecture

This is a **single-page application (SPA)** built with plain HTML, CSS, and vanilla JavaScript — no frameworks or build tools required. All functionality runs in the browser with zero server-side code.

```
Client (Browser)
│
├── index.html          ← Page structure & content
├── css/styles.css      ← All styles, variables, responsive rules
└── js/script.js        ← All interactivity and API calls
          │
          ├── Quotable.io API   (external — inspirational quotes)
          └── GitHub REST API   (external — public repositories)
```

---

## 2. File Descriptions

### `index.html`
The single HTML document that defines all page sections. Uses semantic HTML5 elements (`<nav>`, `<section>`, `<article>`, `<footer>`). Bilingual text is stored as `data-en` and `data-ar` attributes on each translatable element. The `lang` and `dir` attributes on `<html>` are updated dynamically by JavaScript.

### `css/styles.css`
All styles in one file, organised into clearly labelled sections:
- CSS custom properties (variables) for the light and dark themes
- Reset and base styles
- Navigation bar
- Hero section and quote box
- About section
- Projects section (grid, cards, filter controls)
- GitHub repositories section
- Contact form
- Footer and utility elements
- Language toggle and RTL overrides (`[data-lang="ar"]`)
- Scroll progress bar
- Responsive breakpoints (`@media`)
- Reduced motion accessibility override

### `js/script.js`
All JavaScript in one file, divided into numbered sections:
1. Theme toggle
2. Time-based greeting
3. Inspirational Quote API + fallback
4. GitHub API + fallback demo cards
5. Project search with highlight
6. Project filter buttons
7. Project sort dropdown
8. Combined filter + search + sort
9. Contact form validation
10. Live word and character count
11. Personalised success message
12. Scroll-in animations (IntersectionObserver)
13. Active nav link highlight
14. Smooth scrolling
15. Navbar scroll shadow + mobile hamburger
16. Back-to-top button
17. Arabic / English language toggle (RTL)
18. Scroll progress bar
19. Initialisation block (DOMContentLoaded)

---

## 3. Feature Technical Details

### Theme Toggle
- Reads user's OS preference via `window.matchMedia('(prefers-color-scheme: dark)')`
- Applies `data-theme="dark"` on `<html>` which triggers CSS variable overrides
- Persists selection to `localStorage` key `theme`

### Time-Based Greeting
- Reads `new Date().getHours()` on page load
- Displays "Good Morning", "Good Afternoon", or "Good Evening" in the active language
- Bilingual greeting strings are stored in the `GREETINGS` object in `script.js`

### Inspirational Quote API
- Endpoint: `https://api.quotable.io/random?tags=inspirational|life|wisdom`
- Uses `AbortSignal.timeout(6000)` to enforce a 6-second timeout
- Falls back to a local array of 7 hardcoded quotes on any network error
- "New Quote" button re-calls `fetchQuote()` for a fresh result

### GitHub Repositories API
- Endpoint: `https://api.github.com/users/ghalaq75/repos?sort=updated&per_page=6&type=public`
- Displays the 6 most recently updated public repositories
- Escapes all API data with `escapeHTML()` before inserting into the DOM to prevent XSS
- Shows 4 hardcoded demo cards if the API call fails or times out

### Project Filter, Search & Sort
- All three work together in a single `applyFiltersAndSort()` pass for efficiency
- Search matches against title, tags, category, and description text
- Keyword matches are highlighted using a `<mark>` element injected via `highlightText()`
- Sort reorders DOM nodes directly using `Array.sort()` + `appendChild()`

### Contact Form Validation
- Validates all four fields simultaneously on submit so all errors appear at once
- Individual fields are also validated on `blur` and re-validated on `input` if already invalid
- Uses a `setTimeout(900ms)` to simulate a network send before showing the success message
- Saves the visitor's first name to `localStorage` as `lastVisitorName`

### Arabic / English Toggle (Innovative Feature)
- HTML: every translatable element carries `data-en="..."` and `data-ar="..."` attributes
- Inputs/textareas use `data-en-placeholder` and `data-ar-placeholder` instead
- Select `<option>` elements also carry `data-en` / `data-ar` for their text
- JS `applyLanguage(lang)` sets `html[lang]`, `html[dir]`, and `html[data-lang]`
- CSS `[data-lang="ar"]` selector flips flex directions, border sides, text alignment, and the quote box border
- Choice persists via `localStorage` key `lang`
- Button animates with a CSS `rotateY` keyframe on language switch

### Scroll Progress Bar
- A `<div class="scroll-progress">` is fixed at `top: 0` with `z-index: 1100`
- Width is calculated as `(scrollY / (documentHeight - windowHeight)) * 100`
- Updated on every scroll event using a `{ passive: true }` listener for performance
- In RTL mode, the bar grows from the right side

### Scroll-In Animations
- Uses `IntersectionObserver` with `threshold: 0.1` and `rootMargin: '0px 0px -80px 0px'`
- Applies initial `opacity: 0` and `translateY(30px)` to project and repo cards
- Transitions to `opacity: 1` and `translateY(0)` when each card enters the viewport
- `observeElements()` is called twice: once on load and once after 1.5 s to catch dynamically rendered GitHub cards

---

## 4. External APIs

| API | Purpose | Fallback |
|---|---|---|
| `api.quotable.io` | Random inspirational quotes | 7 hardcoded local quotes |
| `api.github.com` | Public GitHub repositories | 4 hardcoded demo repo cards |

Both APIs are called with `AbortSignal.timeout()` to prevent the page from hanging on slow connections.

---

## 5. Accessibility

- All interactive elements have `aria-label` attributes
- The mobile nav toggle uses `aria-expanded` to signal open/close state
- The scroll progress bar uses `role="progressbar"` with `aria-valuenow`, `aria-valuemin`, and `aria-valuemax`
- The quote box uses `role="region"` with an `aria-label`
- The project count uses `aria-live="polite"` for screen reader announcements
- The word count announcer uses `aria-live="polite"` on a visually hidden `<span>`
- All `@media (prefers-reduced-motion: reduce)` animations are disabled
- Images have descriptive `alt` text and use `loading="lazy"`

---

## 6. Performance Considerations

- Images use `loading="lazy"` to defer offscreen loading
- Scroll listeners use `{ passive: true }` to avoid blocking the main thread
- `IntersectionObserver` is used instead of scroll listeners for animation triggers
- No JavaScript frameworks or large libraries are loaded
- CSS transitions use `transform` and `opacity` (GPU-composited properties) rather than `top`/`left`

---

## 7. Known Limitations & Future Work

| Item | Status |
|---|---|
| Contact form does not actually send email | Not implemented — would require a backend service (e.g. EmailJS) in a future version |
| Profile and project images are placeholders | Replace `assets/images/*.jpg` with real photos |
| GitHub API rate limit | Unauthenticated requests are limited to 60/hour; a GitHub token would increase this |
| Arabic translation completeness | Project card titles and descriptions are not translated; this would require a full content translation pass |
| Automated testing | No unit or integration tests; would add Jest + Playwright in a production setting |

---

## 8. Browser & Device Testing

| Platform | Browser | Status |
|---|---|---|
| Desktop | Chrome 120+ | ✓ Fully functional |
| Desktop | Firefox 121+ | ✓ Fully functional |
| Desktop | Safari 17+ | ✓ Fully functional |
| Desktop | Edge 120+ | ✓ Fully functional |
| Mobile | iOS Safari | ✓ Responsive layout verified |
| Mobile | Android Chrome | ✓ Responsive layout verified |

---

*Documentation prepared by Ghala Alqahtani — April 2026*
