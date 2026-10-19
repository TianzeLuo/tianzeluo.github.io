import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const shared = z.object({
  translationKey: z.string(), lang: z.enum(['en', 'zh']),
  title: z.string(), summary: z.string(),
  status: z.enum(['ongoing', 'completed', 'archived']).default('ongoing'),
  updated: z.coerce.date(), tags: z.array(z.string()).default([]),
  featured: z.boolean().default(false), draft: z.boolean().default(true),
  sample: z.boolean().default(false), order: z.number().default(99),
  links: z.object({ code: z.string().url().optional(), paper: z.string().url().optional(), live: z.string().url().optional(), website: z.string().url().optional() }).default({})
});
export const collections = {
  research: defineCollection({ loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/research' }), schema: shared.extend({ question: z.string(), visual: z.enum(['latent', 'geometry']).default('latent') }) }),
  projects: defineCollection({ loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/projects' }), schema: shared.extend({ category: z.enum(['Research Tool', 'Open Source', 'Experiment']), role: z.string(), stack: z.array(z.string()), visual: z.enum(['agent', 'reader', 'lab', 'studio', 'plugins']).default('agent') }) }),
  writing: defineCollection({ loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/writing' }), schema: shared })
};
