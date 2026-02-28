import { NextResponse } from "next/server";
import { api } from "@/convex/_generated/api";
import { getConvexServerClient } from "convex/server";

export async function GET(
  request: Request,
  { params }: { params: { slug: string } }
) {
  try {
    const { slug } = params;
    const convex = getConvexServerClient();

    // Call the Convex function to get all stories for the author
    const authorStories = await convex.query(api.author.getAuthorStories, { slug });

    return NextResponse.json(
      { authorStories },
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
