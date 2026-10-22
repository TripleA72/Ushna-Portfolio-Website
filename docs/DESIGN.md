# Photography portfolio design record

User brief: a highly polished, animated photography portfolio for Ushna Mehtab, using the supplied identity portrait, résumé, and Instagram photography archive. Photography takes priority over production experience.

## Direction

The Frame Journal combines a warm paper surface, charcoal typography, a small rust accent, a large name masthead, and a triptych of supplied photographs. DM Sans establishes identity and navigation; Instrument Serif carries the personal voice. Photography provides the color rather than interface decoration.

Three directions were compared: Frame Journal, dense Contact Sheet, and immersive Projection Room. Frame Journal was selected for reading clarity and responsive behavior, with contact-sheet grouping and fullscreen inspection added once the 85 real photographs arrived. Broad peach/purple color fields were rejected in favor of ivory/charcoal to leave the photographs dominant.

The hero uses archive IDs 18 (red portrait under arches), 73 (couple under an arch), and 2 (black-and-white live performance). Selected-frame order is intentionally mixed across weddings, portraits, and music. Titles are editorial genre labels; no project names, awards, or client claims are invented. The About portrait establishes identity rather than photographic authorship.

## BeyondArtist Design Memory applied

The user-requested BeyondArtist repository was read at `/tmp/beyondartist-reference`. The designer and artist worked separately and both inspected rendered desktop/mobile screenshots. Research used the stored library; no live Pinterest research or audience testing is claimed. Instagram fetching returned a proxy 403; the user's uploaded archive supplied the actual images.

| Record | Applied decision | Visual check |
| --- | --- | --- |
| SYS-009 | Exact headline hierarchy; large sans name and quieter serif voice | Name fits at desktop and phone widths |
| SYS-012 | Name → photographs → story → contact | Photos lead; résumé content sits in About |
| FND-027 | Adapt charcoal/warm accent relationships | Warm neutral ground and small rust emphasis |
| FND-064 | Compare, then reject broad peach/purple surfaces | Images remain the source of color |
| FND-039 | Use real font families/styles and real assets | Self-hosted fonts, supplied images, no stock substitutes |

## Motion and accessibility

Short name and image-curtain entrances, scroll-triggered section reveals, restrained photo hover, animated link rules, and viewer transitions. Native scrolling is preserved. Reduced-motion preferences remove animation and smooth scrolling. The native modal dialog traps focus, closes with Escape, restores focus, locks background scroll, and supports arrow keys and swipes. Gallery photos have descriptive alternative text. Mobile navigation and category buttons have explicit state labels.

CSS presentation crops conceal baked sidebars on specific editorial frames. The fullscreen viewer preserves each supplied image, including its original borders, without those crops.

## Provenance and limits

- Gallery: 85 JPGs from `ushnamehtab_siddiqui_posts.zip`, resized and encoded to responsive WebP variants without changing scene content.
- About portrait: image-model enhancement requested by the user as an optional upscale. It is an edited identity image, not additional photographic work.
- Production credits/contact: supplied `Ushna Resume - Producer.pdf`.
- Proposed personal narrative is drafted website copy, not a résumé quotation.
- No metrics, performance promises, client identities, publication status, or unverified location are asserted.

The current instance is validated independently from any later publication or deployment. Final artwork and website delivery do not imply user approval of the design.
