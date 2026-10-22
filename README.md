# Ushna Mehtab — Photography & Visual Stories

A responsive photography portfolio built with React, TypeScript, Vite, and GSAP. The site includes 85 supplied photographs, a curated opening sequence, genre filters, progressive loading, and an accessible fullscreen viewer with keyboard and swipe navigation.

## Development

Use Node.js 22.12+ or Node.js 24 and npm. This project was validated with Node.js 24.19.0.

```sh
npm ci
npm run dev
```

The development server listens on port 5173 by default. Use the existing checkout; cloud tasks already run in an isolated workspace and do not require another Git worktree.

```sh
npm run build      # TypeScript check and production build in dist/
npm run preview    # Serve the production build
npm test           # Desktop and mobile browser tests
```

Browser tests use `/usr/bin/chromium` when available. On another machine, run `npx playwright install chromium` first. The tests cover all photo assets, filtering/pagination, responsive navigation, reduced motion, fullscreen focus and keyboard handling, touch swipes, résumé download, and contact links.

## Content

- `src/data/gallery.json` contains the 85 photographs and their original Instagram post links. Categories are visual groupings, not named client campaigns.
- `public/images/` contains locally optimized WebP photographs in full and thumbnail sizes. All gallery images came from the user-supplied Instagram archive; no stock or generated portfolio photographs are used.
- `src/App.tsx` contains the curated order, hero selection, About copy, and contact details. Production credits and the downloadable résumé come from the supplied PDF. About prose is proposed editorial copy for review.
- `public/images/ushna-portrait.webp` is an AI-assisted resolution/detail enhancement of the separately supplied black-and-white identity portrait. It is used only in About, not as an authored gallery photograph.
- `public/documents/ushna-mehtab-resume.pdf` is the supplied résumé.

Fonts are self-hosted through Fontsource. The website requires no credentials, Instagram login, API, backend, or external image service at runtime. Email and phone links open the visitor’s chosen app; the email button also supports copying the address on secure origins.

## Deployment

Deploy the contents of `dist/` to a static web host. The app assumes it is served from the domain root. No deployment has been performed as part of implementation.

The visual direction uses the [BeyondArtist](https://github.com/beyondtahir/beyondartist) design workflow and its stored Design Memory. See [design notes](docs/DESIGN.md) for decisions and asset provenance.
