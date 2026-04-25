import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

// Shared story fields validator
const storyFields = {
  // Core fields
  Title: v.string(),
  Slug: v.string(),
  Category: v.string(), // Category slug reference
  Tag: v.string(),
  format: v.string(), // "headliner", "main", "side"

  // Thumbnail fields
  ThumbTitle: v.string(),
  ThumbDescription: v.string(),
  ThumbImage: v.string(),
  ThumbImageDescription: v.string(),

  // Additional thumbnail images for main stories
  ThumbImageOne: v.optional(v.string()),
  ThumbImageTwo: v.optional(v.string()),
  ThumbImageOneDescription: v.optional(v.string()),
  ThumbImageTwoDescription: v.optional(v.string()),

  // Side story specific
  ThumbDescriptionOne: v.optional(v.string()),
  ThumbDescriptionTwo: v.optional(v.string()),

  // Summary fields
  Summary: v.optional(v.string()),
  SummaryHighlighted: v.optional(v.string()),

  // Author reference
  AuthorSlug: v.string(),
  AuthorName: v.string(),

  // Content body
  IntroPara: v.string(),
  ParaTwo: v.string(),
  ParaThree: v.string(),
  ParaFour: v.string(),
  ParaFive: v.optional(v.string()),
  ParaSix: v.optional(v.string()),
  ParaSeven: v.string(),
  ParaEight: v.string(),
  AsideText: v.string(),

  // Metadata
  BackgroundColor: v.string(),
  Reads: v.number(),
  CreatedAt: v.number(), // Timestamp
  Published: v.boolean(),
};

export default defineSchema({
  // Existing tables
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
    JoinedAt: v.optional(v.number()),
  }).index("by_slug", ["Slug"]),

  // Story tables
  headlinerStory: defineTable(storyFields)
    .index("by_category", ["Category"])
    .index("by_category_format_slug", ["Category", "format", "Slug"])
    .index("by_author_slug", ["AuthorSlug"])
    .index("by_slug", ["Slug"]),

  mainStory: defineTable(storyFields)
    .index("by_category", ["Category"])
    .index("by_category_format_slug", ["Category", "format", "Slug"])
    .index("by_author_slug", ["AuthorSlug"])
    .index("by_slug", ["Slug"]),

  sideStory: defineTable(storyFields)
    .index("by_category", ["Category"])
    .index("by_category_format_slug", ["Category", "format", "Slug"])
    .index("by_author_slug", ["AuthorSlug"])
    .index("by_slug", ["Slug"]),

  // Feed status
  feedStatus: defineTable({
    LastRefreshed: v.number(),
    Message: v.string(),
  }),

  // Categories
  categories: defineTable({
    name: v.string(),
    slug: v.string(),
    description: v.optional(v.string()),
  }).index("by_slug", ["slug"]),

  // Tags
  tags: defineTable({
    name: v.string(),
    slug: v.string(),
  }).index("by_slug", ["slug"]),
});
