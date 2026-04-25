"use client";

import { useState } from "react";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { useRouter } from "next/navigation";

interface PostFormProps {
  initialData?: any;
  isEditing?: boolean;
}

const formatOptions = [
  { value: "headliner", label: "Headliner" },
  { value: "main", label: "Main" },
  { value: "side", label: "Side" },
];

const colorOptions = [
  { value: "ORANGE", label: "Orange (Ember)" },
  { value: "LEAF", label: "Leaf (Zephyr)" },
  { value: "PINK", label: "Pink (Cotton)" },
  { value: "TORQUISE", label: "Turquoise (Aqua)" },
];

export default function PostForm({ initialData, isEditing }: PostFormProps) {
  const router = useRouter();
  const createPost = useMutation(api.post.createPost);
  const updatePost = useMutation(api.post.updatePost);
  const categories = useQuery(api.categories.getAllCategories);
  const authors = useQuery(api.author.getAllAuthors);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    Title: initialData?.Title || "",
    Slug: initialData?.Slug || "",
    Category: initialData?.Category || "",
    Tag: initialData?.Tag || "",
    format: initialData?.format || "main",
    ThumbTitle: initialData?.ThumbTitle || "",
    ThumbDescription: initialData?.ThumbDescription || "",
    ThumbImage: initialData?.ThumbImage || "",
    ThumbImageDescription: initialData?.ThumbImageDescription || "",
    ThumbImageOne: initialData?.ThumbImageOne || "",
    ThumbImageTwo: initialData?.ThumbImageTwo || "",
    ThumbImageOneDescription: initialData?.ThumbImageOneDescription || "",
    ThumbImageTwoDescription: initialData?.ThumbImageTwoDescription || "",
    ThumbDescriptionOne: initialData?.ThumbDescriptionOne || "",
    ThumbDescriptionTwo: initialData?.ThumbDescriptionTwo || "",
    Summary: initialData?.Summary || "",
    SummaryHighlighted: initialData?.SummaryHighlighted || "",
    AuthorSlug: initialData?.AuthorSlug || "",
    AuthorName: initialData?.AuthorName || "",
    IntroPara: initialData?.IntroPara || "",
    ParaTwo: initialData?.ParaTwo || "",
    ParaThree: initialData?.ParaThree || "",
    ParaFour: initialData?.ParaFour || "",
    ParaFive: initialData?.ParaFive || "",
    ParaSix: initialData?.ParaSix || "",
    ParaSeven: initialData?.ParaSeven || "",
    ParaEight: initialData?.ParaEight || "",
    AsideText: initialData?.AsideText || "",
    BackgroundColor: initialData?.BackgroundColor || "ORANGE",
    Published: initialData?.Published || false,
  });

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const title = e.target.value;
    setFormData((prev) => ({
      ...prev,
      Title: title,
      ThumbTitle: prev.ThumbTitle || title,
      Slug: prev.Slug || generateSlug(title),
    }));
  };

  const handleAuthorChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const slug = e.target.value;
    const author = authors?.find((a: any) => a.Slug === slug);
    setFormData((prev) => ({
      ...prev,
      AuthorSlug: slug,
      AuthorName: author?.Name || slug,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      if (isEditing && initialData?._id) {
        await updatePost({
          id: initialData._id,
          tableName: initialData.tableName || "mainStory",
          ...formData,
          format: formData.format as "headliner" | "main" | "side",
        });
      } else {
        await createPost({
          ...formData,
          format: formData.format as "headliner" | "main" | "side",
        });
      }
      router.push("/admin/posts");
    } catch (error) {
      console.error("Error saving post:", error);
      alert("Failed to save post");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Basic Info */}
      <div className="bg-[#1f1f1f] border border-[#2f2f2f] rounded-lg p-6">
        <h2 className="text-lg font-semibold text-white mb-4">Basic Information</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-[#a1a1a1] mb-1">
              Title
            </label>
            <input
              type="text"
              value={formData.Title}
              onChange={handleTitleChange}
              required
              className="w-full px-3 py-2 bg-[#2f2f2f] border border-[#3f3f3f] rounded-md text-white focus:outline-none focus:border-[#3cffd0]"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-[#a1a1a1] mb-1">
              Slug
            </label>
            <input
              type="text"
              value={formData.Slug}
              onChange={(e) => setFormData({ ...formData, Slug: e.target.value })}
              required
              className="w-full px-3 py-2 bg-[#2f2f2f] border border-[#3f3f3f] rounded-md text-white focus:outline-none focus:border-[#3cffd0]"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-[#a1a1a1] mb-1">
              Tag
            </label>
            <input
              type="text"
              value={formData.Tag}
              onChange={(e) => setFormData({ ...formData, Tag: e.target.value })}
              required
              placeholder="e.g., Technology, Review"
              className="w-full px-3 py-2 bg-[#2f2f2f] border border-[#3f3f3f] rounded-md text-white focus:outline-none focus:border-[#3cffd0]"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-[#a1a1a1] mb-1">
              Category
            </label>
            <select
              value={formData.Category}
              onChange={(e) => setFormData({ ...formData, Category: e.target.value })}
              required
              className="w-full px-3 py-2 bg-[#2f2f2f] border border-[#3f3f3f] rounded-md text-white focus:outline-none focus:border-[#3cffd0]"
            >
              <option value="">Select category</option>
              {categories?.map((cat: any) => (
                <option key={cat._id} value={cat.slug}>
                  {cat.name}
                </option>
              ))}
              <option value="Tech">Tech</option>
              <option value="Review">Review</option>
              <option value="Entertainment">Entertainment</option>
              <option value="News">News</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-[#a1a1a1] mb-1">
              Format
            </label>
            <select
              value={formData.format}
              onChange={(e) => setFormData({ ...formData, format: e.target.value })}
              required
              className="w-full px-3 py-2 bg-[#2f2f2f] border border-[#3f3f3f] rounded-md text-white focus:outline-none focus:border-[#3cffd0]"
            >
              {formatOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-[#a1a1a1] mb-1">
              Author
            </label>
            <select
              value={formData.AuthorSlug}
              onChange={handleAuthorChange}
              required
              className="w-full px-3 py-2 bg-[#2f2f2f] border border-[#3f3f3f] rounded-md text-white focus:outline-none focus:border-[#3cffd0]"
            >
              <option value="">Select author</option>
              {authors?.map((author: any) => (
                <option key={author.Slug} value={author.Slug}>
                  {author.Slug}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-[#a1a1a1] mb-1">
              Background Color
            </label>
            <select
              value={formData.BackgroundColor}
              onChange={(e) => setFormData({ ...formData, BackgroundColor: e.target.value })}
              required
              className="w-full px-3 py-2 bg-[#2f2f2f] border border-[#3f3f3f] rounded-md text-white focus:outline-none focus:border-[#3cffd0]"
            >
              {colorOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Thumbnail */}
      <div className="bg-[#1f1f1f] border border-[#2f2f2f] rounded-lg p-6">
        <h2 className="text-lg font-semibold text-white mb-4">Thumbnail</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-[#a1a1a1] mb-1">
              Thumbnail Title
            </label>
            <input
              type="text"
              value={formData.ThumbTitle}
              onChange={(e) => setFormData({ ...formData, ThumbTitle: e.target.value })}
              required
              className="w-full px-3 py-2 bg-[#2f2f2f] border border-[#3f3f3f] rounded-md text-white focus:outline-none focus:border-[#3cffd0]"
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-[#a1a1a1] mb-1">
              Thumbnail Description
            </label>
            <textarea
              value={formData.ThumbDescription}
              onChange={(e) => setFormData({ ...formData, ThumbDescription: e.target.value })}
              required
              rows={2}
              className="w-full px-3 py-2 bg-[#2f2f2f] border border-[#3f3f3f] rounded-md text-white focus:outline-none focus:border-[#3cffd0]"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-[#a1a1a1] mb-1">
              Thumbnail Image URL
            </label>
            <input
              type="url"
              value={formData.ThumbImage}
              onChange={(e) => setFormData({ ...formData, ThumbImage: e.target.value })}
              required
              className="w-full px-3 py-2 bg-[#2f2f2f] border border-[#3f3f3f] rounded-md text-white focus:outline-none focus:border-[#3cffd0]"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-[#a1a1a1] mb-1">
              Image Alt Text
            </label>
            <input
              type="text"
              value={formData.ThumbImageDescription}
              onChange={(e) => setFormData({ ...formData, ThumbImageDescription: e.target.value })}
              required
              className="w-full px-3 py-2 bg-[#2f2f2f] border border-[#3f3f3f] rounded-md text-white focus:outline-none focus:border-[#3cffd0]"
            />
          </div>
        </div>
      </div>

      {/* Article Content */}
      <div className="bg-[#1f1f1f] border border-[#2f2f2f] rounded-lg p-6">
        <h2 className="text-lg font-semibold text-white mb-4">Article Content</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-[#a1a1a1] mb-1">
              Introduction Paragraph
            </label>
            <textarea
              value={formData.IntroPara}
              onChange={(e) => setFormData({ ...formData, IntroPara: e.target.value })}
              required
              rows={4}
              className="w-full px-3 py-2 bg-[#2f2f2f] border border-[#3f3f3f] rounded-md text-white focus:outline-none focus:border-[#3cffd0]"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-[#a1a1a1] mb-1">
              Paragraph 2
            </label>
            <textarea
              value={formData.ParaTwo}
              onChange={(e) => setFormData({ ...formData, ParaTwo: e.target.value })}
              required
              rows={4}
              className="w-full px-3 py-2 bg-[#2f2f2f] border border-[#3f3f3f] rounded-md text-white focus:outline-none focus:border-[#3cffd0]"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-[#a1a1a1] mb-1">
              Paragraph 3
            </label>
            <textarea
              value={formData.ParaThree}
              onChange={(e) => setFormData({ ...formData, ParaThree: e.target.value })}
              required
              rows={4}
              className="w-full px-3 py-2 bg-[#2f2f2f] border border-[#3f3f3f] rounded-md text-white focus:outline-none focus:border-[#3cffd0]"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-[#a1a1a1] mb-1">
              Paragraph 4
            </label>
            <textarea
              value={formData.ParaFour}
              onChange={(e) => setFormData({ ...formData, ParaFour: e.target.value })}
              required
              rows={4}
              className="w-full px-3 py-2 bg-[#2f2f2f] border border-[#3f3f3f] rounded-md text-white focus:outline-none focus:border-[#3cffd0]"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-[#a1a1a1] mb-1">
              Paragraph 5 (Optional)
            </label>
            <textarea
              value={formData.ParaFive}
              onChange={(e) => setFormData({ ...formData, ParaFive: e.target.value })}
              rows={4}
              className="w-full px-3 py-2 bg-[#2f2f2f] border border-[#3f3f3f] rounded-md text-white focus:outline-none focus:border-[#3cffd0]"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-[#a1a1a1] mb-1">
              Paragraph 6 (Optional)
            </label>
            <textarea
              value={formData.ParaSix}
              onChange={(e) => setFormData({ ...formData, ParaSix: e.target.value })}
              rows={4}
              className="w-full px-3 py-2 bg-[#2f2f2f] border border-[#3f3f3f] rounded-md text-white focus:outline-none focus:border-[#3cffd0]"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-[#a1a1a1] mb-1">
              Paragraph 7
            </label>
            <textarea
              value={formData.ParaSeven}
              onChange={(e) => setFormData({ ...formData, ParaSeven: e.target.value })}
              required
              rows={4}
              className="w-full px-3 py-2 bg-[#2f2f2f] border border-[#3f3f3f] rounded-md text-white focus:outline-none focus:border-[#3cffd0]"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-[#a1a1a1] mb-1">
              Paragraph 8
            </label>
            <textarea
              value={formData.ParaEight}
              onChange={(e) => setFormData({ ...formData, ParaEight: e.target.value })}
              required
              rows={4}
              className="w-full px-3 py-2 bg-[#2f2f2f] border border-[#3f3f3f] rounded-md text-white focus:outline-none focus:border-[#3cffd0]"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-[#a1a1a1] mb-1">
              Aside Text
            </label>
            <textarea
              value={formData.AsideText}
              onChange={(e) => setFormData({ ...formData, AsideText: e.target.value })}
              required
              rows={2}
              className="w-full px-3 py-2 bg-[#2f2f2f] border border-[#3f3f3f] rounded-md text-white focus:outline-none focus:border-[#3cffd0]"
            />
          </div>
        </div>
      </div>

      {/* Publishing */}
      <div className="bg-[#1f1f1f] border border-[#2f2f2f] rounded-lg p-6">
        <h2 className="text-lg font-semibold text-white mb-4">Publishing</h2>
        <div className="flex items-center gap-3">
          <input
            type="checkbox"
            id="published"
            checked={formData.Published}
            onChange={(e) => setFormData({ ...formData, Published: e.target.checked })}
            className="w-4 h-4 rounded border-[#3f3f3f] bg-[#2f2f2f] text-[#3cffd0] focus:ring-[#3cffd0]"
          />
          <label htmlFor="published" className="text-white">
            Publish immediately
          </label>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center justify-end gap-4">
        <button
          type="button"
          onClick={() => router.push("/admin/posts")}
          className="px-4 py-2 text-[#a1a1a1] hover:text-white transition-colors"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="px-6 py-2 bg-[#3cffd0] text-black font-medium rounded-md hover:bg-[#33cea8] transition-colors disabled:opacity-50"
        >
          {isSubmitting ? "Saving..." : isEditing ? "Update Post" : "Create Post"}
        </button>
      </div>
    </form>
  );
}
