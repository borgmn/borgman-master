"use client";

import { useQuery, useMutation } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import Link from "next/link";
import { useState } from "react";

export default function PostsPage() {
  const posts = useQuery(api.post.getAllPosts);
  const deletePost = useMutation(api.post.deletePost);
  const togglePublish = useMutation(api.post.togglePublishPost);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this post?")) return;
    setDeletingId(id);
    try {
      await deletePost({ id: id as any });
    } catch (error) {
      console.error("Error deleting post:", error);
      alert("Failed to delete post");
    } finally {
      setDeletingId(null);
    }
  };

  const handleTogglePublish = async (id: string) => {
    try {
      await togglePublish({ id: id as any });
    } catch (error) {
      console.error("Error toggling publish:", error);
      alert("Failed to update publish status");
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white mb-2">Posts</h1>
          <p className="text-[#a1a1a1]">Manage your articles and stories</p>
        </div>
        <Link
          href="/admin/posts/new"
          className="px-4 py-2 bg-[#3cffd0] text-black font-medium rounded-md hover:bg-[#33cea8] transition-colors"
        >
          Create Post
        </Link>
      </div>

      <div className="bg-[#1f1f1f] border border-[#2f2f2f] rounded-lg overflow-hidden">
        {posts === undefined ? (
          <div className="p-6 text-[#a1a1a1]">Loading...</div>
        ) : posts.length === 0 ? (
          <div className="p-6 text-center">
            <p className="text-[#a1a1a1] mb-4">No posts yet</p>
            <Link
              href="/admin/posts/new"
              className="text-[#3cffd0] hover:underline"
            >
              Create your first post
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-[#2f2f2f]">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-[#a1a1a1] uppercase tracking-wider">
                    Title
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-[#a1a1a1] uppercase tracking-wider">
                    Category
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-[#a1a1a1] uppercase tracking-wider">
                    Format
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-[#a1a1a1] uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-[#a1a1a1] uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#2f2f2f]">
                {posts.map((post: any) => (
                  <tr key={post._id} className="hover:bg-[#2a2a2a]">
                    <td className="px-6 py-4">
                      <div>
                        <p className="text-white font-medium">{post.ThumbTitle}</p>
                        <p className="text-sm text-[#a1a1a1]">{post.Slug}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-[#a1a1a1]">{post.Category}</td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex px-2 py-1 text-xs font-medium rounded ${
                          post.format === "headliner"
                            ? "bg-[#ff3d00]/20 text-[#ff3d00]"
                            : post.format === "main"
                            ? "bg-[#3cffd0]/20 text-[#3cffd0]"
                            : "bg-[#ffc2e7]/20 text-[#ffc2e7]"
                        }`}
                      >
                        {post.format}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => handleTogglePublish(post._id)}
                        className={`inline-flex px-2 py-1 text-xs font-medium rounded cursor-pointer ${
                          post.Published
                            ? "bg-green-500/20 text-green-400"
                            : "bg-yellow-500/20 text-yellow-400"
                        }`}
                      >
                        {post.Published ? "Published" : "Draft"}
                      </button>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          href={`/admin/posts/${post._id}/edit`}
                          className="px-3 py-1 text-sm text-[#3cffd0] hover:bg-[#3cffd0]/10 rounded transition-colors"
                        >
                          Edit
                        </Link>
                        <button
                          onClick={() => handleDelete(post._id)}
                          disabled={deletingId === post._id}
                          className="px-3 py-1 text-sm text-red-400 hover:bg-red-400/10 rounded transition-colors disabled:opacity-50"
                        >
                          {deletingId === post._id ? "..." : "Delete"}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
