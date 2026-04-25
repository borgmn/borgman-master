import { v } from "convex/values";
import { query, mutation } from "./_generated/server";

// Shared story fields validator for mutations
const storyFieldsValidator = {
  Title: v.string(),
  Slug: v.string(),
  Category: v.string(),
  Tag: v.string(),
  format: v.union(v.literal("headliner"), v.literal("main"), v.literal("side")),
  ThumbTitle: v.string(),
  ThumbDescription: v.string(),
  ThumbImage: v.string(),
  ThumbImageDescription: v.string(),
  ThumbImageOne: v.optional(v.string()),
  ThumbImageTwo: v.optional(v.string()),
  ThumbImageOneDescription: v.optional(v.string()),
  ThumbImageTwoDescription: v.optional(v.string()),
  ThumbDescriptionOne: v.optional(v.string()),
  ThumbDescriptionTwo: v.optional(v.string()),
  Summary: v.optional(v.string()),
  SummaryHighlighted: v.optional(v.string()),
  AuthorSlug: v.string(),
  AuthorName: v.string(),
  IntroPara: v.string(),
  ParaTwo: v.string(),
  ParaThree: v.string(),
  ParaFour: v.string(),
  ParaFive: v.optional(v.string()),
  ParaSix: v.optional(v.string()),
  ParaSeven: v.string(),
  ParaEight: v.string(),
  AsideText: v.string(),
  BackgroundColor: v.string(),
  Published: v.optional(v.boolean()),
};

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

/**
 * Create a new post (article).
 */
export const createPost = mutation({
	args: storyFieldsValidator,
	handler: async (ctx, args) => {
		const { format, ...rest } = args;

		// Determine which table to insert into based on format
		const tableMap = {
			headliner: "headlinerStory",
			main: "mainStory",
			side: "sideStory",
		} as const;

		const tableName = tableMap[format];

		const postData = {
			...rest,
			format,
			Reads: 0,
			CreatedAt: Date.now(),
			Published: args.Published ?? false,
		};

		const id = await ctx.db.insert(tableName, postData);
		return { id, tableName };
	},
});

/**
 * Update an existing post.
 */
export const updatePost = mutation({
	args: {
		id: v.id("headlinerStory"),
		tableName: v.union(
			v.literal("headlinerStory"),
			v.literal("mainStory"),
			v.literal("sideStory")
		),
		...storyFieldsValidator,
	},
	handler: async (ctx, args) => {
		const { id, tableName, format, ...updates } = args;

		// We need to cast the id based on the table
		// For simplicity, we'll delete and recreate if format changes
		const existingPost = await ctx.db.get(id);
		if (!existingPost) {
			throw new Error("Post not found");
		}

		const currentTable = existingPost.format === "headliner" ? "headlinerStory" : 
			existingPost.format === "main" ? "mainStory" : "sideStory";

		// If format changed, delete from old table and create in new
		if (format !== existingPost.format) {
			await ctx.db.delete(id);

			const tableMap = {
				headliner: "headlinerStory",
				main: "mainStory",
				side: "sideStory",
			} as const;

			const newTableName = tableMap[format];
			const newId = await ctx.db.insert(newTableName, {
				...updates,
				format,
				Reads: existingPost.Reads,
				CreatedAt: existingPost.CreatedAt,
				Published: updates.Published ?? existingPost.Published,
			});

			return { id: newId, tableName: newTableName };
		}

		// Update in same table
		await ctx.db.patch(id, {
			...updates,
			format,
		});

		return { id, tableName: currentTable };
	},
});

/**
 * Delete a post.
 */
export const deletePost = mutation({
	args: {
		id: v.id("headlinerStory"),
	},
	handler: async (ctx, args) => {
		await ctx.db.delete(args.id);
		return { success: true };
	},
});

/**
 * Toggle publish status of a post.
 */
export const togglePublishPost = mutation({
	args: {
		id: v.id("headlinerStory"),
	},
	handler: async (ctx, args) => {
		const post = await ctx.db.get(args.id);
		if (!post) {
			throw new Error("Post not found");
		}

		await ctx.db.patch(args.id, {
			Published: !post.Published,
		});

		return { published: !post.Published };
	},
});

/**
 * Get a single post by ID for editing.
 */
export const getPostById = query({
	args: { id: v.string() },
	handler: async (ctx, args) => {
		// Try each table
		const tables = ["headlinerStory", "mainStory", "sideStory"] as const;
		for (const table of tables) {
			try {
				const post = await ctx.db
					.query(table)
					.filter((q) => q.eq(q.field("_id"), args.id))
					.first();
				if (post) {
					return { ...post, tableName: table };
				}
			} catch {
				continue;
			}
		}
		return null;
	},
});
