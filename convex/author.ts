import { query } from "./_generated/server";
import { v } from "convex/values";

/**
 * Get a single author profile by slug.
 */
export const getAuthorProfile = query({
  args: { slug: v.string() },
  handler: async (ctx, args) => {
    // Assumes an index "by_slug" exists on the "Slug" field in the "author" table
    const [author] = await ctx.db
      .query("author")
      .withIndex("by_slug", (q) => q.eq("Slug", args.slug))
      .collect();
    if (!author) return null;
    return {
      Name: author.Name,
      DescriptionOne: author.DescriptionOne,
      DescriptionTwo: author.DescriptionTwo,
      Email: author.Email,
      Linkedin: author.Linkedin,
      Linktree: author.Linktree,
      Instagram: author.Instagram,
      Twitter: author.Twitter,
      Designation: author.Designation,
      ProfilePicture: author.ProfilePicture,
    };
  },
});

/**
 * Get all authors (with Slug and JoinedAt).
 */
export const getAllAuthors = query({
  args: {},
  handler: async (ctx) => {
    const authors = await ctx.db.query("author").collect();
    // Return only Slug and JoinedAt fields
    return authors.map(a => ({
      Slug: a.Slug,
      JoinedAt: a.JoinedAt,
    }));
  },
});

/**
 * Get all stories for a given author slug.
 */
export const getAuthorStories = query({
  args: { slug: v.string() },
  handler: async (ctx, args) => {
    // Assuming mainStory, headlinerStory, and sideStory all have Author.Slug
    const tables = ["mainStory", "headlinerStory", "sideStory"];
    let stories: any[] = [];
    for (const table of tables) {
      const found = await ctx.db
        .query(table)
        .withIndex("by_author_slug", (q) => q.eq("AuthorSlug", args.slug))
        .collect();
      stories = stories.concat(found);
    }
    return stories;
  },
});
