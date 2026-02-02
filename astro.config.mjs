import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import tailwind from '@astrojs/tailwind';

export default defineConfig({
  site: 'https://Adrinc.github.io',
  base: '/cbl_mdf_demo_web',
  integrations: [react(), tailwind()],
  output: 'static',
});
