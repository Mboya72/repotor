"use client";

import { useState } from "react";
import { Bookmark, BookmarkCheck, Trash2 } from "lucide-react";

interface Post {
  id: number;
  title: string;
  author: string;
}

// Sample posts data (this can come from an API)
const posts: Post[] = [
  { id: 1, title: "Understanding Next.js Middleware", author: "@dev_guru" },
  { id: 2, title: "10 Tips for Writing Clean Code", author: "@coder_tips" },
  { id: 3, title: "Why TypeScript is the Future", author: "@tech_savvy" },
];

export default function BookmarkPage() {
  const [bookmarks, setBookmarks] = useState<Post[]>([]);

  const toggleBookmark = (post: Post) => {
    if (bookmarks.some((b) => b.id === post.id)) {
      setBookmarks((prev) => prev.filter((b) => b.id !== post.id));
    } else {
      setBookmarks((prev) => [...prev, post]);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Posts</h1>

      {/* List of Posts */}
      <div className="space-y-4">
        {posts.map((post) => (
          <div
            key={post.id}
            className="flex justify-between items-center bg-gray-800 text-white p-4 rounded-lg shadow-md"
          >
            <div>
              <h2 className="text-lg font-semibold">{post.title}</h2>
              <p className="text-sm text-gray-400">By {post.author}</p>
            </div>
            <button
              onClick={() => toggleBookmark(post)}
              className="text-yellow-400 hover:text-yellow-300"
            >
              {bookmarks.some((b) => b.id === post.id) ? (
                <BookmarkCheck className="w-6 h-6" />
              ) : (
                <Bookmark className="w-6 h-6" />
              )}
            </button>
          </div>
        ))}
      </div>

      {/* Bookmarked Posts */}
      <h2 className="text-2xl font-bold mt-8">Bookmarked Posts</h2>
      {bookmarks.length === 0 ? (
        <p className="text-gray-500 mt-2">No bookmarks yet.</p>
      ) : (
        <div className="space-y-4 mt-4">
          {bookmarks.map((bookmark) => (
            <div
              key={bookmark.id}
              className="flex justify-between items-center bg-gray-700 text-white p-4 rounded-lg shadow-md"
            >
              <div>
                <h3 className="text-lg font-semibold">{bookmark.title}</h3>
                <p className="text-sm text-gray-400">By {bookmark.author}</p>
              </div>
              <button
                onClick={() => toggleBookmark(bookmark)}
                className="text-red-500 hover:text-red-400"
              >
                <Trash2 className="w-6 h-6" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
