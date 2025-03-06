'use client';
import Feed from "@/app/components/MainPage/Feed";
import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import { Follow, User } from "../components/types";
import LeftBar from "../components/MainPage/LeftBar";
import RightBar from "../components/MainPage/RightBar";
import { Record } from "../components/types";
import Recommendations from "../components/MainPage/Recommendations";
import { useSearchParams } from "next/navigation"; 

const UserPage = () => {
  const [coverImage, setCoverImage] = useState("/icons/user.png");
  const [avatarImage, setAvatarImage] = useState("/icons/user.png");
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [recommendations, setRecommendations] = useState<User[]>([]);
  // Define activeTab state with possible values: "posts", "liked", "bookmarks", "following"
  const [activeTab, setActiveTab] = useState<"posts" | "liked" | "bookmarks" | "following">("posts");
  const [posts, setPosts] = useState<Record[]>([]);
  const [followedUsers, setFollowedUsers] = useState<User[]>([])

  const searchParams = useSearchParams();

  useEffect(() => {
    // Auto-login: fetch the session data from your backend
    const fetchUserData = async () => {
      try {
        const response = await fetch("https://repotor.onrender.com/check_session", {
          method: "GET",
          credentials: "include",
        });
        if (response.ok) {
          const userData = await response.json();
          setUser(userData);
        } else {
          console.error("Failed to fetch user data");
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  useEffect(() => {
    if (!user) return;
    fetch("https://repotor.onrender.com/users")
      .then((r) => r.json())
      .then((allUsers) => {
        if (Array.isArray(allUsers)) {
          // Set recommendations: filter out current user and admin users
          const recommendationsList = allUsers.filter(
            (u: User) => u.id !== user.id && !u.is_admin
          );
          const shuffled = recommendationsList.sort(() => Math.random() - 0.5);
          const selectedRecommendations = shuffled.slice(0, 3);
          setRecommendations(selectedRecommendations);
          console.log("Recommendations:", selectedRecommendations);

          // Set followed users: filter those users that are being followed by the logged-in user
          // (Assuming user.following is an array of Follow objects with a followed_id field)
          const followed = allUsers.filter((u: User) =>
            user.following.some((follow: Follow) => follow.followed_id === u.id)
          );
          setFollowedUsers(followed);
          console.log("Followed Users:", followed);
        } else {
          setRecommendations([]);
          setFollowedUsers([]);
        }
      })
      .catch((err) => console.log(err));
  }, [user]);


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

  useEffect(() => {
    const tab = searchParams.get("tab");
    if (tab && ["posts", "liked", "bookmarks", "following"].includes(tab)) {
      setActiveTab(tab as "posts" | "liked" | "bookmarks" | "following");
    }
  }, [searchParams]);

  if (loading || !user) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <Image src={"/R 1.svg"} alt="logo" width={200} height={200} />
        <p>Loading...</p>
      </div>
    );
  }

  const filteredPosts =
    activeTab === "posts"
      ? posts.filter((post) => post.user.id === user.id)
      : activeTab === "liked" ? posts.filter((post) => post.likes.some((like) => like.user_id === user.id))
        : activeTab === "bookmarks" ? posts.filter((post) => user.bookmarks.some(bookmark => bookmark.record_id === post.id))
          : posts;


  return (
    <div className="min-h-screen flex justify-center">
      {/* Left Sidebar */}
      <div className="hidden lg:block w-64 px-4 border-r border-gray-300">
        <LeftBar user={user} />
      </div>

      {/* Main Content with fixed width */}
      <div className="w-[600px] border-x border-gray-300">
        {/* Profile Header */}
        <div className="flex items-center gap-8 sticky top-0 p-4 z-10 bg-white">
          <Link href="/">
            <Image src="/icons/back.svg" alt="back" width={24} height={24} />
          </Link>
          <h1 className="font-bold text-lg">{user.username}</h1>
        </div>

        {/* Cover and Avatar Section */}
        <div>
          <div className="relative w-full">
            {/* Cover */}
            <div className="w-full relative">
              <Image
                className="w-full h-80 object-cover"
                src={coverImage}
                alt="Cover Image"
                width={600}
                height={200}
              />
            </div>
            {/* Avatar */}
            <div className="rounded-full overflow-hidden border-4 border-white bg-gray-300 absolute left-4 -bottom-12">
              <Image
                src={avatarImage}
                alt="Avatar"
                width={100}
                height={100}
                className="object-cover"
              />
            </div>
          </div>

          {/* User Info */}
          <div className="mt-16 p-4">
            <div>
              <h1 className="text-2xl font-bold">{user.username}</h1>
              <span className="text-sm">@{user.username}</span>
            </div>

            <div className="flex gap-4 text-sm">

              <div className="flex items-center gap-2">
                <Image src="/icons/date.svg" alt="date" width={20} height={20} />
                <span>
                  Joined {new Date(user.created_at).toLocaleDateString()}
                </span>
              </div>
            </div>
            <div className="flex gap-4 mt-2">
              <div className="flex items-center gap-2">
                <span className="font-bold">{user?.followers.length}</span>
                <span className="text-sm">Followers</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-bold">{user?.following.length}</span>
                <span className="text-sm">Following</span>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs Section */}
        <div className="px-4">
          <div className="flex border-b border-gray-300">
            <button
              type="button"
              className={`py-2 px-4 font-bold ${activeTab === "posts" ? "border-b-2 border-[#FB6535]" : ""
                }`}
              onClick={() => setActiveTab("posts")}
            >
              Posts
            </button>
            <button
              type="button"
              className={`py-2 px-4 font-bold ${activeTab === "liked" ? "border-b-2 border-[#FB6535]" : ""
                }`}
              onClick={() => setActiveTab("liked")}
            >
              Liked
            </button>
            <button
              type="button"
              className={`py-2 px-4 font-bold ${activeTab === "bookmarks" ? "border-b-2 border-[#FB6535]" : ""
                }`}
              onClick={() => setActiveTab("bookmarks")}
            >
              Bookmarks
            </button>
            <button
              type="button"
              className={`py-2 px-4 font-bold ${activeTab === "following" ? "border-b-2 border-[#FB6535]" : ""
                }`}
              onClick={() => setActiveTab("following")}
            >
              Following
            </button>
          </div>
        </div>

        {/* Content Section */}
        <div className="px-4 pt-4">
          {activeTab === "posts" && (
            // Render user's posts; replace [] with actual posts data when available
            <Feed posts={filteredPosts} user={user} />
          )}
          {activeTab === "liked" && (
            <div>
              <Feed posts={filteredPosts} user={user} />
            </div>
          )}
          {activeTab === "bookmarks" && (
            <div>
              <Feed posts={filteredPosts} user={user} />
            </div>
          )}
          {activeTab === "following" && (
            <div>
              <Recommendations recommendations={followedUsers} user={user} />
            </div>
          )}
        </div>
      </div>

      {/* Right Sidebar */}
      <div className="hidden xl:block w-64 px-4 border-l border-gray-300">
        <RightBar recommendations={recommendations} user={user} />
      </div>
    </div>
  );
};

export default UserPage;
