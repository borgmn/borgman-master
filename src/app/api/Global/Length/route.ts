borgman-master/src/app/api/Global/Length/route.ts
```
import { NextResponse } from "next/server";
import { api } from "@/convex/_generated/api";
import { getConvexServerClient } from "convex/server";

/**
 * API Route: /api/Global/Length
 * Returns the total count of main and side stories using Convex.
 */
export async function GET() {
  try {
    const convex = getConvexServerClient();

    // Fetch all main stories and side stories counts from Convex
    const mainStories = await convex.query(api.home.getStoriesLength, { category: null });
    // If you have a separate function for side stories, call it here. Otherwise, adjust as needed.
    // Example: const sideStories = await convex.query(api.home.getSideStoriesLength, { category: null });

    // For demonstration, assuming getStoriesLength returns the total count for main stories only.
    // If you need both, implement and call both Convex queries.
    const mainStoriesLength = mainStories;
    // const sideStoriesLength = sideStories;

    return NextResponse.json(
      {
        mainStoriesLength,
        // sideStoriesLength,
      },
      {
        status: 200,
        statusText: "The resource has been fetched and transmitted to the client",
      }
    );
  } catch (error) {
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : error,
        errorMessage: "The server cannot find the requested resource.",
      },
      {
        status: 404,
        statusText: "The server cannot find the requested resource.",
      }
    );
  }
}
