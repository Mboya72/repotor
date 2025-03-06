"use client";
import React, { useState } from "react";
import { Record } from "../types";

// Sample redflag posts data with images
// const sampleRedflagPosts = [
//   {
//     id: 1,
//     title: "Post 1",
//     description: "Inappropriate content detected.",
//     status: "Under Investigation",
//     ownerEmail: "user1@example.com",
//     date: "2025-02-20",
//     imageUrl:
//       "https://img.freepik.com/premium-psd/club-dj-party-flyer-social-media-post_684788-2678.jpg?ga=GA1.1.135082535.1731343775&semt=ais_hybrid", // Sample image URL
//   },
//   {
//     id: 2,
//     title: "Post 2",
//     description: "Spam content identified.",
//     status: "Under Investigation",
//     ownerEmail: "user2@example.com",
//     date: "2025-02-18",
//     imageUrl: null, // No image for this post
//   },
//   {
//     id: 3,
//     title: "Post 3",
//     description: "Offensive language used.",
//     status: "Under Investigation",
//     ownerEmail: "user3@example.com",
//     date: "2025-02-17",
//     imageUrl:
//       "https://img.freepik.com/free-vector/new-year-s-eve-party-poster-ready-print_1361-1827.jpg?ga=GA1.1.135082535.1731343775&semt=ais_hybrid", // Sample image URL
//   },
//   {
//     id: 4,
//     title: "Post 4",
//     description: "Hate speech detected.",
//     status: "Under Investigation",
//     ownerEmail: "user4@example.com",
//     date: "2025-02-16",
//     imageUrl: "https://via.placeholder.com/500", // Sample image URL
//   },
//   {
//     id: 5,
//     title: "Post 5",
//     description: "Violent content reported.",
//     status: "Under Investigation",
//     ownerEmail: "user5@example.com",
//     date: "2025-02-15",
//     imageUrl: "https://via.placeholder.com/500", // Sample image URL
//   },
//   {
//     id: 6,
//     title: "Post 6",
//     description: "Discriminatory language used.",
//     status: "Under Investigation",
//     ownerEmail: "user6@example.com",
//     date: "2025-02-14",
//     imageUrl: null, // No image for this post
//   },
// ];

const RedflagsPage = ({ posts }: { posts:Record[] }) => {
  const [redflagPosts, setRedflagPosts] = useState(posts);
  const [selectedImage, setSelectedImage] = useState<string | null>(null); // State for selected image

  // Function to handle status change and send email
  const handleStatusChange = (postId: number, newStatus: string, ownerEmail: string) => {
    // Update the post status
    const updatedPosts = redflagPosts.map((post) =>
      post.id === postId ? { ...post, status: newStatus } : post
    );
    setRedflagPosts(updatedPosts);

    // Simulate sending an email (in real scenario, you'd call an API here)
    sendEmail(ownerEmail, newStatus);
  };

  // Simulate sending an email
  const sendEmail = (ownerEmail: string, status: string) => {
    console.log(`Sending email to ${ownerEmail}...`);
    console.log(`Subject: Post status updated to ${status}`);
    console.log(`Body: Your post status has been updated to ${status}.`);
    // Here you can replace the console log with an actual email API call
  };

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
      <h2 className="text-2xl font-semibold text-white mb-4">Redflag Posts</h2>

      {/* Display the redflag posts */}
      {redflagPosts.length === 0 ? (
        <p className="text-gray-400">No redflag posts found.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {redflagPosts.map((post) => (
            <div
              key={post.id}
              className="bg-gray-800 rounded-lg shadow-sm p-6 flex flex-col h-full"
            >
              <h3 className="text-xl font-medium text-white">{post.user.username}</h3>
              <p className="text-sm text-gray-400 mt-2">{post.description}</p>
              <p className="text-xs text-gray-500 mt-2">Posted on: {post.created_at && new Date(post.created_at).toLocaleString()}</p>
              <p className="text-sm text-yellow-400 mt-2">Status: {post.status}</p>

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
                  className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm w-full sm:w-auto"
                >
                  Set to Under Investigation
                </button>
                <button
                  onClick={() => {
                    fetch(`https://repotor.onrender.com/record/${post.id}`, {
                      method: "PATCH",
                      headers: {"Content-Type": "application/json"},
                      body: JSON.stringify({status: "rejected"})
                    })
                    .then((r) => {
                      if (r.ok) {
                        alert("Set to Rejected.")
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
                  className="bg-red-600 text-white px-4 py-2 rounded-md text-sm w-full sm:w-auto"
                >
                  Set to Rejected
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

export default RedflagsPage;
