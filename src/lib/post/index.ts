import { fetchQuery, api } from "../convex";

/**
 * Get all posts from headline, main, and side stories.
 */
export async function getAllPosts() {
  return fetchQuery(api.post.getAllPosts);
}

/**
 * Get a single post by category, format, and slug.
 */
export async function getSinglePost(
  category: string,
  format: string,
  slug: string
) {
  return fetchQuery(api.post.getSinglePost, { category, format, slug });
}

/**
 * Get more stories for a given category.
 */
export async function getMoreStories(category: string) {
  return fetchQuery(api.post.getMoreStories, { category });
}

/**
 * Get additional stories for "load more" functionality.
 */
export async function getLoadMoreStories(skip: number, category: string) {
  return fetchQuery(api.post.getLoadMoreStories, { skip, category });
}
