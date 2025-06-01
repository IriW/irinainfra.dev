// @ts-check
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';
import { fileURLToPath } from 'url';
import { resolve } from 'path';

// https://astro.build/config
export default defineConfig({
  site: 'https://irinainfra.dev/',
  base: '/',
  integrations: [
    starlight({
      title: 'Start',
      description: 'From YAML to production: DevOps, Platforms, CI/CD & what I learn along the way.',
      defaultLocale: 'en', // optional
      locales: {
        pl: { label: 'Polish', lang: 'pl' },
        en: { label: 'English', lang: 'en' },
        // de: { label: 'German', lang: 'de' },
      },      
      social: [
        { icon: 'linkedin', label: 'LinkedIn', href: 'https://www.linkedin.com/in/irinadebowska' },
        { icon: 'github', label: 'GitHub', href: 'https://github.com/IriW' },
      ],
    }),
  ],
  vite: {
    resolve: {
      alias: {
        '@irinainfra_base': fileURLToPath(new URL('../irinainfra_base/src', import.meta.url)),
      },
    },
  },
  redirects: {
    '/': { status: 301, destination: '/en/' },
  },
});
