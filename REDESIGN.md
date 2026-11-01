# Graphic portfolio revision

## Selected Work archive

- Brought `/projects` into the existing ink, ivory, and yellow visual language,
  with the matching header, footer, and experience controls.
- Replaced the oversized opening with a compact heading and a standalone
  `WorkPeek` component: a small thumbnail-stack button reveals three linked
  project cards in a floating panel, only on click. It adds no collection
  section or layout height when opened. The oversized closing CTA is now a
  simple contact row.
- Preserved the Commercial, Hospitality, Residential, and Extra collections.
  The fourth collection is now consistently named **Extra work**.
- Commercial opens with a full-width featured render, followed by a two-column
  project edit. Rendered work appears before planning-only projects, without
  changing source categories. Responsive image sizes account for the large frame.
- Extra work uses a dark drawing-sheet gallery, with six curated works and a
  working expand/collapse control for all 17.
- Hospitality and Residential retain explicit awaiting-assets states; no new
  project claims or stock imagery were added.
- Playbook selections: 30 (collection heading reveals), 38/40 (frame and image
  reveals), 45 (the click-to-open card fan), and 117 (sliding category indicator).
  GSAP contexts, observers, image listeners, and dismissal listeners are cleaned
  up on unmount; the existing reduced-motion control bypasses added sequences.

### Selected Work verification

`pnpm build` passes, including strict TypeScript validation, with the existing
deferred Three.js chunk-size warning. Chromium checks passed at widths 320, 390,
768, 1024, 1440, and 1920: no document overflow or hidden reduced-motion content.
Category filtering and marker alignment, all 17 Extra work items and collapse,
sticky anchor offsets, the featured image's full-size source, project-detail
navigation and return, direct/invalid category URLs, mobile-menu Escape, and
home/Designer route smoke checks passed without page errors or failed responses.
The compact-preview revision additionally passes closed-by-default behavior,
three clickable previews, unchanged collection position on open, close-button,
outside-click and Escape dismissal, focus return, project navigation, and
reduced-motion opening. Panel bounds and document overflow were checked at
320, 390, 768, and 1440px. These are local browser checks, not hardware frame-rate
measurements or a public deployment.

## Silent, open-content landing-page revision

- Removed the sound button and all Web Audio oscillator/context code.
- Rebuilt the intro with a lightweight CSS-3D architectural doorway: a hinged
  door opens, the camera pushes into the room, and a horizontal aperture reveals
  the page. There is no second WebGL renderer, artificial percentage counter,
  or two-panel opening. Skip, session-only playback, and reduced motion remain.
- Creative Eye / Technical Mind is now a three-part visual process board, with
  original drawings and a render visible together instead of behind accordions.
- The toolkit is an open eight-card reference wall. Every application explains
  its purpose upfront; no selection or clicking is needed to read descriptions.
- Selected Work has an ivory editorial treatment, a spatial-edit masthead,
  stronger image framing, and preserved desktop pinning and mobile swipe.
- Route transitions now use a single vertical curtain rather than two doors.

## Supplied hero-model revision

The first landing-page hero now uses the user's supplied textured
`tiny-isometric-room` FBX instead of the procedural room. The surrounding landing
page design is preserved. Natural, Warm, and Cool now change lighting rather
than overwriting the supplied texture colors; daylight/evening and gentle
pointer exploration remain available.

- Converted the 24.6 MB source archive offline into a 636,640-byte GLB with
  embedded WebP textures. The original 7,233 triangles are retained, with indexed
  geometry merged into three mesh batches and three draw calls per frame.
- Resized 4K color maps to 1024px, normal maps to 512px, and combined ambient
  occlusion/roughness/metalness maps into 512px RGB atlases. Opacity is embedded
  in the color textures. No loose source JPGs or FBX are downloaded by visitors.
- A 50,206-byte static render appears before the engine/model loads and when
  WebGL is unavailable. The 3D engine remains code-split and starts after the
  visible hero gets an idle opportunity.
- Rendering remains demand-driven, capped at 1.5 DPR, without real-time shadows.
  Offscreen/hidden-tab scenes switch to `frameloop="never"`. Reduced-motion and
  touch input do not drive pointer animation.
- Camera fitting and bottom clearance keep the model above the palette on
  mobile. Fixed the hero's otherwise invisible bottom row intercepting palette
  clicks. Model GPU resources are cached across SPA route visits.
- Asset provenance, budgets, and offline regeneration instructions are in
  `public/models/README.md` and `scripts/prepare-hero-room.mjs`.

### Hero-model verification

`pnpm build` passes, including strict TypeScript validation. Vite still reports
the expected large, deferred Three.js vendor-chunk warning.

Chromium checks passed at 390×844, 768×1024, 1366×768, 1440×900, and 1920×1080:
no horizontal overflow; model fitting after resize; actual scene-pixel changes
for every lighting mode; reduced-motion pointer suppression; SPA route return;
delayed-model preview; and the no-WebGL preview. No runtime errors or failed
asset responses occurred in the normal interaction suite.

Instrumented WebGL drawing recorded three calls for an initial frame and zero
additional calls across settled 600 ms idle and offscreen intervals. Static
production artifacts were exercised in-browser without starting another server:
the poster rendered before the Three.js/model requests, followed by a working
lazy-loaded model and lighting controls.

