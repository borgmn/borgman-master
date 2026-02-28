borgman-master/src/app/api/Global/Length/[category]/route.ts
import { NextResponse } from "next/server";
import { api } from "@/convex/_generated/api";
import { getConvexServerClient } from "convex/server";
import { Category } from "@/utils/interfaces";

export async function GET(
  request: Request,
  { params }: { params: { category: Category | undefined } }
) {
  try {
    const category = params.category;
    const convex = getConvexServerClient();

    // Call the Convex query for stories length by category
    const length = await convex.query(api.home.getStoriesLength, {
      category: category ?? null,
    });

    return NextResponse.json(
      { length },
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
