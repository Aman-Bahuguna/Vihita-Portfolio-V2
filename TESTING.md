# Verification notes

## Latest cursor redesign and rendering-work reductions

These checks supersede the earlier crosshair-cursor descriptions below.

- `pnpm build` passes, including strict TypeScript; the existing large vendor-chunk warning remains.
- `node scripts/check-assets.mjs` passes for all 256 referenced local assets.
- A controlled Chromium test dispatched the same 240 mouse-pointer events over the same noninteractive Selected Work surface before and after the changes. Cursor-state writes on `html` fell from **240 to 1**, and cursor `data-*` state writes fell from **720 to 2**. These are DOM-write counts, not an FPS or page-speed percentage.
- After pointer movement settled, a 250ms observation recorded **zero cursor DOM mutations**. The eased halo stops scheduling frames rather than running a permanent animation loop.
- Desktop checks passed for dark/light cursor colors, live theme changes, View/Drag labels, category filtering, expansion of all 19 Extra works, viewer positioning above the native modal, zoom, dragging, image navigation, Escape, closing/reopening, and native input-pointer fallback.
- Home checks passed for deferred 3D requests, working room atmosphere and day/evening controls, lazy gallery images, desktop pinned-gallery arrow navigation, and immediate cursor cleanup when reducing motion.
- Touch and system-reduced-motion checks passed for native-pointer behavior and viewer controls. The 390px touch home gallery's next-project control and horizontal-overflow checks passed.
- No runtime errors occurred in this interaction suite. Dark/light gallery and viewer screenshots were visually inspected.

Checks used compiled `dist` artifacts through browser request interception without starting another server. They do not certify smooth frame rates on the user's laptop or native mobile hardware. For a meaningful local comparison, use `pnpm build` and then `pnpm preview`, not the development server.

## Routing recovery, site map, and architectural controls

- `pnpm build` passes, including strict TypeScript checks. Vite still reports large vendor chunks; this change does not claim to resolve that existing warning.
- `node scripts/check-assets.mjs` passes for all 256 referenced local assets.
- Automated Chromium checks against the compiled `dist` files passed for direct navigation and reloads of `/projects`, `/about`, and `/projects/abhishek-residence`.
- Unknown routes and unknown project slugs show the custom 404. Its home button performs a full navigation to `/`, and its `noindex, follow` metadata is removed when returning home.
- A deliberately failing Designer JavaScript chunk shows the separate route-error recovery screen. Its home button successfully restarts the app at the entrance.
- `/sitemap` links to all 27 project detail pages from the project data, along with primary navigation and collection filters.
- Recovery and site-map pages have no horizontal overflow at 320, 390, 768, 1024, and 1440 CSS pixels. Desktop and mobile screenshots were visually inspected; new page surfaces cover the sticky footer correctly.
- The drafting cursor appears for a fine mouse pointer, changes to brackets over interactive controls, and changes color with the theme. Touch and reduced-motion contexts retain native pointers.
- Both directions of theme switching pass on desktop; touch toggling and instant reduced-motion toggling pass as well.
- The build emits `404.html` matching the compiled `index.html`, plus `.htaccess` and `_redirects`.

Browser checks fulfilled requests from the compiled artifacts without starting another server. They verify the app and generated files, **not** live provider rewrite behavior. No published URL or hosting provider was supplied. Apply the matching hosting configuration from `README.md`, deploy the new build, and verify real HTTP responses and deep-link refreshes on the public domain. A host-served 404 fallback is not equivalent to a successful 200 rewrite.

## Latest mobile motion and asset-reliability fixes

The following checks apply to the current revision, rather than the historical baseline below.

- `pnpm build` passes, including strict TypeScript validation. The existing deferred Three.js chunk-size warning remains.
- `node scripts/check-assets.mjs http://localhost:3000` passes: all 256 referenced local images, logos, fonts, PDFs, and model assets exist and return successful, non-HTML asset responses. PNG/WebP responses have image MIME types.
- All ten logo PNGs have transparent backgrounds, sufficient resolution, and unclipped artwork. The eight toolkit marks are 192 × 192; the two architectural brand marks are 176 × 216. Favicon and Apple touch PNGs are also included.

Automated Chromium checks exercised the compiled `dist` files through browser request interception, without starting another development or preview server:

| Logical viewport | Input |
| --- | --- |
| 320 × 740 | Touch |
| 390 × 844 | Touch; main interaction suite |
| 430 × 932 | Touch |
| 768 × 1024 | Touch |
| 844 × 390 | Touch; landscape |
| 1024 × 768 | Touch |
| 1440 × 900 | Mouse |
| 1920 × 1080 | Mouse |

