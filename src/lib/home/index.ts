import { fetchQuery, api } from "../convex";

/**
 * Get the latest headline story.
 */
export async function getHeadlines() {
  return fetchQuery(api.home.getHeadlines);
}

/**
 * Get the latest headline story for a specific category.
 */
export async function getHeadlineForCategory(category: string) {
  return fetchQuery(api.home.getHeadlineForCategory, { category });
}

/**
 * Get the number of stories for a given category.
 */
export async function getStoriesLength(category?: string) {
  return fetchQuery(api.home.getStoriesLength, { category });
}

/**
 * Get the top 5 stories (excluding the latest headline).
 */
export async function getTopStories() {
  return fetchQuery(api.home.getTopStories);
}

/**
 * Get the top 5 stories for a specific category.
 */
export async function getTopStoriesForCategory(category: string) {
  return fetchQuery(api.home.getTopStoriesForCategory, { category });
}

/**
 * Get main and side stories for the home feed, with pagination.
 */
export async function getStories(skip: number) {
  return fetchQuery(api.home.getStories, { skip });
}

/**
 * Get main stories for the home feed.
 */
export async function getMainStories() {
  return fetchQuery(api.home.getMainStories);
}

/**
 * Get side stories for the home feed.
 */
export async function getSideStories() {
  return fetchQuery(api.home.getSideStories);
}

/**
 * Get stories for a specific category with pagination.
 */
export async function getStoriesForCategory(skip: number, category: string) {
  return fetchQuery(api.home.getStoriesForCategory, { skip, category });
}
