import { ConvexHttpClient } from "convex/browser";
import { v } from "convex/values";

// Replace with your actual Convex deployment URL
const convexUrl = process.env.NEXT_PUBLIC_CONVEX_URL || "http://localhost:3210";
const client = new ConvexHttpClient(convexUrl);

async function seed() {
  const articles = [
    {
      Slug: "introduction-to-convex",
      Title: "Introduction to Convex",
      Content: "Convex is a powerful backend platform for building real-time apps.",
      Author: "Alice Smith",
      Category: "Tech",
      PublishedAt: new Date().toISOString(),
      Tags: ["convex", "backend", "realtime"],
    },
    {
      Slug: "nextjs-best-practices",
      Title: "Next.js Best Practices",
      Content: "Learn how to structure and optimize your Next.js applications.",
      Author: "Bob Johnson",
      Category: "Web Development",
      PublishedAt: new Date().toISOString(),
      Tags: ["nextjs", "react", "webdev"],
    },
    {
      Slug: "designing-for-accessibility",
      Title: "Designing for Accessibility",
      Content: "Accessibility is essential for building inclusive web experiences.",
      Author: "Carol Lee",
      Category: "Design",
      PublishedAt: new Date().toISOString(),
      Tags: ["accessibility", "design", "ux"],
    },
    {
      Slug: "ai-in-modern-apps",
      Title: "AI in Modern Apps",
      Content: "Integrating AI into your apps can unlock new possibilities.",
      Author: "David Kim",
      Category: "AI",
      PublishedAt: new Date().toISOString(),
      Tags: ["ai", "machine learning", "apps"],
    },
    {
      Slug: "scaling-with-serverless",
      Title: "Scaling with Serverless",
      Content: "Serverless architectures help scale applications efficiently.",
      Author: "Eva Green",
      Category: "Cloud",
      PublishedAt: new Date().toISOString(),
      Tags: ["serverless", "cloud", "scaling"],
    },
  ];

  for (const article of articles) {
    await client.mutation("articles:create", article);
    console.log(`Inserted article: ${article.Title}`);
  }
}

seed().catch((err) => {
  console.error("Seeding failed:", err);
  process.exit(1);
});
