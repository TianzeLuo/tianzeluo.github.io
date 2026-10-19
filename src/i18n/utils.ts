import type { Lang } from './ui';
export const base = import.meta.env.BASE_URL.replace(/\/$/, '');
export const path = (lang: Lang, route = '') => `${base}/${lang}/${route ? `${route.replace(/^\/|\/$/g, '')}/` : ''}`;
export const asset = (file: string) => `${base}/${file.replace(/^\//, '')}`;
export const otherLang = (lang: Lang): Lang => lang === 'en' ? 'zh' : 'en';
export const entrySlug = (entry: { id: string }) => entry.id.replace(/^(en|zh)\//, '');
