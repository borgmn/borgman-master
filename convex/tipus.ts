import { mutation } from "./_generated/server";
import { v } from "convex/values";

export const submitTipus = mutation({
  args: {
    name: v.string(),
    email: v.string(),
    explain: v.string(),
    summarize: v.string(),
  },
  handler: async (ctx, args) => {
    await ctx.db.insert("tipus", {
      Name: args.name,
      Email: args.email,
      Detail: args.explain,
      Sentence: args.summarize,
    });
  },
});
