'use client';
import Feed from "../MainPage/Feed";
import Share from "../MainPage/Share";
import Link from "next/link";
import { Follow, User } from "../types";
import { useEffect, useState } from "react";
import { Record } from "../types";
import RightBar from "../MainPage/RightBar";
import LeftBar from "../MainPage/LeftBar";

interface props {
  user: User;
}

const Homepage: React.FC<props> = ({ user }) => {
  const [posts, setPosts] = useState<Record[]>([]);
  const [recommendations, setRecommendations] = useState<User[]>([]);
  const [activeTab, setActiveTab] = useState<"forYou" | "following">("forYou");

  useEffect(() => {
    // Fetch posts from backend
    fetch("https://repotor.onrender.com/records")
      .then((r) => r.json())
      .then((records) => {
        if (Array.isArray(records)) {
          setPosts(records);
          console.log(records);
        } else {
          setPosts([]);
        }
      })
      .catch((err) => console.log(err));
  }, []);

  useEffect(() => console.log(user.following));
  useEffect(() => {
    if (!user || recommendations.length > 0) return; // Only run if user is loaded and recommendations are empty
    // Fetch recommendations from backend
    fetch("https://repotor.onrender.com/users")
      .then((r) => r.json())
      .then((allUsers) => {
        if (allUsers) {
          // Filter out the current user, admin users, and users already followed
          const filteredUsers = allUsers.filter((recommendation: User) => {
            if (recommendation.id === user.id || recommendation.is_admin) return false;
            // Exclude users already followed (assuming user.following is an array of Follow objects)
            if (
              user.following &&
              user.following.some((follow: Follow) => follow.followed_id === recommendation.id)
            ) {
              return false;
            }
            return true;
          });

          // Shuffle the filtered array and select the first 3 users
          const selectedUsers = filteredUsers.sort(() => Math.random() - 0.5).slice(0, 3);
          setRecommendations(selectedUsers);
          console.log(selectedUsers);
        }
      })
      .catch((err) => console.log(err));
  }, [user, recommendations.length]);

  // Filter posts based on active tab.
  // When "Following" is active, only show posts from users that the current user is following.
  const filteredPosts =
    activeTab === "following"
      ? posts.filter((post) =>
          user.following &&
          user.following.some((follow: Follow) => follow.followed_id === post.user.id)
        )
      : posts;

  return (
    <div className="max-w-screen-md lg:max-w-screen-lg xl:max-w-screen-xl xxl:max-w-screen-xxl mx-auto flex justify-between">
      <div className="px-2 xsm:px-4 xxl:px-8 ">
        <LeftBar user={user} />
      </div>
      <div className="flex-1 lg:min-w-[600px] border-x-[1px] border-borderGray ">
        <div>
          {/* Header Tabs */}
          <div className="px-4 pt-4 flex justify-between text-textGray font-bold border-b-[1px] border-borderGray">
            <button
              type="button"
              onClick={() => setActiveTab("forYou")}
              className={`pb-3 flex items-center border-b-4 ${
                activeTab === "forYou" ? "border-[#FB6535]" : "border-transparent"
              }`}
            >
              For you
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("following")}
              className={`pb-3 flex items-center ${
                activeTab === "following" ? "border-b-4 border-[#FB6535]" : ""
              }`}
            >
              Following
            </button>
          </div>
          <Share user={user} />
          {/* Pass the filtered posts to Feed */}
          <Feed posts={filteredPosts} user={user} />
        </div>
      </div>
      <div className="hidden lg:flex ml-4 md:ml-8 flex-1 ">
        <RightBar recommendations={recommendations} user={user} />
      </div>
    </div>
  );
};

export default Homepage;
