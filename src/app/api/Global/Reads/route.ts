import { NextResponse } from "next/server";
import { api } from "@/convex/_generated/api";
import { getConvexServerClient } from "convex/server";

export async function PUT(request: Request) {
  try {
    const post = await request.json();
    const { format, slug, category } = post;

    // Map format to Convex table name or logic if needed
    // For this example, we assume a single Convex mutation handles all cases
    const convex = getConvexServerClient();

    await convex.mutation(api.global.updateReads, {
      category,
      format,
      slug,
    });

    return NextResponse.json(
      { success: true },
      {
        status: 200,
        statusText: "Read count updated successfully",
      }
    );
  } catch (error) {
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : String(error),
        errorMessage: "Failed to update read count.",
      },
      {
        status: 500,
        statusText: "Failed to update read count.",
      }
    );
  }
}
