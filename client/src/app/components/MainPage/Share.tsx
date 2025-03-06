"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { User } from "../types";
import ImageEditor from "./ImageEditor";
import EmojiPicker from "emoji-picker-react"; // Import emoji picker
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api'; // Import Google Maps components

interface Props {
  user: User;
}

const Share: React.FC<Props> = ({ user }) => {
  const [media, setMedia] = useState<File | null>(null);
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [settings, setSettings] = useState<{
    type: "original" | "wide" | "square";
    sensitive: boolean;
  }>({
    type: "original",
    sensitive: false,
  });

  const [message, setMessage] = useState(""); // Add state for the message input
  const [showEmojiPicker, setShowEmojiPicker] = useState(false); // State for showing the emoji picker
  const [showLocationPicker, setShowLocationPicker] = useState(false); // State for location picker
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null); // State for location
  const [postType, setPostType] = useState<"red-flag" | "intervention">("red-flag"); // New state for post type
  const [previewURL, setPreviewURL] = useState<string>("")
  const [postDate, setPostDate] = useState<string>(""); // New state for post date
  const [postTime, setPostTime] = useState<string>(""); // New state for post time

  const handleMediaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setMedia(e.target.files[0]);
    }
  };


  const handleEmojiClick = (emojiData: any) => {
    setMessage((prevMessage) => prevMessage + emojiData.emoji); // Add selected emoji to the message
    setShowEmojiPicker(false); // Close emoji picker after selection
  };

  const handleLocationClick = () => {
    setShowLocationPicker(true); // Open location picker
  };

  const handleMapClick = (event: any) => {
    const lat = event.latLng.lat();
    const lng = event.latLng.lng();
    setLocation({ lat, lng });
    setShowLocationPicker(false); // Close location picker after selection
  };

  useEffect(() => {
    const currentDate = new Date();
    setPostDate(currentDate.toLocaleDateString()); // Automatically set date
    setPostTime(currentDate.toLocaleTimeString()); // Automatically set time
  }, []); // Runs once when the component is mounted

  useEffect(() => {
    const uploadMedia = async () => {
      if (!media) return;

      const formData = new FormData();
      formData.append("file", media); // Append the media file

      try {
        if (media.type.includes("image")) {
          const response = await fetch("https://repotor.onrender.com/image_upload", {
            method: "POST",
            body: formData,
          });

          if (response.ok) {
            const data = await response.json();
            console.log("Image upload response:", data);
            setPreviewURL(data.image_url); // Set image URL
          } else {
            console.error("Error uploading image");
          }
        } else if (media.type.startsWith("video/")) {
          const response = await fetch("https://repotor.onrender.com/video_upload", {
            method: "POST",
            body: formData,
          });

          if (response.ok) {
            const data = await response.json();
            console.log("Video upload response:", data);
            setPreviewURL(data.video_url); // Set video URL
          } else {
            console.error("Error uploading video");
          }
        }
      } catch (err) {
        console.error("Error uploading media:", err);
      }
    };

    uploadMedia();
  }, [media]); // Re-run when `media` changes

  const handlePost = () => {

    const payload: any = {
      type: postType,
      description: message,
      user_id: user?.id,
      latitude: location?.lat,
      longitude: location?.lng,
    };

    // If a media file is selected, only include the appropriate URL
    if (media) {
      if (media.type.includes("image")) {
        payload.image_url = previewURL;
        payload.video_url = null;
      } else if (media.type.includes("video")) {
        payload.video_url = previewURL;
        payload.image_url = null;
      }
    } else {
      // No media selected
      payload.image_url = null;
      payload.video_url = null;
    }


    fetch("https://repotor.onrender.com/records", {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),

    })
      .then((r) => r.json())
      .then((data) => {
        console.log("Post response:", data)
        setMessage("");
        setMedia(null);
        setPreviewURL("");
        window.location.reload();
      })
      .catch((err) => {
        if (err.name === 'AbortError') {
          console.log("Fetch request was cancelled");
        } else {
          console.error("Error in post request:", err);
        }
      });

  };

  return (
    <form className="p-4 flex gap-4 flex-wrap">
      {/* AVATAR */}
      <div className="relative w-10 h-10 rounded-full overflow-hidden">
        <Image
          src={user?.profile_picture || "/icons/user.png"}
          alt="Avatar"
          width={100}
          height={100}
          className="rounded-full"
          priority
        />
      </div>
      {/* OTHERS */}
      <div className="flex-1 flex flex-col gap-4">
        <input
          type="text"
          name="desc"
          value={message} // Bind message state to the input field
          onChange={(e) => setMessage(e.target.value)} // Update message state when typing
          placeholder="What is happening?!"
          className="bg-transparent outline-none placeholder:text-textGray text-xl"
        />
        {/* PREVIEW IMAGE */}
        {media?.type.includes("image") && previewURL && (
          <div className="relative rounded-xl overflow-hidden">
            <Image
              src={previewURL} // Using the `src` prop for the dynamic URL
              alt=""
              width={600}
              height={600}
              className={`w-full ${settings.type === "original"
                ? "h-full object-contain"
                : settings.type === "square"
                  ? "aspect-square object-cover"
                  : "aspect-video object-cover"
                }`}
            />
            <div
              className="absolute top-2 left-2 bg-black bg-opacity-50 text-white py-1 px-4 rounded-full font-bold text-sm cursor-pointer"
              onClick={() => setIsEditorOpen(true)}
            >
              Edit
            </div>
            <div
              className="absolute top-2 right-2 bg-black bg-opacity-50 text-white h-8 w-8 flex items-center justify-center rounded-full cursor-pointer font-bold text-sm"
              onClick={() => setMedia(null)}
            >
              X
            </div>
          </div>
        )}
        {/* PREVIEW VIDEO */}
        {media?.type.startsWith("video/") && previewURL && (
          <div className="relative">
            <video src={previewURL} controls />
            <div
              className="absolute top-2 right-2 bg-black bg-opacity-50 text-white h-8 w-8 flex items-center justify-center rounded-full cursor-pointer font-bold text-sm"
              onClick={() => setMedia(null)}
            >
              X
            </div>
          </div>
        )}
        {/* PREVIEW GIF */}
        {media?.type.includes("gif") && previewURL && (
          <div className="relative">
            <img
              src={previewURL}
              alt="GIF Preview"
              className={`w-full ${settings.type === "original"
                ? "h-full object-contain"
                : settings.type === "square"
                  ? "aspect-square object-cover"
                  : "aspect-video object-cover"
                }`}
            />
            <div
              className="absolute top-2 right-2 bg-black bg-opacity-50 text-white h-8 w-8 flex items-center justify-center rounded-full cursor-pointer font-bold text-sm"
              onClick={() => setMedia(null)}
            >
              X
            </div>
          </div>
        )}
        {isEditorOpen && previewURL && (
          <ImageEditor
            onClose={() => setIsEditorOpen(false)}
            previewURL={previewURL}
            settings={settings}
            setSettings={setSettings}
          />
        )}
        <div className="flex gap-4 flex-wrap items-center justify-between">
          <div className="flex gap-4 items-center">
            {/* File input */}
            <input
              type="file"
              name="file"
              onChange={handleMediaChange}
              className="hidden"
              id="file"
              accept="image/*,video/*,image/gif" // Accept gif files
            />
            <label htmlFor="file" className="cursor-pointer">
              <Image
                src="/icons/image.svg"
                alt="Image Icon"
                width={20}
                height={20}
                className="fill-[#FB6535]"
              />
            </label>
            {/* GIF button */}
            <label htmlFor="file" className="cursor-pointer">
              <Image
                src="/icons/gif.svg"
                alt="GIF Icon"
                width={20}
                height={20}
              />
            </label>
            {/* Emoji button */}
            <div
              className="cursor-pointer"
              onClick={() => setShowEmojiPicker(!showEmojiPicker)}
            >
              <Image
                src="/icons/emoji.svg"
                alt="Emoji Icon"
                width={20}
                height={20}
              />
            </div>
            {/* Location button */}
            <div
              className="cursor-pointer"
              onClick={handleLocationClick}
            >
              <Image
                src="/icons/location.svg"
                alt="Location Icon"
                width={20}
                height={20}
              />
            </div>
            {/* Schedule button */}
            <Image
              src="/icons/schedule.svg"
              alt="Schedule Icon"
              width={20}
              height={20}
            />
          </div>
          {/* Post Type Dropdown */}
          <div className="flex gap-4 items-center text-[#FB6535]">
            <label htmlFor="post-type" className="text-xl text-textGray">
              Post Type:
            </label>
            <select
              id="post-type"
              value={postType}
              onChange={(e) =>
                setPostType(e.target.value as "red-flag" | "intervention")
              }
              className="bg-transparent border border-[#FB6535] p-2 rounded-lg focus:border-[#FB6535]"
            >
              <option value="red-flag">Red Flag</option>
              <option value="intervention">Intervention</option>
            </select>
          </div>
        </div>
        {/* Emoji Picker */}
        {showEmojiPicker && (
          <div className="absolute top-16 left-0">
            <EmojiPicker onEmojiClick={handleEmojiClick} />
          </div>
        )}
        {/* Location Picker */}
        {showLocationPicker && (
          <div className="relative w-full h-80">
            <LoadScript googleMapsApiKey="AIzaSyDt-07h5Loqwro0Fc3aijCx1ujpAkEkwcc">
              <GoogleMap
                mapContainerStyle={{
                  width: "100%",
                  height: "100%",
                }}
                zoom={12}
                center={{
                  lat: 37.7749, // Default to San Francisco coordinates
                  lng: -122.4194,
                }}
                onClick={handleMapClick}
              >
                {location && (
                  <Marker position={location} />
                )}
              </GoogleMap>
            </LoadScript>
          </div>
        )}
        <div className="flex gap-4 justify-between">
          <div className="flex gap-4">
            {/* POST DATE AND TIME */}
            <div className="text-sm text-textGray">
              <p>Date: {postDate}</p>
              <p>Time: {postTime}</p>
            </div>
          </div>
          <button
            type="button"
            onClick={handlePost}
            className="bg-[#FB6535] text-white py-2 px-4 rounded-xl"
          >
            Post
          </button>
        </div>
      </div>
    </form>
  );
};

export default Share;
