"use client"

import { useState } from "react";
import { FiSearch, FiBookmark, FiMessageCircle, FiHeart, FiRepeat } from "react-icons/fi";
import LeftBar from "../leftbar/page";
import RightBar from "../rightbar/page";


const bookmarksData = [
  {
    id: 1,
    username: "Emily008",
    time: "8 hours ago",
    location: "Eldoret, Kenya",
    category: "Intervention",
    content:
      "Finance Bill 2025 is a work of the devil. The 2024 one looks like a saint. We are in for trouble. These guys have no idea how to manage a country. We need to abolish these yearly financial bills. They are chaotic for nothing.",
    profileImg: "/general/emily.png",
  },
];

export default function Bookmarks() {
  const [search, setSearch] = useState("");

  return (
    <div className="flex min-h-screen bg-black text-white">
      {/* Left Sidebar */}
      <LeftBar />

      {/* Main Content */}
      <main className="flex-1 p-6">
        <h1 className="text-xl font-bold mb-4">Bookmarks</h1>

        {/* Search Bar */}
        <div className="relative mb-4">
          <FiSearch className="absolute left-3 top-3 text-gray-400" />
          <input
            type="text"
            placeholder="Search Bookmarks"
            className="w-full bg-gray-900 text-white pl-10 pr-4 py-2 rounded-lg focus:outline-none"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {/* Bookmarks List */}
        <div className="space-y-6">
          {bookmarksData.map((bookmark) => (
            <div key={bookmark.id} className="p-4 bg-gray-900 rounded-lg">
              <div className="flex items-center space-x-4">
                <img src={bookmark.profileImg} alt={bookmark.username} className="w-10 h-10 rounded-full" />
                <div>
                  <p className="font-semibold">
                    {bookmark.username} <span className="text-gray-400 text-sm">{bookmark.time} - {bookmark.location}</span>
                  </p>
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
      <RightBar />
    </div>
  );
}
