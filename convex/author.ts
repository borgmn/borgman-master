import { query, mutation } from "./_generated/server";
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
    const tables = ["mainStory", "headlinerStory", "sideStory"] as const;
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

/**
 * Create a new author.
 */
export const createAuthor = mutation({
  args: {
    Slug: v.string(),
    Name: v.string(),
    DescriptionOne: v.string(),
    DescriptionTwo: v.string(),
    Email: v.string(),
    Linkedin: v.string(),
    Linktree: v.string(),
    Instagram: v.string(),
    Twitter: v.string(),
    Designation: v.string(),
    ProfilePicture: v.string(),
  },
  handler: async (ctx, args) => {
    // Check if slug already exists
    const existing = await ctx.db
      .query("author")
      .withIndex("by_slug", (q) => q.eq("Slug", args.Slug))
      .first();

    if (existing) {
      throw new Error("Author with this slug already exists");
    }

    const id = await ctx.db.insert("author", {
      ...args,
      JoinedAt: Date.now(),
    });

    return { id };
  },
});

/**
 * Update an existing author.
 */
export const updateAuthor = mutation({
  args: {
    id: v.id("author"),
    Slug: v.string(),
    Name: v.string(),
    DescriptionOne: v.string(),
    DescriptionTwo: v.string(),
    Email: v.string(),
    Linkedin: v.string(),
    Linktree: v.string(),
    Instagram: v.string(),
    Twitter: v.string(),
    Designation: v.string(),
    ProfilePicture: v.string(),
  },
  handler: async (ctx, args) => {
    const { id, ...updates } = args;

    // Check if new slug conflicts with another author
    const existing = await ctx.db
      .query("author")
      .withIndex("by_slug", (q) => q.eq("Slug", args.Slug))
      .first();

    if (existing && existing._id !== id) {
      throw new Error("Another author with this slug already exists");
    }

    await ctx.db.patch(id, updates);
    return { success: true };
  },
});

/**
 * Delete an author.
 */
export const deleteAuthor = mutation({
  args: { id: v.id("author") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
    return { success: true };
  },
});

/**
 * Get author by ID for editing.
 */
export const getAuthorById = query({
  args: { id: v.id("author") },
  handler: async (ctx, args) => {
    const author = await ctx.db.get(args.id);
    return author;
  },
});
