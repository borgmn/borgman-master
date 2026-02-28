import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

/**
 * Increment the read count for a post.
 */
export const updateReads = mutation({
  args: {
    category: v.string(),
    format: v.string(),
    slug: v.string(),
  },
  handler: async (ctx, args) => {
    // Assuming a "posts" table with unique (category, format, slug)
    const [post] = await ctx.db
      .query("posts")
      .withIndex("by_category_format_slug", q =>
        q.eq("Category", args.category)
         .eq("Format", args.format)
         .eq("Slug", args.slug)
      )
      .collect();

    if (!post) {
      throw new Error("Post not found");
    }

    await ctx.db.patch(post._id, {
      Reads: (post.Reads || 0) + 1,
    });

    return { success: true };
  },
});

/**
 * Get more stories for a category (pagination).
 */
export const getLoadMoreStories = query({
  args: {
    skip: v.number(),
    category: v.string(),
    take: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    // Default to 1 if take is not provided
    const take = args.take ?? 1;
    const stories = await ctx.db
      .query("mainStory")
      .withIndex("by_category", q => q.eq("Category", args.category))
      .order("desc")
      .skip(args.skip)
      .take(take);
    return stories;
  },
});
