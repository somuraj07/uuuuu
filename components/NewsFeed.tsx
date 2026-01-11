"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { motion } from "framer-motion";
import { toast } from "@/services/toast/toast.service";
import { MAIN_COLOR, ACCENT_COLOR } from "@/constants/colors";

interface NewsFeed {
  id: string;
  title: string;
  description: string;
  tagline?: string | null;
  mediaUrl: string | null;
  mediaType: string | null;
  createdAt: string;
  createdBy: { id: string; name: string | null; email: string | null };
}

function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
  });
}

export default function NewsFeedPage() {
  const { data: session, status } = useSession();
  const [newsFeeds, setNewsFeeds] = useState<NewsFeed[]>([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingFeed, setEditingFeed] = useState<NewsFeed | null>(null);
  const [form, setForm] = useState({
    title: "",
    description: "",
    tagline: "",
    media: null as File | null,
  });
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (session) {
      fetchNewsFeeds();
    }
  }, [session]);

  const fetchNewsFeeds = async () => {
    try {
      const res = await fetch("/api/newsfeed/list");
      const data = await res.json();
      if (res.ok && data.newsFeeds) {
        setNewsFeeds(data.newsFeeds);
      }
    } catch (err) {
      console.error("Error fetching news feeds:", err);
      toast.error("Failed to load news feeds");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title || !form.description) {
      setMessage("Title and description are required");
      toast.error("Title and description are required");
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      let mediaUrl: string | null = null;

      if (form.media) {
        if (form.media.size > 500_000) {
          toast.error("Image must be less than 500KB");
          setLoading(false);
          return;
        }
        mediaUrl = await fileToBase64(form.media);
      }

      const url = editingFeed
        ? `/api/newsfeed/${editingFeed.id}`
        : "/api/newsfeed/create";
      const method = editingFeed ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: form.title,
          description: form.description,
          tagline: form.tagline || null,
          mediaUrl: mediaUrl || (editingFeed?.mediaUrl || null),
          mediaType: mediaUrl ? "image" : (editingFeed?.mediaType || null),
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setMessage(data.message || "Failed to save news feed");
        toast.error(data.message || "Failed to save news feed");
        return;
      }

      const successMsg = editingFeed ? "News feed updated successfully!" : "News feed created successfully!";
      setMessage(successMsg);
      toast.success(successMsg);
      setForm({ title: "", description: "", tagline: "", media: null });
      setShowForm(false);
      setEditingFeed(null);
      fetchNewsFeeds();
    } catch (err) {
      console.error(err);
      setMessage("Something went wrong");
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (feed: NewsFeed) => {
    setEditingFeed(feed);
    setForm({
      title: feed.title,
      description: feed.description,
      tagline: feed.tagline || "",
      media: null,
    });
    setShowForm(true);
    setMessage("");
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this news feed?")) return;

    try {
      const res = await fetch(`/api/newsfeed/${id}`, {
        method: "DELETE",
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.message || "Failed to delete news feed");
        return;
      }

      toast.success("News feed deleted successfully!");
      fetchNewsFeeds();
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong");
    }
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingFeed(null);
    setForm({ title: "", description: "", tagline: "", media: null });
    setMessage("");
  };

  if (status === "loading") return <p className="p-6">Loading session…</p>;
  if (!session) return <p className="p-6 text-red-600">Not authenticated</p>;

  return (
    <div className="p-4 sm:p-6 space-y-6">
      {/* Header */}
      <div className="glass-card rounded-2xl p-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold" style={{ color: MAIN_COLOR }}>
            News Feed
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Share announcements and updates with the school community
          </p>
        </div>
        <button
          onClick={() => {
            handleCancel();
            setShowForm(!showForm);
          }}
          className="px-6 py-3 rounded-lg text-white font-medium transition disabled:opacity-60 flex items-center justify-center gap-2"
          style={{ backgroundColor: MAIN_COLOR }}
          onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.9")}
          onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
        >
          {showForm ? "Cancel" : "+ Create Post"}
        </button>
      </div>

      {/* Messages */}
      {message && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className={`p-4 rounded-xl ${
            message.includes("successfully")
              ? "bg-purple-100"
              : "bg-red-100 text-red-700"
          }`}
          style={message.includes("successfully") ? { color: MAIN_COLOR } : undefined}
        >
          {message}
        </motion.div>
      )}

      {/* Create/Edit Form */}
      {showForm && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card rounded-2xl p-6"
        >
          <h2 className="text-xl font-semibold mb-4" style={{ color: MAIN_COLOR }}>
            {editingFeed ? "Edit News Feed" : "Create News Feed"}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Title <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                required
                placeholder="Enter title"
                className="w-full px-4 py-3 rounded-lg border glass focus:outline-none focus:ring-2 transition"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tagline (Optional)
              </label>
              <input
                type="text"
                value={form.tagline}
                onChange={(e) => setForm({ ...form, tagline: e.target.value })}
                placeholder="Short highlight (optional)"
                className="w-full px-4 py-3 rounded-lg border glass focus:outline-none focus:ring-2 transition"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description <span className="text-red-500">*</span>
              </label>
              <textarea
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                required
                rows={4}
                placeholder="Write your announcement here..."
                className="w-full px-4 py-3 rounded-lg border glass focus:outline-none focus:ring-2 transition resize-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Upload Image (Optional)
              </label>
              <div className="flex items-center gap-3">
                <input
                  id="media-upload"
                  type="file"
                  accept="image/*"
                  onChange={(e) =>
                    setForm({ ...form, media: e.target.files?.[0] || null })
                  }
                  className="hidden"
                />
                <label
                  htmlFor="media-upload"
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-3 border glass rounded-lg cursor-pointer text-sm text-gray-700 hover:glass-strong transition"
                  style={{ borderColor: ACCENT_COLOR }}
                >
                  📷 {form.media ? form.media.name : "Select media from computer"}
                </label>
                {form.media && (
                  <button
                    type="button"
                    onClick={() => setForm({ ...form, media: null })}
                    className="px-4 py-3 rounded-lg text-sm font-medium transition"
                    style={{ 
                      backgroundColor: ACCENT_COLOR + "40",
                      color: MAIN_COLOR
                    }}
                  >
                    Clear
                  </button>
                )}
              </div>
              {form.media && (
                <p className="text-xs text-gray-500 mt-2">
                  Selected: {form.media.name} ({(form.media.size / 1024).toFixed(1)} KB)
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full px-6 py-3 rounded-lg text-white font-medium transition disabled:opacity-60 disabled:cursor-not-allowed"
              style={{ backgroundColor: MAIN_COLOR }}
              onMouseEnter={(e) => !loading && (e.currentTarget.style.opacity = "0.9")}
              onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
            >
              {loading
                ? "Saving..."
                : editingFeed
                ? "Update News Feed"
                : "Create News Feed"}
            </button>
          </form>
        </motion.div>
      )}

      {/* News Feeds List */}
      {newsFeeds.length === 0 ? (
        <div className="glass-card rounded-2xl p-12 text-center">
          <p className="text-gray-500">No news feeds found</p>
        </div>
      ) : (
        <div className="space-y-4">
          {newsFeeds.map((feed, index) => (
            <motion.div
              key={feed.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="glass-card rounded-2xl p-6"
            >
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4">
                <div className="flex-1">
                  <h3 className="text-xl font-semibold mb-2" style={{ color: MAIN_COLOR }}>
                    {feed.title}
                  </h3>
                  {feed.tagline && (
                    <p className="text-sm text-gray-600 mb-3 italic">{feed.tagline}</p>
                  )}
                  <p className="text-gray-700 whitespace-pre-wrap mb-4">
                    {feed.description}
                  </p>
                  {feed.mediaUrl && (
                    <div className="mt-4 rounded-xl overflow-hidden">
                      <img
                        src={feed.mediaUrl}
                        alt={feed.title}
                        className="w-full max-h-96 object-cover"
                      />
                    </div>
                  )}
                  <p className="text-sm text-gray-500 mt-4">
                    Created by: {feed.createdBy.name} •{" "}
                    {new Date(feed.createdAt).toLocaleDateString()}
                  </p>
                </div>
                {session?.user?.id === feed.createdBy.id && (
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEdit(feed)}
                      className="px-4 py-2 rounded-lg text-sm font-medium transition text-white"
                      style={{ backgroundColor: MAIN_COLOR + "CC" }}
                      onMouseEnter={(e) => (e.currentTarget.style.opacity = "1")}
                      onMouseLeave={(e) => (e.currentTarget.style.opacity = "0.8")}
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(feed.id)}
                      className="px-4 py-2 rounded-lg text-sm font-medium transition bg-red-500 text-white hover:bg-red-600"
                    >
                      Delete
                    </button>
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
