import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import tailwind from '@astrojs/tailwind';

// Detectar automáticamente si es Vercel
const isVercel = process.env.VERCEL === '1';
const baseUrl = isVercel ? '/' : '/cbl_mdf_demo_web';

export default defineConfig({
  site: isVercel ? 'https://cbl-mdf-demo-web-iddm.vercel.app' : 'https://Adrinc.github.io',
  base: baseUrl,
  integrations: [react(), tailwind()],
  output: 'static',
});
