'use client';
import Comments from "@/app/components/MainPage/Comments";
import Post from "@/app/components/MainPage/Post";
import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import React from "react";
import { Follow, User } from "@/app/components/types";
import { useParams } from 'next/navigation';
import RightBar from "@/app/components/MainPage/RightBar";
import LeftBar from "@/app/components/MainPage/LeftBar";

const StatusPage = () => {
    const { postId } = useParams(); // Get postId from route params

    const [post, setPost] = useState<any>(null);
    const [comments, setComments] = useState<any[]>([]);
    const [user, setUser] = useState<User | null>(null);
    const [recommendations, setRecommendations] = useState<User[]>([]);
    const [followedUsers, setFollowedUsers] = useState<User[]>([])

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
            }
        };

        fetchUserData();
    }, []);

    useEffect(() => {
        if (postId) {
            async function fetchData() {
                try {
                    const postResponse = await fetch(`https://repotor.onrender.com/record/${postId}`);
                    const postData = await postResponse.json();
                    console.log("Post", postData);
                    setPost(postData);

                    const commentsResponse = await fetch(`https://repotor.onrender.com/comments_for_record/${postId}`);
                    const commentsData = await commentsResponse.json();
                    setComments(commentsData['comments']);
                } catch (error) {
                    console.error("Error fetching data:", error);
                }
            }

            fetchData();
        }
    }, [postId]);

    return (
        <div className="min-h-screen flex justify-center">
        {/* Left Sidebar */}
        <div className="hidden lg:block w-64 px-4 border-r border-gray-300">
           {user? <LeftBar user={user} />: null}
           </div>
        <div className="w-[600px] ">
            <div className="flex items-center gap-8 sticky top-0 backdrop-blur-md p-4 z-10 bg-[#00000084]">
                <Link href="/">
                    <Image src="/icons/back.svg" alt="back" width={24} height={24} />
                </Link>
                <h1 className="font-bold text-lg">Post</h1>
            </div>

            {post && user ? <Post post={post} type="status" user={user} /> : <p className="text-center">Loading post...</p>}

            {user && comments && comments.length > 0 ? <Comments comments={comments} user={user} /> : <p className="text-center">No comments yet...</p>}
        </div> 
         {/* Right Sidebar */}
      <div className="hidden xl:block w-85 px-4 border-l border-gray-300">
        {user && recommendations.length ?<RightBar recommendations={recommendations} user={user} />: null}
        </div>
        </div>
    );
};

export default StatusPage;
