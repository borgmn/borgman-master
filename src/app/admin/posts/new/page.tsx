"use client";

import PostForm from "@/components/admin/post-form";
import Link from "next/link";

export default function NewPostPage() {
  return (
    <div>
      <div className="mb-8">
        <div className="flex items-center gap-2 text-sm text-[#a1a1a1] mb-2">
          <Link href="/admin/posts" className="hover:text-white">
            Posts
          </Link>
          <span>/</span>
          <span>New Post</span>
        </div>
        <h1 className="text-2xl font-bold text-white">Create New Post</h1>
      </div>

      <PostForm />
    </div>
  );
}
