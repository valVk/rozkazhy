# Rozkazhy — landing site

Vue 3 + Vite + Tailwind CSS v4 presentation site for the [Rozkazhy app](../app), deployed to GitHub Pages from `.github/workflows/deploy-site.yml` on every push to `main` that touches `site/`.

Shares the app's own design tokens (palette, PT Sans, MDI icons) — the hero section is a static illustrative mockup of the real UI, not screenshots or a live demo.

## Development

```bash
npm install
npm run dev     # http://localhost:5173/
npm run build    # outputs to dist/, base path is /rozkazhy/ (see vite.config.ts)
```

## Regenerating the QR poster

`public/rozkazhy-poster.pdf` is an A4 poster with a QR code pointing at the deployed site, linked from the site footer. It's a static file, not built by CI — regenerate it if the site URL ever changes:

```bash
node scripts/generate-poster.mjs   # writes public/poster.html (gitignored, intermediate)
```

Then render that HTML to PDF with any local Chrome/Chromium binary:

```bash
/path/to/chrome --headless --disable-gpu --no-sandbox \
  --print-to-pdf=public/rozkazhy-poster.pdf --no-pdf-header-footer \
  "file://$(pwd)/public/poster.html"
```
