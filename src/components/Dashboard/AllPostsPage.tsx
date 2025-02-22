"use client"
import React, { useState } from "react";

// Sample posts data
const samplePosts = [
  { id: 1, title: "Post 1", description: "Description of Post 1", category: "Redflag", date: "2025-02-21" },
  { id: 2, title: "Post 2", description: "Description of Post 2", category: "Intervention", date: "2025-02-19" },
  { id: 3, title: "Post 3", description: "Description of Post 3", category: "Redflag", date: "2025-02-17" },
  { id: 4, title: "Post 4", description: "Description of Post 4", category: "Intervention", date: "2025-02-15" },
  { id: 5, title: "Post 5", description: "Description of Post 5", category: "Redflag", date: "2025-02-13" },
];

const AllPostsPage = () => {
  const [selectedCategory, setSelectedCategory] = useState<"Redflag" | "Intervention">("Redflag");

  // Filter posts based on the selected category
  const filteredPosts = samplePosts.filter(post => post.category === selectedCategory);

  return (
    <div className="p-6">
      {/* Tabs for toggling between Redflag and Intervention */}
      <div className="flex mb-6">
        <button
          className={`text-lg font-semibold px-4 py-2 rounded-md ${selectedCategory === "Redflag" ? "bg-gray-800 text-white" : "bg-gray-600 text-gray-200"}`}
          onClick={() => setSelectedCategory("Redflag")}
        >
          Redflag Posts
        </button>
        <button
          className={`text-lg font-semibold px-4 py-2 rounded-md ml-4 ${selectedCategory === "Intervention" ? "bg-gray-800 text-white" : "bg-gray-600 text-gray-200"}`}
          onClick={() => setSelectedCategory("Intervention")}
        >
          Intervention Posts
        </button>
      </div>

      {/* Display filtered posts */}
      <div className="space-y-4">
        {filteredPosts.length === 0 ? (
          <p className="text-gray-400">No posts found in the selected category.</p>
        ) : (
          filteredPosts.map((post) => (
            <div key={post.id} className="bg-gray-800 rounded-lg shadow-sm p-6">
              <h3 className="text-xl font-medium text-white">{post.title}</h3>
              <p className="text-sm text-gray-400 mt-2">{post.description}</p>
              <p className="text-xs text-gray-500 mt-2">Posted on: {post.date}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default AllPostsPage;
