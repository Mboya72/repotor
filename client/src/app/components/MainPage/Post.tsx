'use client';
import Image from "next/image";
import PostInfo from "./PostInfo";
import PostInteractions from "./PostInteractions";
import Video from "./Video";
import Link from "next/link";
import { Record, User } from "../types";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { FiFlag } from "react-icons/fi";

interface PostProps {
  post: Record;  // The Post component receives a single Record object as a prop
  type?: "status" | "comment";  // Added optional type for differentiating between status and comment
  user: User,
}



const Post = ({ post, type = "status", user }: PostProps) => {
  const [showActions, setShowActions] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editedDescription, setEditedDescription] = useState(post.description);
  // (4) State for editing media file (if user selects a new image/video)
  const [editedMedia, setEditedMedia] = useState<File | null>(null);
  // (5) State for the new media URL returned from Cloudinary
  const [editedPreviewURL, setEditedPreviewURL] = useState<string>("");
  // (6) State for edited location (if user updates location)
  const [editedLocation, setEditedLocation] = useState<{ lat: number; lng: number } | null>(
    post.latitude && post.longitude ? { lat: post.latitude, lng: post.longitude } : null
  );

  const handleInfoClick = () => {
    setShowActions(true);
  }

  // Handler for file input change in edit mode
  const handleEditedMediaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setEditedMedia(e.target.files[0]);
    }
  };

  // When a new media file is selected in edit mode, upload it to Cloudinary
  useEffect(() => {
    const uploadEditedMedia = async () => {
      if (!editedMedia) return;
      const formData = new FormData();
      formData.append("file", editedMedia);

      try {
        if (editedMedia.type.includes("image")) {
          const response = await fetch("https://repotor.onrender.com/image_upload", {
            method: "POST",
            body: formData,
          });
          if (response.ok) {
            const data = await response.json();
            console.log("Edited image upload response:", data);
            setEditedPreviewURL(data.image_url);
          } else {
            console.error("Error uploading edited image");
          }
        } else if (editedMedia.type.startsWith("video/")) {
          const response = await fetch("https://repotor.onrender.com/video_upload", {
            method: "POST",
            body: formData,
          });
          if (response.ok) {
            const data = await response.json();
            console.log("Edited video upload response:", data);
            setEditedPreviewURL(data.video_url);
          } else {
            console.error("Error uploading edited video");
          }
        }
      } catch (err) {
        console.error("Error uploading edited media:", err);
      }
    };

    uploadEditedMedia();
  }, [editedMedia]);


  // Handler for updating location in edit mode
  const handleEditedLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setEditedLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
        },
        (error) => {
          console.error("Error getting location", error);
        }
      );
    } else {
      console.log("Geolocation is not supported by this browser.");
    }
  };

  // Save edits: send PATCH request to update the post
  const saveEdits = () => {
    const payload: any = {
      description: editedDescription,
    };

    // If a new media file was uploaded, update the URL based on its type
    if (editedMedia) {
      if (editedMedia.type.includes("image")) {
        payload.image_url = editedPreviewURL;
        // Optionally, you could set video_url to null here
      } else if (editedMedia.type.startsWith("video/")) {
        payload.video_url = editedPreviewURL;
      }
    }

    // If the location was updated, include it
    if (editedLocation) {
      payload.latitude = editedLocation.lat;
      payload.longitude = editedLocation.lng;
    }

    fetch(`https://repotor.onrender.com/record/${post.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    })
      .then((r) => r.json())
      .then((data) => {
        console.log("Patch response:", data);
        setIsEditing(false);
      })
      .catch((err) => console.error(err));
  };

  const router = useRouter()

  return (
    <div className="p-4 border-y-[1px] border-borderGray">
      {/* POST TYPE */}
      <div className="flex items-center gap-2 text-sm text-textGray mb-2 from-bold">
        {/* Here you could display if the post was reposted, etc. */}
      </div>

      {/* POST CONTENT */}
      <div className={`flex gap-4 ${type === "status" ? "flex-col" : "flex-row"}`}>
        {/* AVATAR */}
        <div className={`${type === "status" ? "hidden" : "relative"} w-10 h-10 rounded-full overflow-hidden`}>
          <Image
            src={post.user?.profile_picture || "/icons/user.png"}
            alt={post.user?.username || "User"}
            width={40}
            height={40}
          />
        </div>

        {/* CONTENT */}
        <div className="flex-1 flex flex-col gap-2">
          {/* TOP */}
          <div className="w-full flex justify-between">
            <Link href={`/${post.user?.username}/status/${post.id}`} className="flex gap-4">
              <div className={`${type !== "status" ? "hidden" : "relative"} w-10 h-10 rounded-full overflow-hidden`}>
                <Image
                  src={post.user?.profile_picture || "/icons/user.png"}
                  alt="User Avatar"
                  width={100}
                  height={100}
                />
              </div>
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-md font-bold">{post.user?.username}</h1>
                <span className="text-textGray">@{post.user?.username}</span>
                <span className="text-textGray">
                  {post.created_at && new Date(post.created_at).toLocaleString()}
                </span>
                <div className="flex items-center gap-2">
                  <Image
                    src="/icons/userLocation.svg"
                    alt="location"
                    width={20}
                    height={20}
                  />
                  <span>
                    {post.latitude && post.longitude
                      ? `Lat: ${post.latitude}, Long: ${post.longitude}`
                      : "No location"}
                  </span>
                  <span>{post.type === "red-flag" ? <FiFlag style={{ color: 'red', fontSize: '2em' }} /> : <FiFlag style={{ color: 'green', fontSize: '2em' }} />}</span>
                </div>
              </div>
            </Link>
            {post.user.id === user.id && !post.status ? <PostInfo handleInfoClick={handleInfoClick} /> : null}
          </div>

          {showActions && (
            <div className="mt-4 flex flex-col gap-4 bg-gray-700 p-4 rounded-l-lg shadow-lg z-50">
              <button
                className="block mb-2 text-white"
                onClick={() => {
                  setIsEditing(true);
                  setShowActions(false);
                }}
              >
                Edit Post
              </button>
              <button
                className="block text-red-400"
                onClick={() => {
                  if (confirm("Are you sure you want to delete this post?")) {
                    // Call your delete API endpoint here
                    fetch(`https://repotor.onrender.com/record/${post.id}`, {
                      method: "DELETE",
                      credentials: "include",
                    })
                      .then((r) => {
                        if (r.ok) {
                          // Optionally trigger a re-fetch or navigate away
                          alert("Post deleted successfully");
                          if (type === "status") {
                            router.push('/')
                          }
                        } else {
                          alert("Failed to delete post");
                        }
                      })
                      .catch((err) => console.error(err));
                  }
                  setShowActions(false);
                }}
              >
                Delete Post
              </button>
              <button
                className="block mt-2 text-gray-300 text-sm"
                onClick={() => setShowActions(false)}
              >
                Cancel
              </button>
            </div>
          )}


          {isEditing ? (
            <>
              <textarea
                className="text-lg bg-transparent border border-gray-300 rounded p-2 text-black"
                value={editedDescription}
                onChange={(e) => setEditedDescription(e.target.value)}
              />
              {/* File input for updating media */}
              <div className="mt-2">
                <input
                  type="file"
                  onChange={handleEditedMediaChange}
                  className="border border-gray-400 p-2 rounded"
                  accept="image/*,video/*,image/gif"
                />
              </div>
              {/* Button to update location */}
              <button
                className="bg-blue-600 text-white px-4 py-2 rounded-md mt-2"
                onClick={handleEditedLocation}
                type="button"
              >
                Update Location
              </button>
              {editedLocation && (
                <div className="mt-1 text-sm text-gray-300">
                  <span>Lat: {editedLocation.lat}</span>,{" "}
                  <span>Long: {editedLocation.lng}</span>
                </div>
              )}
              <div className="flex gap-4 mt-2">
                <button
                  className="bg-green-600 text-white px-4 py-2 rounded-md"
                  onClick={saveEdits}
                  type="button"
                >
                  Save Edits
                </button>
                <button
                  className="bg-gray-600 text-white px-4 py-2 rounded-md"
                  onClick={() => {
                    setIsEditing(false);
                    setEditedDescription(post.description);
                    // Optionally, clear edited media and location:
                    setEditedMedia(null);
                    setEditedPreviewURL("");
                    setEditedLocation(
                      post.latitude && post.longitude
                        ? { lat: post.latitude, lng: post.longitude }
                        : null
                    );
                  }}
                  type="button"
                >
                  Cancel
                </button>
              </div>
            </>
          ) : (
            // Read-only mode (simply display the post description)
            <Link href={`/${post.user?.username}/status/${post.id}`}>
              <p className={`${type === "status" ? "text-lg" : "text-sm"}`}>
                {post.description}
              </p>
            </Link>
          )}

          {/* POST IMAGE */}
          {post.image_url && (
            <div className="mt-2">
              <Image
                src={post.image_url}
                alt="Post Media"
                width={600}
                height={600}
                className="rounded-lg"
              />
            </div>
          )}

          {/* POST VIDEO */}
          {/* {post.video_url && (
            <div className="mt-2">
              <Video path={post.video_url} />
            </div>
          )} */}

          {/* POST DATE */}
          {type === "status" && (
            <span className="text-textGray text-sm mt-2">
              {new Date(post.created_at).toLocaleString()}
            </span>
          )}

          {/* POST INTERACTIONS */}
          <PostInteractions post={post} user={user}/>
        </div>
      </div>
    </div>
  );
};

export default Post;
