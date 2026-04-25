"use client";

import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import Link from "next/link";

export default function AdminDashboard() {
  const posts = useQuery(api.post.getAllPosts);
  const categories = useQuery(api.categories.getAllCategories);
  const tags = useQuery(api.tags.getAllTags);
  const authors = useQuery(api.author.getAllAuthors);

  const stats = [
    {
      label: "Total Posts",
      value: posts?.length ?? 0,
      href: "/admin/posts",
      color: "bg-[#3cffd0]",
    },
    {
      label: "Categories",
      value: categories?.length ?? 0,
      href: "/admin/categories",
      color: "bg-[#ff3d00]",
    },
    {
      label: "Tags",
      value: tags?.length ?? 0,
      href: "/admin/tags",
      color: "bg-[#ffc2e7]",
    },
    {
      label: "Authors",
      value: authors?.length ?? 0,
      href: "/admin/authors",
      color: "bg-[#d6f31f]",
    },
  ];

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white mb-2">Dashboard</h1>
        <p className="text-[#a1a1a1]">
          Welcome to the Borgman CMS. Manage your content from here.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map((stat) => (
          <Link
            key={stat.label}
            href={stat.href}
            className="bg-[#1f1f1f] border border-[#2f2f2f] rounded-lg p-6 hover:border-[#3f3f3f] transition-colors"
          >
            <div className="flex items-center gap-3 mb-2">
              <div className={`w-3 h-3 rounded-full ${stat.color}`} />
              <span className="text-[#a1a1a1] text-sm">{stat.label}</span>
            </div>
            <p className="text-3xl font-bold text-white">{stat.value}</p>
          </Link>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="bg-[#1f1f1f] border border-[#2f2f2f] rounded-lg p-6">
        <h2 className="text-lg font-semibold text-white mb-4">Quick Actions</h2>
        <div className="flex flex-wrap gap-3">
          <Link
            href="/admin/posts/new"
            className="px-4 py-2 bg-[#3cffd0] text-black font-medium rounded-md hover:bg-[#33cea8] transition-colors"
          >
            Create New Post
          </Link>
          <Link
            href="/admin/categories"
            className="px-4 py-2 bg-[#2f2f2f] text-white font-medium rounded-md hover:bg-[#3f3f3f] transition-colors"
          >
            Manage Categories
          </Link>
          <Link
            href="/admin/tags"
            className="px-4 py-2 bg-[#2f2f2f] text-white font-medium rounded-md hover:bg-[#3f3f3f] transition-colors"
          >
            Manage Tags
          </Link>
          <Link
            href="/admin/authors"
            className="px-4 py-2 bg-[#2f2f2f] text-white font-medium rounded-md hover:bg-[#3f3f3f] transition-colors"
          >
            Manage Authors
          </Link>
        </div>
      </div>

      {/* Recent Posts */}
      <div className="mt-8 bg-[#1f1f1f] border border-[#2f2f2f] rounded-lg p-6">
        <h2 className="text-lg font-semibold text-white mb-4">Recent Posts</h2>
        {posts === undefined ? (
          <div className="text-[#a1a1a1]">Loading...</div>
        ) : posts.length === 0 ? (
          <div className="text-[#a1a1a1]">
            No posts yet.{" "}
            <Link href="/admin/posts/new" className="text-[#3cffd0] hover:underline">
              Create your first post
            </Link>
          </div>
        ) : (
          <ul className="space-y-3">
            {posts.slice(0, 5).map((post: any) => (
              <li
                key={post._id}
                className="flex items-center justify-between py-3 border-b border-[#2f2f2f] last:border-0"
              >
                <div>
                  <p className="text-white font-medium">{post.ThumbTitle}</p>
                  <p className="text-sm text-[#a1a1a1]">
                    {post.Category} • {post.format} • {post.Published ? "Published" : "Draft"}
                  </p>
                </div>
                <Link
                  href={`/admin/posts/${post._id}/edit`}
                  className="text-sm text-[#3cffd0] hover:underline"
                >
                  Edit
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
