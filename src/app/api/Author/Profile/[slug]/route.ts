borgman-master/src/app/api/Author/Profile/[slug]/route.ts
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

    // Call the Convex query to get the author profile
    const AuthorProfile = await convex.query(api.author.getAuthorProfile, { slug });

    if (!AuthorProfile) {
      return NextResponse.json(
        {
          error: "Author not found",
          errorMessage: "The server cannot find the requested resource.",
        },
        {
          status: 404,
          statusText: "The server cannot find the requested resource.",
        }
      );
    }

    return NextResponse.json(
      { AuthorProfile },
      {
        status: 200,
        statusText: "The resource has been fetched and transmitted to the client",
      }
    );
  } catch (error) {
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : error,
        errorMessage: "An error occurred while fetching the author profile.",
      },
      {
        status: 500,
        statusText: "Internal Server Error",
      }
    );
  }
}
