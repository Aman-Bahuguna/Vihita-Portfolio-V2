# Application logos

These marks identify applications listed in the supplied designer software-skills document. They do not imply endorsement, certification, or a measured proficiency level.

- AutoCAD, SketchUp, Adobe Photoshop, Adobe Illustrator, Adobe Premiere Pro, Canva: Simple Icons v11.15.0, retrieved from the published `simple-icons` npm archive. Its CC0 license is included in `Simple-Icons-LICENSE.md`. Brand names and marks remain the property of their respective owners.
- V-Ray: official monochrome Chaos product mark, linked from the V-Ray product page: `https://static.chaos.com/images/assets/000/024/297/original/generic-logo-color-white-vray.svg?1741255941`.
- Enscape: official Chaos product icon, linked from the Enscape product page: `https://static.chaos.com/images/assets/000/027/681/original/svg-icon-enscape-white-35px.svg?1786459505`.

Official SVGs were parsed and checked for executable content and external references before being saved locally. These SVGs remain the source masters. The interface uses transparent, 192 × 192 PNG exports (4× the displayed 48px size), with the monochrome ivory color baked in for dark mode. The theme-aware `--tool-logo-filter` changes the toolkit marks to ink in light mode so they remain visible on pale cards. The V-Ray wordmark is proportionally fitted, never stretched.

`vihita-accent.png` and `vihita-ink.png` are 4× PNG exports of the portfolio's existing architectural doorway mark for dark and light backgrounds. The favicon and Apple touch icon use that same mark. No remote icon, image, font, or logo service is needed at runtime.

To regenerate all PNGs from the local source masters, install ImageMagick (`convert`) and run `node scripts/prepare-logos.mjs`. The script reads the existing palette tokens and doorway path from the local design system.
