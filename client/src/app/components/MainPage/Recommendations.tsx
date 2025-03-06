'use client';
import Link from "next/link";
import Image from "next/image";
import { User, Follow } from "../types";
import { useState } from "react";

interface RecommendationsProps {
  recommendations: User[];
  user: User;
}

const Recommendations: React.FC<RecommendationsProps> = ({ recommendations, user }) => {
  // Initialize local following state with the current user's following array
  const [localFollowing, setLocalFollowing] = useState<Follow[]>(user.following);

  const handleFollow = (recommendation: User) => {
    fetch(`http://localhost:5000/follow_user/${recommendation.id}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ user_id: user.id }),
    })
      .then((r) => {
        if (!r.ok) {
          throw new Error("Failed to follow user");
        }
        return r.json();
      })
      .then((data: Follow) => {
        // Use the response data to update the local following state
        setLocalFollowing((prev) => [...prev, data]);
        alert(`You are now following @${recommendation.username}!`);
      })
      .catch((err) => console.error(err));
  };

  const handleUnfollow = (recommendation: User) => {
    fetch(`http://localhost:5000/unfollow_user/${recommendation.id}`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ user_id: user.id }),
    })
      .then((r) => {
        if (!r.ok) {
          throw new Error("Failed to unfollow user");
        }
        return r.json();
      })
      .then(() => {
        // Remove the follow relationship from the local following state
        setLocalFollowing((prev) =>
          prev.filter((follow) => follow.followed_id !== recommendation.id)
        );
        alert(`You have unfollowed @${recommendation.username}!`);
      })
      .catch((err) => console.error(err));
  };

  return (
    <div className="p-4 rounded-2xl border-[1px] border-borderGray flex flex-col gap-4">
      {recommendations.map((recommendation) => {
        // Determine follow status based on local following state
        const isFollowed = localFollowing.some(
          (follow: Follow) => follow.followed_id === recommendation.id
        );
        return (
          <div key={recommendation.id} className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="relative rounded-full overflow-hidden w-10 h-10">
                <Image
                  src={recommendation.profile_picture || "/icons/user.png"}
                  alt={recommendation.username}
                  width={40}
                  height={40}
                />
              </div>
              <div>
                <h1 className="text-md font-bold">{recommendation.username}</h1>
                <span className="text-textGray text-sm">@{recommendation.username}</span>
              </div>
            </div>
            {isFollowed ? (
              <button
                className="py-1 px-4 font-semibold bg-gray-300 text-black rounded-full"
                onClick={() => handleUnfollow(recommendation)}
              >
                Unfollow
              </button>
            ) : (
              <button
                className="py-1 px-4 font-semibold bg-[#FB6535] text-black rounded-full"
                onClick={() => handleFollow(recommendation)}
              >
                Follow
              </button>
            )}
          </div>
        );
      })}
      <Link href="/" className="text-[#FB6535]">
        Show More
      </Link>
    </div>
  );
};

export default Recommendations;
