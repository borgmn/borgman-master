import { query } from "./_generated/server";
import { v } from "convex/values";

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
