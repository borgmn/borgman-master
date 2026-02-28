"use server";

import { api } from "@/convex/_generated/api";
import { getConvexServerClient } from "convex/server";

export const feedbackSumbit = async (formData: FormData) => {
  const name = formData.get("name")?.toString() || "";
  const email = formData.get("email")?.toString() || "";
  const feedback = formData.get("feedback")?.toString() || "";

  try {
    const convex = getConvexServerClient();
    await convex.mutation(api.feedback.submitFeedback, {
      name,
      email,
      feedback,
    });

    return {
      status: true,
      error: false,
    };
  } catch (error) {
    return {
      status: false,
      error: true,
    };
  }
};
