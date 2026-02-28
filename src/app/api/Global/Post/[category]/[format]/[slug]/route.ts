import { NextResponse } from "next/server";
import { api } from "@/convex/_generated/api";
import { getConvexServerClient } from "convex/server";
import { Category } from "@/utils/interfaces";

// This API route fetches a post by category, format, and slug using Convex.
export async function GET(
  request: Request,
  {
    params,
  }: {
    params: {
      category: Category;
      format: string;
      slug: string;
    };
  }
) {
  try {
    const { category, format, slug } = params;
    const convex = getConvexServerClient();

    // Call the Convex query to get the post
    const postData = await convex.query(api.post.getSinglePost, {
      category,
      format,
      slug,
    });

    if (!postData) {
      return NextResponse.json(
        {
          error: true,
          errorMessage: "Post not found.",
        },
        {
          status: 404,
          statusText: "The server cannot find the requested resource.",
        }
      );
    }

    return NextResponse.json(
      { postData },
      {
        status: 200,
        statusText: "The resource has been fetched and transmitted to the client",
      }
    );
  } catch (error) {
    return NextResponse.json(
      {
        error: true,
        errorMessage: "An error occurred while fetching the post.",
        details: (error as Error).message,
      },
      {
        status: 500,
        statusText: "Internal Server Error",
      }
    );
  }
}
