import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';
import { serviceSlugs } from './config/services';

/**
 * Completed projects. Add one Markdown file per project in
 * src/content/projects/. Only publish work the client has approved, with
 * photos APM has the right to use. The collection starts empty on purpose.
 */
const projects = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/projects' }),
  schema: ({ image }) =>
    z
      .object({
        title: z.string(),
        summary: z.string(),
        services: z.array(z.enum(serviceSlugs)).min(1),
        /** General area only (e.g. a city), never a street address. */
        area: z.string().optional(),
        completed: z.coerce.date().optional(),
        coverImage: image().optional(),
        coverAlt: z.string().optional(),
        draft: z.boolean().default(false),
      })
      .refine((data) => !data.coverImage || data.coverAlt, {
        message: 'coverAlt is required when coverImage is set',
        path: ['coverAlt'],
      }),
});

/**
 * Client testimonials. Each entry must be a real quote the client gave
 * permission to publish. The collection starts empty on purpose.
 */
const testimonials = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/testimonials' }),
  schema: z.object({
    /** Name as the client approved it to appear (e.g. "Jordan P."). */
    attribution: z.string(),
    context: z.string().optional(),
    service: z.enum(serviceSlugs).optional(),
    permissionConfirmed: z.literal(true),
    draft: z.boolean().default(false),
  }),
});

export const collections = { projects, testimonials };
