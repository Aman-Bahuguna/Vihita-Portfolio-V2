import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

const previewHostname =
  process.env.FIGMA && process.env.FIGMA_PUBLIC_URL
    ? new URL(process.env.FIGMA_PUBLIC_URL).hostname
    : undefined;

export default defineConfig({
  server: {
    ...(previewHostname ? { allowedHosts: [previewHostname] } : {}),
  },
  build: {
    target: 'es2022',
    rollupOptions: {
      output: {
        manualChunks(id) {
          // Keep shared CommonJS helpers out of the deferred 3D dependency graph.
          if (id.includes('commonjsHelpers')) return 'react-vendor';
          if (!id.includes('/node_modules/')) return undefined;
          if (id.includes('/three/') || id.includes('/@react-three/fiber/') || id.includes('/react-reconciler/')) return 'three-vendor';
          if (id.includes('/gsap/') || id.includes('/lenis/')) return 'scroll-vendor';
          if (id.includes('/motion/') || id.includes('/framer-motion/') || id.includes('/motion-dom/') || id.includes('/motion-utils/')) return 'motion-vendor';
          return 'react-vendor';
        },
      },
    },
  },
  plugins: [
    react(),
    {
      name: 'static-host-recovery',
      apply: 'build',
      enforce: 'post',
      generateBundle(_, bundle) {
        const index = bundle['index.html'];
        if (index?.type === 'asset') {
          this.emitFile({ type: 'asset', fileName: '404.html', source: index.source });
        }
      },
    },
  ],
});
