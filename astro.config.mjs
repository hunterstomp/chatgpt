import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import mdx from '@astrojs/mdx';

export default defineConfig({
  integrations: [
    react(), // enables React islands / .tsx
    mdx(),   // enables .mdx pages/partials
  ],
  site: 'https://q10ux.com',
  base: '/',
  build: {
    assets: 'assets',
  },
  vite: {
    css: {
      preprocessorOptions: {
        scss: {
          additionalData: `@import "./src/Q10UX_Command_Pack/styleguide/tokens.css";`
        }
      }
    }
  }
});
