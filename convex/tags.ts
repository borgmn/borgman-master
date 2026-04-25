import { v } from "convex/values";
import { query, mutation } from "./_generated/server";

/**
 * Get all tags.
 */
export const getAllTags = query({
  args: {},
  handler: async (ctx) => {
    const tags = await ctx.db.query("tags").collect();
    return tags;
  },
});

/**
 * Get a single tag by slug.
 */
export const getTagBySlug = query({
  args: { slug: v.string() },
  handler: async (ctx, args) => {
    const tag = await ctx.db
      .query("tags")
      .withIndex("by_slug", (q) => q.eq("slug", args.slug))
      .first();
    return tag;
  },
});

/**
 * Create a new tag.
 */
export const createTag = mutation({
  args: {
    name: v.string(),
    slug: v.string(),
  },
  handler: async (ctx, args) => {
    // Check if slug already exists
    const existing = await ctx.db
      .query("tags")
      .withIndex("by_slug", (q) => q.eq("slug", args.slug))
      .first();

    if (existing) {
      throw new Error("Tag with this slug already exists");
    }

    const id = await ctx.db.insert("tags", {
      name: args.name,
      slug: args.slug,
    });

    return { id };
  },
});

/**
 * Update an existing tag.
 */
export const updateTag = mutation({
  args: {
    id: v.id("tags"),
    name: v.string(),
    slug: v.string(),
  },
  handler: async (ctx, args) => {
    const { id, ...updates } = args;

    // Check if new slug conflicts with another tag
    const existing = await ctx.db
      .query("tags")
      .withIndex("by_slug", (q) => q.eq("slug", args.slug))
      .first();

    if (existing && existing._id !== id) {
      throw new Error("Another tag with this slug already exists");
    }

    await ctx.db.patch(id, updates);
    return { success: true };
  },
});

/**
 * Delete a tag.
 */
export const deleteTag = mutation({
  args: { id: v.id("tags") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
    return { success: true };
  },
});
