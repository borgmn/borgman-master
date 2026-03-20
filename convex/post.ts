import { v } from "convex/values";
import { query } from "./_generated/server";

/**
 * Get all posts from headline, main, and side stories.
 */
export const getAllPosts = query({
	args: {},
	handler: async (ctx) => {
		const headlineStories = await ctx.db.query("headlinerStory").collect();
		const mainStories = await ctx.db.query("mainStory").collect();
		const sideStories = await ctx.db.query("sideStory").collect();
		return [...headlineStories, ...mainStories, ...sideStories];
	},
});

/**
 * Get a single post by category, format, and slug.
 */
export const getSinglePost = query({
	args: {
		category: v.string(),
		format: v.string(),
		slug: v.string(),
	},
	handler: async (ctx, args) => {
		// Assuming "mainStory" and "headlinerStory" and "sideStory" all have Category, format, and Slug fields
		// Try to find in mainStory first, then headlinerStory, then sideStory
		const collections = ["mainStory", "headlinerStory", "sideStory"];
		for (const table of collections) {
			const [post] = await ctx.db
				.query(table)
				.withIndex("by_category_format_slug", (q) =>
					q
						.eq("Category", args.category)
						.eq("format", args.format)
						.eq("Slug", args.slug),
				)
				.take(1);
			if (post) return post;
		}
		return null;
	},
});

/**
 * Get more stories for a given category.
 */
export const getMoreStories = query({
	args: { category: v.string() },
	handler: async (ctx, args) => {
		// Assuming "mainStory" table has a Category field
		const stories = await ctx.db
			.query("mainStory")
			.withIndex("by_category", (q) => q.eq("Category", args.category))
			.order("desc")
			.take(10);
		return stories;
	},
});

/**
 * Get additional stories for "load more" functionality.
 */
export const getLoadMoreStories = query({
	args: { skip: v.number(), category: v.string() },
	handler: async (ctx, args) => {
		const stories = await ctx.db
			.query("mainStory")
			.withIndex("by_category", (q) => q.eq("Category", args.category))
			.order("desc")
			.skip(args.skip)
			.take(1);
		return stories;
	},
});
