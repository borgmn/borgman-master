import { v } from "convex/values";
import { query } from "./_generated/server";

/**
 * Get the latest headline story (most recent HeadlinerStory).
 */
export const getHeadlines = query({
	args: {},
	handler: async (ctx) => {
		const headline = await ctx.db.query("headlinerStory").order("desc").take(1);
		return headline[0] || null;
	},
});

/**
 * Get the latest headline story for a specific category.
 */
export const getHeadlineForCategory = query({
	args: { category: v.string() },
	handler: async (ctx, args) => {
		const headline = await ctx.db
			.query("headlinerStory")
			.withIndex("by_category", (q) => q.eq("Category", args.category))
			.order("desc")
			.take(1);
		return headline[0] || null;
	},
});

/**
 * Get the number of stories for a given category.
 */
export const getStoriesLength = query({
	args: { category: v.optional(v.string()) },
	handler: async (ctx, args) => {
		if (!args.category) {
			const all = await ctx.db.query("mainStory").collect();
			return all.length;
		}
		const filtered = await ctx.db
			.query("mainStory")
			.withIndex("by_category", (q) => q.eq("Category", args.category))
			.collect();
		return filtered.length;
	},
});

/**
 * Get the top 5 stories (excluding the latest headline).
 */
export const getTopStories = query({
	args: {},
	handler: async (ctx) => {
		const topStories = await ctx.db
			.query("headlinerStory")
			.order("desc")
			.skip(1)
			.take(5);
		return topStories;
	},
});

/**
 * Get the top 5 stories for a specific category (excluding the latest headline).
 */
export const getTopStoriesForCategory = query({
	args: { category: v.string() },
	handler: async (ctx, args) => {
		const topStories = await ctx.db
			.query("headlinerStory")
			.withIndex("by_category", (q) => q.eq("Category", args.category))
			.order("desc")
			.skip(1)
			.take(5);
		return topStories;
	},
});

/**
 * Get main and side stories for the home feed, with pagination.
 */
export const getStories = query({
	args: { skip: v.number() },
	handler: async (ctx, args) => {
		const skipForSide = args.skip;
		const skipForMain = skipForSide * 2;

		const mainStories = await ctx.db
			.query("mainStory")
			.order("desc")
			.skip(skipForMain)
			.take(2);

		const sideStories = await ctx.db
			.query("sideStory")
			.order("desc")
			.skip(skipForSide)
			.take(1);

		const feedStatusArr = await ctx.db.query("feedStatus").take(1);
		const feedStatus = feedStatusArr[0] || null;

		return {
			mainThumb: mainStories,
			sideThumb: sideStories,
			feedThumb: feedStatus,
		};
	},
});

/**
 * Get main stories for the home feed.
 */
export const getMainStories = query({
	args: {},
	handler: async (ctx) => {
		const mainStories = await ctx.db.query("mainStory").order("desc").take(10);
		return mainStories;
	},
});

/**
 * Get side stories for the home feed.
 */
export const getSideStories = query({
	args: {},
	handler: async (ctx) => {
		const sideStories = await ctx.db.query("sideStory").order("desc").take(10);
		return sideStories;
	},
});

/**
 * Get stories for a specific category with pagination.
 */
export const getStoriesForCategory = query({
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
