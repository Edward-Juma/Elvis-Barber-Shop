# Elvis Barber Co. — Vanilla HTML / CSS / JavaScript Build

A modern, dark-luxury, fully responsive barber shop website built with
plain HTML5, CSS3 and vanilla JavaScript — no framework, no build step,
no dependencies. Open `index.html` and it runs.

## Files

```
index.html      → all page markup, every section in source order
css/style.css   → design tokens, layout, components, responsive rules
js/script.js    → all interactivity (see below)
```

Everything is separated by concern: structure in HTML, styling in CSS,
behaviour in JS — nothing is inlined.

## What script.js handles

- Preloader fade-out on load
- Sticky/glass navbar + mobile menu toggle
- Scroll-reveal animations (IntersectionObserver)
- Animated stat counters (About section)
- Gallery category filter + click-to-open lightbox (prev/next/keyboard arrows/Esc)
- Booking form validation, submit, and success state
- Auto-sliding testimonials with dots + manual prev/next
- FAQ accordion
- Newsletter sign-up success state
- Back-to-top button

## Running it

No install needed — just open `index.html` in a browser. For the full
experience (some browsers restrict local file access for images), serve
it locally instead:

```bash
# Python
python3 -m http.server 8000

# Node
npx serve .
```

Then visit http://localhost:8000.

## Customising

All shop content — services, prices, team bios, gallery, testimonials,
FAQ, hours, contact details — lives directly in `index.html`, grouped by
section with clear HTML comments (`<!-- SERVICES -->`, `<!-- TEAM -->`, etc.).
Find the section, edit the text/prices/links, save, refresh.

Before launch:

1. **Images** — every image currently points to `placehold.co` gold-on-black
   placeholders so the site works with zero setup. Replace the `src`
   attributes with your own professional photography.
2. **Contact details** — phone, WhatsApp number, email and address appear
   in the navbar, hero, footer, contact section and floating buttons.
   Search-and-replace `+254700000000` / `254700000000` and
   `book@elvisbarberco.com` across `index.html`.
3. **Booking form** — `js/script.js`'s `initBookingForm()` validates and
   shows a success animation but doesn't send data anywhere yet. Point
   the `fetch(...)` call you add inside the `setTimeout` at your backend,
   Formspree, or booking API.
4. **Newsletter form** — same idea, in `initNewsletter()`.
5. **Google Maps** — the contact card links out to Google Maps rather than
   embedding an iframe (no API key needed). Swap in an `<iframe>` if you'd
   like it inline instead.
6. **Favicon / OG image** — add a real `favicon.ico` and replace the
   `og:image`/JSON-LD image URLs in `<head>`.

## SEO & performance notes

- Semantic HTML5 throughout (`header`, `main`, `section`, `footer`)
- Full meta tags, Open Graph, Twitter Card, and `HairSalon` JSON-LD
  structured data for local search
- All images use `loading="lazy"` except the hero (`loading="eager"`)
- Motion respects `prefers-reduced-motion`
- Visible keyboard focus states on every interactive element
