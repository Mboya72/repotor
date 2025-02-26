"use client";
import { useState } from 'react';
import { FiMessageCircle, FiRepeat, FiThumbsUp, FiBookmark, FiShare2 } from 'react-icons/fi';
import dynamic from 'next/dynamic';

// Dynamically import EmojiPicker only on the client-side
const EmojiPicker = dynamic(() => import('emoji-picker-react'), {
  ssr: false, // Disable server-side rendering for this component
});

const PostInteractions = () => {
  const [isMessagePopupVisible, setIsMessagePopupVisible] = useState(false);
  const [message, setMessage] = useState('');
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [imageFile, setImageFile] = useState(null);
  const [videoFile, setVideoFile] = useState(null);
  const [isShareOptionsVisible, setIsShareOptionsVisible] = useState(false);
  const [isLinkCopied, setIsLinkCopied] = useState(false);

  const handleMessageClick = () => {
    setIsMessagePopupVisible(true); // Show the popup
  };

  const handlePopupClose = () => {
    setIsMessagePopupVisible(false); // Close the popup
  };

  const handleSubmit = (e: { preventDefault: () => void; }) => {
    e.preventDefault();
    console.log("Message sent:", message);
    setMessage('');
    setImageFile(null);
    setVideoFile(null);
    handlePopupClose(); // Close the popup
  };

  const handleImageUpload = (e: { target: { files: any[]; }; }) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(URL.createObjectURL(file)); // Create a local URL for preview
    }
  };

  const handleVideoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setVideoFile(URL.createObjectURL(file)); // Create a local URL for preview
    }
  };

  const handleShareClick = () => {
    setIsShareOptionsVisible(!isShareOptionsVisible); // Toggle share options visibility
  };

  const handleCopyLink = () => {
    const currentUrl = window.location.href; // Get the current URL
    navigator.clipboard.writeText(currentUrl) // Copy it to clipboard
      .then(() => {
        setIsLinkCopied(true); // Set state to show "Link copied!" message
        setTimeout(() => setIsLinkCopied(false), 2000); // Hide the message after 2 seconds
      })
      .catch((error) => {
        console.error('Failed to copy the link: ', error);
      });
  };

  const handleEmojiClick = (emojiData: { emoji: string; }) => {
    setMessage((prevMessage) => prevMessage + emojiData.emoji); // Add selected emoji to the message
    setShowEmojiPicker(false); // Close emoji picker after selection
  };

  return (
    <div className="bg-gray-900 text-white">
      <div className="flex items-center justify-between gap-4 lg:gap-16 my-2 text-textGray">
        <div className="flex items-center justify-between flex-1">
          {/* COMMENTS */}
          <div className="flex items-center gap-2 cursor-pointer" onClick={handleMessageClick}>
            <FiMessageCircle
              size={20}
              className="text-textGray hover:text-blue-700 transition-colors duration-300"
            />
            <span className="text-sm hover:text-iconBlue">157</span>
          </div>
          {/* REPOST */}
          <div className="flex items-center gap-2 cursor-pointer">
            <FiRepeat
              size={20}
              className="text-textGray hover:text-green-600 transition-colors duration-300"
            />
            <span className="text-sm hover:text-iconGreen">157</span>
          </div>
          {/* LIKE */}
          <div className="flex items-center gap-2 cursor-pointer">
            <FiThumbsUp
              size={20}
              className="text-textGray hover:text-pink-600 transition-colors duration-300"
            />
            <span className="text-sm hover:text-iconPink">157</span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="cursor-pointer">
            <FiBookmark
              size={20}
              className="text-textGray hover:text-yellow-600 transition-colors duration-300"
            />
          </div>
          {/* SHARE ICON */}
          <div className="relative cursor-pointer" onClick={handleShareClick}>
            <FiShare2
              size={20}
              className="text-textGray hover:text-blue-600 transition-colors duration-300"
            />
            {isShareOptionsVisible && (
              <div className="absolute right-0 mt-2 bg-gray-800 p-2 rounded-md shadow-lg w-48">
                <button
                  onClick={handleCopyLink}
                  className="w-full text-white text-sm py-2 px-4 rounded-md hover:bg-gray-700 transition-colors"
                >
                  {isLinkCopied ? 'Link Copied!' : 'Copy Link'}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Message Popup */}
      {isMessagePopupVisible && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
          <div className="bg-black border border-orange-600 p-6 rounded-lg shadow-lg w-96">
            <h2 className="text-lg font-bold mb-4 text-white">Reply to Post</h2>
            <p className="text-sm text-gray-400 mb-4">Write your reply below:</p>
            <form onSubmit={handleSubmit}>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Type your reply..."
                className="w-full p-3 bg-gray-700 text-white border border-gray-600 rounded-md mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows="4"
              />
              {/* Image Upload */}
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="w-full p-3 bg-gray-700 text-white border border-gray-600 rounded-md mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {/* Video Upload */}
              <input
                type="file"
                accept="video/*"
                onChange={handleVideoUpload}
                className="w-full p-3 bg-gray-700 text-white border border-gray-600 rounded-md mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <div className="flex items-center gap-2 mb-4">
                <button
                  type="button"
                  onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                  className="bg-yellow-500 p-2 rounded-md"
                >
                  😀
                </button>
                {showEmojiPicker && (
                  <div className="absolute z-50">
                    <EmojiPicker onEmojiClick={handleEmojiClick} />
                  </div>
                )}
              </div>

              <div className="flex justify-between">
                <button
                  type="button"
                  onClick={handlePopupClose}
                  className="bg-orange-600 px-4 py-2 rounded-md text-white"
                >
                  Close
                </button>
                <button
                  type="submit"
                  className="bg-blue-600 text-white px-4 py-2 rounded-md"
                >
                  Send
                </button>
              </div>
            </form>

            {/* Display uploaded image if available */}
            {imageFile && (
              <div className="mt-4">
                <img src={imageFile} alt="Uploaded" className="w-full rounded-md" />
              </div>
            )}

            {/* Display uploaded video if available */}
            {videoFile && (
              <div className="mt-4">
                <video width="100%" controls>
                  <source src={videoFile} type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default PostInteractions;
