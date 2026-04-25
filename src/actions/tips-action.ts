"use server";

import { api } from "../../convex/_generated/api";
import { ConvexHttpClient } from "convex/browser";

export const tipusSumbit = async (formData: FormData) => {
  const name = formData.get("name")?.toString() ?? "";
  const email = formData.get("email")?.toString() ?? "";
  const explain = formData.get("explain")?.toString() ?? "";
  const summarize = formData.get("summarize")?.toString() ?? "";

  try {
    const convexUrl = process.env.NEXT_PUBLIC_CONVEX_URL;
    if (!convexUrl) {
      throw new Error("NEXT_PUBLIC_CONVEX_URL is not set");
    }
    const client = new ConvexHttpClient(convexUrl);

    await client.mutation(api.tips.submitTipus, {
      name,
      email,
      explain,
      summarize,
    });

    return {
      status: true,
      error: false,
    };
  } catch (error) {
    console.error("Error submitting tip:", error);
    return {
      status: false,
      error: true,
    };
  }
};
