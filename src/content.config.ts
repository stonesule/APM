import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';
import { serviceSlugs } from './config/services';

/**
 * Completed projects. Add one Markdown file per project in
 * src/content/projects/, with photos stored in src/assets/photos/.
 *
 * Only publish work the client has approved, with photos APM has the right to
 * use. Describe what is visible; never invent names, locations, dates,
 * materials, scope, or results. Group photos in one entry only when they
 * clearly show the same space. Leave `services` empty when the work APM did
 * is not evident from the photos.
 */
const projects = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/projects' }),
  schema: ({ image }) =>
    z.object({
      /** Neutral, descriptive title (no invented project or client names). */
      title: z.string(),
      summary: z.string(),
      services: z.array(z.enum(serviceSlugs)).default([]),
      /** Gallery order, lowest first. */
      order: z.number().int(),
      /** First photo is the lead image. */
      photos: z
        .array(
          z.object({
            src: image(),
            /** Describe what is visible in the photo. */
            alt: z.string().min(20),
            caption: z.string().optional(),
          }),
        )
        .min(1),
      /** General area only (e.g. a city), never a street address. */
      area: z.string().optional(),
      completed: z.coerce.date().optional(),
      draft: z.boolean().default(false),
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
