import { fetchQuery, api } from "../convex";

/**
 * Get a single author profile by slug.
 */
export async function getAuthorProfile(slug: string) {
  return fetchQuery(api.author.getAuthorProfile, { slug });
}

/**
 * Get all authors.
 */
export async function getAllAuthors() {
  return fetchQuery(api.author.getAllAuthors);
}

/**
 * Get all stories for a given author slug.
 */
export async function getAuthorStories(slug: string) {
  return fetchQuery(api.author.getAuthorStories, { slug });
}
