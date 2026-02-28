import { mutation } from "./_generated/server";
import { v } from "convex/values";

export const submitFeedback = mutation({
  args: {
    name: v.string(),
    email: v.string(),
    feedback: v.string(),
  },
  handler: async (ctx, args) => {
    await ctx.db.insert("feedback", {
      Name: args.name,
      Email: args.email,
      Feedback: args.feedback,
    });
  },
});
