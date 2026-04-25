import { v } from "convex/values";
import { query, mutation } from "./_generated/server";

/**
 * Get all categories.
 */
export const getAllCategories = query({
  args: {},
  handler: async (ctx) => {
    const categories = await ctx.db.query("categories").collect();
    return categories;
  },
});

/**
 * Get a single category by slug.
 */
export const getCategoryBySlug = query({
  args: { slug: v.string() },
  handler: async (ctx, args) => {
    const category = await ctx.db
      .query("categories")
      .withIndex("by_slug", (q) => q.eq("slug", args.slug))
      .first();
    return category;
  },
});

/**
 * Create a new category.
 */
export const createCategory = mutation({
  args: {
    name: v.string(),
    slug: v.string(),
    description: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    // Check if slug already exists
    const existing = await ctx.db
      .query("categories")
      .withIndex("by_slug", (q) => q.eq("slug", args.slug))
      .first();

    if (existing) {
      throw new Error("Category with this slug already exists");
    }

    const id = await ctx.db.insert("categories", {
      name: args.name,
      slug: args.slug,
      description: args.description,
    });

    return { id };
  },
});

/**
 * Update an existing category.
 */
export const updateCategory = mutation({
  args: {
    id: v.id("categories"),
    name: v.string(),
    slug: v.string(),
    description: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const { id, ...updates } = args;

    // Check if new slug conflicts with another category
    const existing = await ctx.db
      .query("categories")
      .withIndex("by_slug", (q) => q.eq("slug", args.slug))
      .first();

    if (existing && existing._id !== id) {
      throw new Error("Another category with this slug already exists");
    }

    await ctx.db.patch(id, updates);
    return { success: true };
  },
});

/**
 * Delete a category.
 */
export const deleteCategory = mutation({
  args: { id: v.id("categories") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
    return { success: true };
  },
});
