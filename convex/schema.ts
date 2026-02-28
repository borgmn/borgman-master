
import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  feedback: defineTable({
    Name: v.string(),
    Email: v.string(),
    Feedback: v.string(),
  }),
  tipus: defineTable({
    Name: v.string(),
    Email: v.string(),
    Detail: v.string(),
    Sentence: v.string(),
  }),
  author: defineTable({
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
  }).index("by_slug", ["Slug"]),
});
