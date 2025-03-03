"use client"

import { useState } from "react";
import { FiSearch, FiBookmark, FiMessageCircle, FiHeart, FiRepeat } from "react-icons/fi";

const bookmarksData = [
  {
    id: 1,
    username: "Emily008",
    time: "8 hours ago",
    location: "Eldoret, Kenya",
    category: "Intervention",
    content:
      "Finance Bill 2025 is a work of the devil. The 2024 one looks like a saint. We are in for trouble. These guys have no idea how to manage a country. We need to abolish these yearly financial bills. They are chaotic for nothing.",
    profileImg: "https://randomuser.me/api/portraits/women/1.jpg",
  },
];

const recommendedUsers = [
  {
    id: 1,
    username: "Emily008",
    handle: "@Emily008",
    profileImg: "https://randomuser.me/api/portraits/women/1.jpg",
  },
  {
    id: 2,
    username: "Pato89",
    handle: "@Pato89",
    profileImg: "https://randomuser.me/api/portraits/men/2.jpg",
  },
];

export default function Bookmarks() {
  const [search, setSearch] = useState("");

  return (
    <div className="flex min-h-screen bg-black text-white">
      {/* Sidebar */}
      <aside className="w-1/5 p-5 border-r border-gray-800">
        <h1 className="text-3xl font-bold text-orange-500">R</h1>
        <nav className="mt-6 space-y-4">
          <a href="#" className="block text-gray-300 hover:text-white">🏠 Homepage</a>
          <a href="#" className="block text-gray-300 hover:text-white">🔍 Explore</a>
          <a href="#" className="block text-gray-300 hover:text-white">🔔 Notifications</a>
          <a href="#" className="block text-gray-300 hover:text-white">📩 Messages</a>
          <a href="#" className="block text-white font-bold">🔖 Bookmarks</a>
          <a href="#" className="block text-gray-300 hover:text-white">👤 Profile</a>
          <a href="#" className="block text-gray-300 hover:text-white">⚙️ More</a>
        </nav>
        <button className="mt-6 w-full bg-orange-500 text-white py-2 rounded-lg">Post</button>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6">
        {/* Search Bar */}
        <div className="relative">
          <FiSearch className="absolute left-3 top-3 text-gray-400" />
          <input
            type="text"
            placeholder="Search"
            className="w-full bg-gray-900 text-white pl-10 pr-4 py-2 rounded-lg focus:outline-none"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {/* Bookmarks List */}
        <div className="mt-6 space-y-6">
          {bookmarksData.map((bookmark) => (
            <div key={bookmark.id} className="p-4 bg-gray-900 rounded-lg">
              <div className="flex items-center space-x-4">
                <img src={bookmark.profileImg} alt={bookmark.username} className="w-10 h-10 rounded-full" />
                <div>
                  <p className="font-semibold">{bookmark.username} <span className="text-gray-400 text-sm">{bookmark.time} - {bookmark.location}</span></p>
                  <p className="text-green-400 text-sm">{bookmark.category}</p>
                </div>
              </div>
              <p className="mt-2 text-gray-300">{bookmark.content}</p>
              <div className="mt-3 flex space-x-4 text-gray-500">
                <FiMessageCircle className="hover:text-white cursor-pointer" />
                <FiRepeat className="hover:text-white cursor-pointer" />
                <FiHeart className="hover:text-white cursor-pointer" />
                <FiBookmark className="hover:text-white cursor-pointer" />
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* Right Sidebar */}
      <aside className="w-1/4 p-6">
        <div className="relative">
          <FiSearch className="absolute left-3 top-3 text-gray-400" />
          <input
            type="text"
            placeholder="Search"
            className="w-full bg-gray-900 text-white pl-10 pr-4 py-2 rounded-lg focus:outline-none"
          />
        </div>

        {/* Recommended Section */}
        <div className="mt-6 p-4 bg-gray-900 rounded-lg">
          <h3 className="text-lg font-semibold">Recommended</h3>
          {recommendedUsers.map((user) => (
            <div key={user.id} className="flex items-center justify-between mt-4">
              <div className="flex items-center space-x-3">
                <img src={user.profileImg} alt={user.username} className="w-10 h-10 rounded-full" />
                <div>
                  <p className="font-semibold">{user.username}</p>
                  <p className="text-gray-400 text-sm">{user.handle}</p>
                </div>
              </div>
              <button className="bg-orange-500 text-white px-4 py-1 rounded-lg">Follow</button>
            </div>
          ))}
        </div>
      </aside>
    </div>
  );
}
