"use client";
import React, { useState } from "react";

// Sample posts data
const samplePosts = [
  { id: 1, title: "Post 1", description: "Description of Post 1", category: "Redflag", date: "2025-02-21", imageUrl: "https://via.placeholder.com/500" },
  { id: 2, title: "Post 2", description: "Description of Post 2", category: "Intervention", date: "2025-02-19", imageUrl: null },
  { id: 3, title: "Post 3", description: "Description of Post 3", category: "Redflag", date: "2025-02-17", imageUrl: "https://via.placeholder.com/500" },
  { id: 4, title: "Post 4", description: "Description of Post 4", category: "Intervention", date: "2025-02-15", imageUrl: "https://via.placeholder.com/500" },
  { id: 5, title: "Post 5", description: "Description of Post 5", category: "Redflag", date: "2025-02-13", imageUrl: "https://via.placeholder.com/500" },
];

const AllPostsPage = () => {
  const [selectedCategory, setSelectedCategory] = useState<"Redflag" | "Intervention">("Redflag");
  const [selectedImage, setSelectedImage] = useState<string | null>(null); // State for selected image

  // Filter posts based on the selected category
  const filteredPosts = samplePosts.filter((post) => post.category === selectedCategory);

  // Function to handle image click to open in popup
  const handleImageClick = (imageUrl: string) => {
    setSelectedImage(imageUrl);
  };

  // Function to close the image popup
  const closePopup = () => {
    setSelectedImage(null);
  };

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
      {filteredPosts.length === 0 ? (
        <p className="text-gray-400">No posts found in the selected category.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {filteredPosts.map((post) => (
            <div key={post.id} className="bg-gray-800 rounded-lg shadow-sm p-6 flex flex-col h-full">
              <h3 className="text-xl font-medium text-white">{post.title}</h3>
              <p className="text-sm text-gray-400 mt-2">{post.description}</p>
              <p className="text-xs text-gray-500 mt-2">Posted on: {post.date}</p>

              {/* Display image if available */}
              {post.imageUrl && (
                <div
                  className="mt-4 cursor-pointer w-full h-48 bg-gray-700 rounded-md overflow-hidden"
                  onClick={() => handleImageClick(post.imageUrl)}
                >
                  <img
                    src={post.imageUrl}
                    alt="Post Image"
                    className="w-full h-full object-cover"
                  />
                </div>
              )}

              {/* Action buttons */}
              <div className="mt-4 flex flex-wrap gap-4 justify-between">
                <button
                  onClick={() => alert("Set to Under Investigation")}
                  className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm w-full sm:w-auto"
                >
                  Set to Under Investigation
                </button>
                <button
                  onClick={() => alert("Set to Rejected")}
                  className="bg-red-600 text-white px-4 py-2 rounded-md text-sm w-full sm:w-auto"
                >
                  Set to Rejected
                </button>
                <button
                  onClick={() => alert("Set to Resolved")}
                  className="bg-green-600 text-white px-4 py-2 rounded-md text-sm w-full sm:w-auto"
                >
                  Set to Resolved
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Image Popup Modal */}
      {selectedImage && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex justify-center items-center z-50">
          <div className="relative">
            <button
              onClick={closePopup}
              className="absolute top-0 right-0 text-white text-2xl p-2"
            >
              ×
            </button>
            <img
              src={selectedImage}
              alt="Full view"
              className="max-w-full max-h-full object-contain"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default AllPostsPage;
