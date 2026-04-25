import { NextRequest, NextResponse } from "next/server";
import { fetchQuery, api } from "@/lib/convex";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const skip = parseInt(searchParams.get("skip") || "0", 10);
  const category = searchParams.get("category") || "";

  try {
    const stories = category
      ? await fetchQuery(api.home.getStoriesForCategory, { skip, category })
      : await fetchQuery(api.home.getStories, { skip });

    return NextResponse.json(stories);
  } catch (error) {
    console.error("Error fetching stories:", error);
    return NextResponse.json({ error: "Failed to fetch stories" }, { status: 500 });
  }
}