These are automated Chromium/software-rendering checks, not certification of
hardware frame rates, a Lighthouse score, or a public deployment.

---

## Completed landing-page direction

The main landing page now carries the approved ink/yellow identity through every section. This phase keeps the first two sections intact and does not redesign the separate Projects or Designer pages.

- Replaced the old studio and its duplicate 3D room with a new expertise section. Three expandable disciplines reveal corresponding original drawings or visualisations.
- Added all eight résumé-listed applications: AutoCAD, SketchUp, V-Ray, Photoshop, Enscape, Illustrator, Canva, and Premiere Pro. Logos are local SVGs; choosing an application reveals its role in the workflow. Provenance and licensing are in `public/logos/SOURCES.md`.
- Restyled the home gallery with dark surfaces, readable sans-serif captions, yellow controls, image parallax, a scroll progress track, and working previous/next navigation.
- Rebuilt the landing-page designer introduction and contact section without serif/italic display text.
- Preserved the architectural logo, with a new home-only dark navbar, sliding underline, rolling link hover, animated mobile menu, and page-progress rule.
- Added clipboard-backed email copying, a curtain-style footer reveal, and a progress-ring back-to-top button.
- Home navigation, footer, minimap, and experience controls use scoped styles so the separate pages retain their current presentation.

### Selections from the supplied Animation Playbook

| Playbook items | Landing-page use |
| --- | --- |
| 30, 38, 40 | Masked heading lines, expertise image wipes, portrait window reveal |
| 32, 62 | Scrubbed toolkit-heading opacity and grid-staggered application cards |
| 15, 43, 113 | Horizontal gallery, image parallax within frames, rolling project index |
| 35, 91, 115 | Rolling nav labels, CTA arrow swap, sliding nav underline |
| 25, 56 | Page-progress rule and staggered mobile navigation |
| 96 | Actual copy-email confirmation, with an explicit fallback on clipboard denial |
| 125, 126 | Scroll-progress/back-to-top ring and native sticky-footer curtain reveal |
| 64, 137 | Desktop/mobile adaptation and the existing visible reduced-motion control |

Animations use scoped GSAP contexts and clean up on unmount. No extra Three.js scene or npm dependency was added. The existing interactive hero remains the only 3D scene on the landing page.

### Landing-page verification

The production build and strict TypeScript validation pass. Chromium checks covered original-image discipline switching; all eight logo downloads; software selection; desktop and mobile gallery navigation; real clipboard copying; footer back-to-top; reduced-motion content visibility; mobile-menu section jumps; and desktop/mobile layout overflow. Viewports included 1366×768, 1440×900, 1920×1080, 768×1024, and 390×844, plus simulated 125% and 150% display scaling. Separate project, project-detail, and About routes still render. These are browser simulations, not native Windows FPS or Lighthouse measurements.

---

## Previous revision

The supplied video was reviewed through extracted frames. Its strongest cues were a dark personal-portfolio surface, oversized sans-serif type, bright solid accents, and graphic motion. Those cues informed this revision without copying the reference layout.

## Visual changes
- Ink, ivory, and acid yellow replace the pastel-led identity.
- Bold sans-serif display typography replaces the dominant thin serif.
- Removed numbered section badges and the hero's small promotional captions.
- Larger supporting text and more direct portfolio navigation.
- The interactive room now opens the site, with cobalt, terracotta, and olive materials plus daylight/evening lighting.
- The existing project gallery and data-backed work are preserved.
- Route-level presence/layout animation was removed to avoid overlapping exiting pages and fragile lazy-route transitions. Door wipes remain separate from content routing.

## Motion inventory
1. Sequenced entrance text.
2. Masked line reveals.
3. Scroll-driven camera-style room push-in.
4. Multi-layer parallax.
5. Pinned floor-plan storytelling.
6. SVG path tracing.
7. Pencil motion along the SVG path using MotionPathPlugin.
8. Scrubbed interpolation between compatible SVG shape paths.
9. Clip-path image reveals.
10. Horizontal pinned project gallery.
11. Batched project-card entries.
12. Magnetic work link.
13. Preloader progress counter and drawing.

The shape interpolation uses GSAP's native SVG attribute interpolation, not MorphSVGPlugin. Path drawing uses native dash lengths, not DrawSVGPlugin. Only MotionPathPlugin was necessary for the new choreography.

Reduced-motion mode bypasses the pinned SVG timeline and hover/camera motion. Mobile receives a static composition rather than a long pinned sequence.

## Performance tradeoff
The 3D module is still code-split, capped at 1.5 DPR, and rendered on demand, but it now loads for the hero by design. The previous claim that Three.js never loads on first entry no longer applies. No external model or texture downloads were introduced.

## Verification
The revised home and material/lighting controls were exercised in Chromium. Projects, About, and an individual project rendered without desktop document overflow. The mobile hero fit a 390 × 844 viewport. No runtime errors occurred in that route/control check. The production build includes strict TypeScript validation.

The prior `TESTING.md` describes the first version, not a new certification of every interaction after this redesign. Hardware FPS and Lighthouse measurements remain unverified.
