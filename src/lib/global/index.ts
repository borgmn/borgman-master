import { fetchMutation, fetchQuery, api } from "../convex";

/**
 * Increment the read count for a post.
 */
export async function updateReads(
  category: string,
  format: string,
  slug: string
) {
  return fetchMutation(api.global.updateReads, { category, format, slug });
}

/**
 * Get more stories for a category (pagination).
 */
export async function getLoadMoreStories(
  skip: number,
  category: string,
  take?: number
) {
  return fetchQuery(api.global.getLoadMoreStories, { skip, category, take });
}

// Re-export utils
export { getColors, getColorForPost } from "@/utils/get-colors";

/**
 * Convert timestamp to formatted date string.
 */
export function convertDate(timestamp: number | Date): string {
  const date = new Date(timestamp);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

/**
 * Construct metadata for a page.
 */
export function constructMetadata({
  title,
  description,
  imgTitle,
  imgDesc,
  imgUrl,
  site,
  authorData,
}: {
  title: string;
  description: string;
  imgTitle: string;
  imgDesc: string;
  imgUrl: string;
  site: string;
  authorData?: Array<{ name?: string; url?: string }>;
}) {
  return {
    title,
    description,
    openGraph: {
      title: imgTitle,
      description: imgDesc,
      images: [{ url: imgUrl }],
      url: site,
    },
    twitter: {
      card: "summary_large_image" as const,
      title: imgTitle,
      description: imgDesc,
      images: [imgUrl],
    },
    authors: authorData,
  };
}
