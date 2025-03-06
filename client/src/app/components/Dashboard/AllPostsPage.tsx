"use client";
import React, { useState } from "react";
import { Record } from "../types";

const AllPostsPage = ({ posts }: { posts:Record[] }) => {
  const [selectedCategory, setSelectedCategory] = useState<"red-flag" | "intervention">("red-flag");
  const [selectedImage, setSelectedImage] = useState<string | null>(null); // State for selected image
  
  // Filter posts based on the selected category
  const filteredPosts = posts.filter((post) => post.type === selectedCategory);

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
          className={`text-lg font-semibold px-4 py-2 rounded-md ${selectedCategory === "red-flag" ? "bg-gray-800 text-white" : "bg-gray-600 text-gray-200"}`}
          onClick={() => setSelectedCategory("red-flag")}
        >
          Redflag Posts
        </button>
        <button
          className={`text-lg font-semibold px-4 py-2 rounded-md ml-4 ${selectedCategory === "intervention" ? "bg-gray-800 text-white" : "bg-gray-600 text-gray-200"}`}
          onClick={() => setSelectedCategory("intervention")}
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
              <h3 className="text-xl font-medium text-white">{post.user.username}</h3>
              <p className="text-sm text-gray-400 mt-2">{post.description}</p>
              <p className="text-xs text-gray-500 mt-2">Posted on: {post.created_at && new Date(post.created_at).toLocaleString()}</p>

              {/* Display image if available */}
              {post.image_url && (
                <div
                  className="mt-4 cursor-pointer w-full h-48 bg-gray-700 rounded-md overflow-hidden"
                  onClick={() => handleImageClick(post.image_url!)}
                >
                  <img
                    src={post.image_url}
                    alt="Post Image"
                    className="w-full h-full object-cover"
                  />
                </div>
              )}

              {/* Action buttons */}
              <div className="mt-4 flex flex-wrap gap-4 justify-between">
                <button
                  onClick={(e) => {
                    fetch(`http://localhost:5000/record/${post.id}`, {
                      method: "PATCH",
                      headers: {"Content-Type": "application/json"},
                      body: JSON.stringify({status: "under investigation"})
                    })
                    .then((r) => {
                      if (r.ok) {
                        alert("Set to Under Investigation.")
                        
                        fetch(`http://localhost:5000/post_status`, {
                          method: "POST",
                          headers: {"Content-Type": "application/json"},
                          body: JSON.stringify({"post_id": post.id})
                        })
                          .then(r => {
                            if (r.ok) {
                              alert("Update email sent!")
                            }
                          })
                          .catch((err) => console.error(err))
                      }
                    })
                    .catch((err) => console.error(err))
                  }}
                  className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm w-full sm:w-auto"
                >
                  Set to Under Investigation
                </button>
                <button
                  onClick={() => {
                    fetch(`http://localhost:5000/record/${post.id}`, {
                      method: "PATCH",
                      headers: {"Content-Type": "application/json"},
                      body: JSON.stringify({status: "rejected"})
                    })
                    .then((r) => {
                      if (r.ok) {
                        alert("Set to Rejected.")
                        fetch(`http://localhost:5000/post_status`, {
                          method: "POST",
                          headers: {"Content-Type": "application/json"},
                          body: JSON.stringify({"post_id": post.id})
                        })
                          .then(r => {
                            if (r.ok) {
                              alert("Update email sent!")
                            }
                          })
                      }
                    })
                    .catch((err) => console.error(err))
                  }}
                  className="bg-red-600 text-white px-4 py-2 rounded-md text-sm w-full sm:w-auto"
                >
                  Set to Rejected
                </button>
                <button
                  onClick={() => {
                    fetch(`http://localhost:5000/record/${post.id}`, {
                      method: "PATCH",
                      headers: {"Content-Type": "application/json"},
                      body: JSON.stringify({status: "resolved"})
                    })
                    .then((r) => {
                      if (r.ok) {
                        alert("Set to Resolved.")
                        fetch(`http://localhost:5000/post_status`, {
                          method: "POST",
                          headers: {"Content-Type": "application/json"},
                          body: JSON.stringify({"post_id": post.id})
                        })
                          .then(r => {
                            if (r.ok) {
                              alert("Update email sent!")
                            }
                          })
                      }
                    })
                    .catch((err) => console.error(err))
                  }}
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
