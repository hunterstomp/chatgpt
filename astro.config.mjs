import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';

export default defineConfig({
  integrations: [mdx()],
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
