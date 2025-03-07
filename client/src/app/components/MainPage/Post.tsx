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
  post: Record;
  type?: "status" | "comment";
  user: User;
}

const Post = ({ post, type = "status", user }: PostProps) => {
  const [showActions, setShowActions] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editedDescription, setEditedDescription] = useState(post.description);
  const [editedMedia, setEditedMedia] = useState<File | null>(null);
  const [editedPreviewURL, setEditedPreviewURL] = useState<string>(post.image_url || post.video_url || "");
  const [editedLocation, setEditedLocation] = useState<{ lat: number; lng: number } | null>(
    post.latitude && post.longitude ? { lat: post.latitude, lng: post.longitude } : null
  );
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const handleInfoClick = () => {
    setShowActions(true);
  };

  const handleEditedMediaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setEditedMedia(e.target.files[0]);
    }
  };

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
            setEditedPreviewURL(data.image_url);
          }
        } else if (editedMedia.type.startsWith("video/")) {
          const response = await fetch("https://repotor.onrender.com/video_upload", {
            method: "POST",
            body: formData,
          });
          if (response.ok) {
            const data = await response.json();
            setEditedPreviewURL(data.video_url);
          }
        }
      } catch (err) {
        console.error("Error uploading edited media:", err);
      }
    };

    uploadEditedMedia();
  }, [editedMedia]);

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

  const saveEdits = () => {
    const payload: any = {
      description: editedDescription,
    };

    if (editedMedia) {
      if (editedMedia.type.includes("image")) {
        payload.image_url = editedPreviewURL;
      } else if (editedMedia.type.startsWith("video/")) {
        payload.video_url = editedPreviewURL;
      }
    }

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
        setIsEditing(false);
      })
      .catch((err) => console.error(err));
  };

  const router = useRouter();

  const openModal = (imageUrl: string) => {
    setSelectedImage(imageUrl);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedImage(null);
  };

  return (
    <div className="p-4 border-y-[1px] border-borderGray">
      {/* POST TYPE */}
      <div className="flex items-center gap-2 text-sm text-textGray mb-2 from-bold"></div>

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
                  <span>{post.type === "red-flag" ? <FiFlag style={{ color: 'red', fontSize: '9px' }} /> : <FiFlag style={{ color: 'green', fontSize: '9px' }} />}</span>
                </div>
              </div>
            </Link>
            {post.user.id === user.id && !post.status ? (
              <button
                onClick={() => setIsEditing(!isEditing)}
                className="text-sm text-primaryColor"
              >
                {isEditing ? "Cancel" : "Edit"}
              </button>
            ) : null}
          </div>

          {/* Edit Post Description */}
          {isEditing ? (
            <textarea
              value={editedDescription}
              onChange={(e) => setEditedDescription(e.target.value)}
              className="p-2 border rounded-md"
            />
          ) : (
            <p>{post.description}</p>
          )}

          {/* Image with modal click */}
          {isEditing ? (
            <input type="file" accept="image/*,video/*" onChange={handleEditedMediaChange} />
          ) : (
            post.image_url && (
              <div className="mt-2">
                <Image
                  src={post.image_url}
                  alt="Post Media"
                  width={600}
                  height={600}
                  className="rounded-lg cursor-pointer"
                  onClick={() => post.image_url && openModal(post.image_url)}
                />
              </div>
            )
          )}

          {/* POST INTERACTIONS */}
          <PostInteractions post={post} user={user} />

          {/* Save Edited Post */}
          {isEditing && (
            <button
              onClick={saveEdits}
              className="mt-4 p-2 bg-blue-500 text-white rounded-lg"
            >
              Save
            </button>
          )}
        </div>
      </div>

      {/* Modal for Image */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex justify-center items-center z-50" onClick={closeModal}>
          <div className="relative w-full max-w-3xl p-4">
            <Image
              src={selectedImage || ""}
              alt="Popup Image"
              width={1200}
              height={1200}
              className="rounded-lg"
            />
            <button
              className="absolute top-4 right-4 text-white text-3xl"
              onClick={closeModal}
            >
              ×
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Post;
