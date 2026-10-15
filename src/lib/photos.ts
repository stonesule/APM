import { getEntry } from 'astro:content';
import type { ImageMetadata } from 'astro';

export interface Photo {
  src: ImageMetadata;
  alt: string;
  caption?: string | undefined;
}

/**
 * Look up a photo from the projects collection so feature sections reuse the
 * same file, alt text, and caption as the gallery. Fails the build if the
 * project or photo index does not exist.
 */
export async function getPhoto(projectId: string, index = 0): Promise<Photo> {
  const entry = await getEntry('projects', projectId);
  const photo = entry?.data.photos[index];
  if (!photo) throw new Error(`Photo not found: projects/${projectId}[${index}]`);
  return photo;
}