Passed: no horizontal document overflow; mobile floor-plan drawing progression and completion; individual process/toolkit card reveals; all eight PNG logo decodes; native touch swipes; gallery arrows, counter, progress, and image parallax; menu section jumps and Escape dismissal; back-to-top; immediate reduced-motion switching and restoration; saved preferences; the OS reduced-motion default and explicit visitor override; desktop pinning and responsive pin cleanup; and mobile Projects, project-detail, and Designer routes. The normal production interaction suite had no runtime errors or failed asset requests.

Additional development-preview resilience checks passed for simulated WebGL context loss/restoration (the static room stays available), blocked local/session storage (the intro and motion button still work), and an intentionally broken thumbnail (the original local render loads instead).

These are Chromium simulations and local production-artifact checks, not native iOS/Safari or Android hardware certification. No public site URL was supplied, so published-host routing, CDN caches, and real-device frame rates have not been verified. After publishing, repeat the mobile interactions on the target devices and run `node scripts/check-assets.mjs <published-origin>` to detect missing files or asset requests incorrectly rewritten to SPA HTML.

---

These are the first-version baseline results. See `REDESIGN.md` for the subsequent visual revision and its verification scope. In that revision, the room intentionally loads in the hero rather than only near the studio.

## Passed

- Strict TypeScript: `pnpm typecheck`.
- Figma bootstrap: preflight, frozen-lockfile installation, supervised Vite startup, and the root HTTP response.
- Static production build and deploy validation: `figma make verify-deploy`.
- Static deploy-preview validation: `figma make verify-deploy-preview`.
- Lifecycle shell syntax and executable permissions.
- All web image, thumbnail, PDF preview, and PDF download references resolve across 24 unique project records.
- No explicit `any` types or CSS gradient functions in application source.

## Browser coverage

Tested with Chromium 151 on Linux using the supervised development preview:

| Logical viewport | Device scale | Purpose |
| --- | --- | --- |
| 1366 × 768 | 1 | Laptop layout |
| 1440 × 900 | 1 | Desktop layout |
| 1920 × 1080 | 1 | Large desktop layout |
| 1152 × 720 | 1.25 | 1440 × 900 display at simulated 125% scaling |
| 960 × 600 | 1.5 | 1440 × 900 display at simulated 150% scaling |
| 768 × 1024 | 1 | Tablet layout |
| 390 × 844 | 1 | Mobile layout |

The home layout, hero image, locally served fonts, and absence of horizontal document overflow passed at every size.

Interaction checks passed for floor-plan navigation; material palette selection; opt-in audio and muting; motion reduction/restoration; desktop gallery pinning; project routing and category selection; Residential's clearly labeled empty state; expansion of all 17 Extra projects; detail hotspots; image explorer opening, zoom, image selection, and Escape closing; availability of the existing/proposed drawing slider; actual PDF download responses; the supplied About portrait; keyboard movement and spring reset of the hanging card; résumé accordions; mobile menu navigation; and emulated system `prefers-reduced-motion`.

No browser runtime errors or failed application, image, or font requests occurred in the completed interaction suite.

## Production artifact check

An unchanged production-build snapshot was also exercised in Chromium by fulfilling browser requests directly from its static artifacts; no additional development server was started. Home, Projects, an individual project, and About rendered correctly. Project and About routes fit both desktop and mobile widths. Production fonts, images, and code chunks resolved without runtime errors. The Three.js engine was not requested on initial entry and was requested when the studio approached.

This validates the compiled application under SPA-style routing, not a publicly deployed host's routing configuration.

## Performance checks and limits

- The initial production HTML does **not** preload the Three.js chunk.
- All 28 project renders and both portraits have optimized WebP derivatives. Including drawing previews and separate thumbnails, web images total approximately 5.36 MiB; they are not all loaded on initial entry.
- The single large production-chunk warning concerns the deliberately deferred 3D engine/renderer. It loads near the studio rather than in the initial entry.
- Browser viewport and scaling simulations are not native Windows hardware tests. A steady 60 fps or a particular Lighthouse score has **not** been certified. Profile the published production site on the target laptop before making those claims.
- Build/deployment verification is a dry run, not a public deployment.

## Missing source content

Dedicated Hospitality and Residential collections, verified achievements, project dates/budgets, social profiles, photographic before/after sets, and panoramic/360° assets were not supplied. Placeholders are explicit; no corresponding facts or interactive viewers are fabricated.
