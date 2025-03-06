"use client";
import React, { useState } from "react";
import { Record } from "../types";


const RejectedPage = ({ posts }: { posts:Record[] }) => {
  const [rejectedPosts, setRedflagPosts] = useState(posts);
  const [selectedImage, setSelectedImage] = useState<string | null>(null); // State for selected image

  // Function to handle status change and send email
  // const handleStatusChange = (postId: number, newStatus: string, ownerEmail: string) => {
  //   // Update the post status
  //   const updatedPosts = redflagPosts.map((post) =>
  //     post.id === postId ? { ...post, status: newStatus } : post
  //   );
  //   setRedflagPosts(updatedPosts);

  //   // Simulate sending an email (in real scenario, you'd call an API here)
  //   sendEmail(ownerEmail, newStatus);
  // };

  // Simulate sending an email
  const sendEmail = (ownerEmail: string, status: string) => {
    console.log(`Sending email to ${ownerEmail}...`);
    console.log(`Subject: Post status updated to ${status}`);
    console.log(`Body: Your post status has been updated to ${status}.`);
    // Here you can replace the console log with an actual email API call
  };

  // // Filter posts that are rejected
  // const rejectedPosts = redflagPosts.filter((post) => post.status === "Rejected");

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
      <h2 className="text-2xl font-semibold text-white mb-4">Rejected Posts</h2>

      {/* Display the rejected posts */}
      {rejectedPosts.length === 0 ? (
        <p className="text-gray-400">No rejected posts found.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {rejectedPosts.map((post) => (
            <div
              key={post.id}
              className="bg-gray-800 rounded-lg shadow-sm p-6 flex flex-col h-full"
            >
              <h3 className="text-xl font-medium text-white">{post.user.username}</h3>
              <p className="text-sm text-gray-400 mt-2">{post.description}</p>
              <p className="text-xs text-gray-500 mt-2">Posted on: {post.created_at && new Date(post.created_at).toLocaleString()}</p>
              <p className="text-sm text-red-400 mt-2">Status: {post.status}</p>

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

              {/* Action buttons for changing status */}
              <div className="mt-4 flex flex-wrap gap-4 justify-between">
                <button
                  onClick={() => {
                    fetch(`https://repotor.onrender.com/record/${post.id}`, {
                      method: "PATCH",
                      headers: {"Content-Type": "application/json"},
                      body: JSON.stringify({status: "under investigation"})
                    })
                    .then((r) => {
                      if (r.ok) {
                        alert("Set to Under Investigation.")
                        fetch(`https://repotor.onrender.com/post_status`, {
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
                  className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm  flex items-center justify-center"
                >
                  Set to Under Investigation
                </button>
                <button
                  onClick={() => {
                    fetch(`https://repotor.onrender.com/record/${post.id}`, {
                      method: "PATCH",
                      headers: {"Content-Type": "application/json"},
                      body: JSON.stringify({status: "resolved"})
                    })
                    .then((r) => {
                      if (r.ok) {
                        alert("Set to Resolved.")
                        fetch(`https://repotor.onrender.com/post_status`, {
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
                  className="bg-green-600 text-white px-4 py-2 rounded-md text-sm  flex items-center justify-center"
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

export default RejectedPage;
