import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import { loadEnv } from 'vite';

const env = { ...loadEnv(process.env.NODE_ENV || 'production', process.cwd(), ''), ...process.env };
const site = env.SITE_URL;
export default defineConfig({
  ...(site ? { site } : {}),
  base: env.BASE_PATH || '/',
  output: 'static',
  trailingSlash: 'always',
  integrations: [mdx(), ...(site ? [sitemap()] : [])],
  i18n: { defaultLocale: 'en', locales: ['en', 'zh'], routing: { prefixDefaultLocale: true, redirectToDefaultLocale: false } },
  vite: { plugins: [tailwindcss()] },
  markdown: {
    remarkPlugins: [remarkMath],
    rehypePlugins: [rehypeKatex],
    shikiConfig: { themes: { light: 'github-light', dark: 'github-dark' } }
  }
});
