# Supplied hero room

`tiny-room/room.glb` is an optimized derivative of the user's supplied
`tiny-isometric-room.zip` attachment. It replaces the procedural hero room;
it is not presented as one of the designer's completed projects.

## Offline preparation

Extract the original attachment outside the public directory, then run:

```sh
node scripts/prepare-hero-room.mjs /path/to/extracted-attachment
```

The conversion uses the existing Three.js dependency and Python with Pillow.
Neither Python nor the FBX loader ships in the application.

- Original archive: 24,586,152 bytes, with mostly 4096px JPEG textures.
- Optimized GLB: approximately 622 KiB, including all runtime textures.
- Original geometry retained: 7,233 triangles, merged into three material batches.
- Color atlases: 1024px WebP, with equipment opacity packed into alpha.
- Normal maps: 512px WebP.
- Occlusion, roughness, and metalness: packed into 512px WebP RGB atlases.
- Sun-ray color and opacity: combined into one 256px WebP.
- Original baked light/shade is preserved; no costly real-time shadow maps.
- Geometry is centered and scaled offline, with indexed shared vertices.

The separate loose WebP intermediates are removed after embedding. The original
archive is not served to visitors. The standalone ground-AO texture has no
corresponding ground mesh in the supplied FBX and is not requested at runtime.

`tiny-room/poster.webp` is a transparent, cropped render of the same optimized
model in its default natural/daylight state. It is displayed while the engine
or GLB loads and when WebGL is unavailable. Regenerate this preview if the model
or default camera/lighting changes.

## Runtime budget

The hero preserves its layout while loading. Three.js is code-split and starts
only after the hero enters the viewport and the browser has an idle opportunity
(with a timeout fallback). The orthographic camera fits both narrow and wide
screens. Rendering is demand-driven: a frame is requested for pointer movement,
palette/lighting changes, or resize, not continuously. The scene switches to
`frameloop="never"` when offscreen or the tab is hidden. Pointer motion is
disabled for touch and reduced-motion preferences; lighting controls still work.

Device pixel ratio is capped at 1.5. Cached model geometry and textures are reused
on route return, rather than downloaded and decoded again.

These are implementation budgets, not a guarantee of a particular frame rate
or Lighthouse score on every device.
