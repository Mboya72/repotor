'use client';
import Comments from "@/app/components/MainPage/Comments";
import Post from "@/app/components/MainPage/Post";
import Link from "next/link";
import Image from "next/image";  // Corrected import statement
import { useState, useEffect } from "react";
import React from "react";
import { User } from "@/app/components/types";

// Define the expected type for the `params` object
interface Params {
  postId: string; // Assuming the postId is in the 'id' param
}

const StatusPage = ({ params }: { params: Params }) => {
  const [postId, setPostId] = useState<string | null>(null); // Initialize state for postId
  const [post, setPost] = useState<any>(null); // State for the post data
  const [comments, setComments] = useState<any[]>([]); // State for comments data
  
  const [user, setUser] = useState<User | null>(null);


  useEffect(() => {
    // Auto-login: fetch the session data from your backend
    const fetchUserData = async () => {
      try {
        const response = await fetch("http://localhost:5000/check_session", {
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
    if (params && params.postId) {
      setPostId(params.postId); // Set postId from URL params
    }
  }, [params]); // Dependency on params to update postId when params change

  useEffect(() => {
    // If postId is set, fetch the post details and comments
    if (!postId) return; // Don't fetch if there's no postId

    async function fetchData() {
      try {
        // Fetch the post details
        const postResponse = await fetch(`http://localhost:5000/record/${postId}`);
        const postData = await postResponse.json();
        console.log("Post", postData);
        setPost(postData);

        // Fetch the comments related to the post
        const commentsResponse = await fetch(`http://localhost:5000/comments_for_record/${postId}`);
        const commentsData = await commentsResponse.json();
        setComments(commentsData['comments']);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }

    fetchData();
  }, [postId]); // Trigger effect when postId changes

  return (
    <div>
      <div className="flex items-center gap-8 sticky top-0 backdrop-blur-md p-4 z-10 bg-[#00000084]">
        <Link href="/">
          <Image src="/icons/back.svg" alt="back" width={24} height={24} />
        </Link>
        <h1 className="font-bold text-lg">Post</h1>
      </div>

      {/* Render the post details */}
      {post && user ? <Post post={post} type="status" user={user} /> : <p>Loading post...</p>}

      {/* Render the comments */}
      {user && comments && comments.length > 0 ? <Comments comments={comments} user={user} /> : <p>No comments yet...</p>}
    </div>
  );
};

export default StatusPage;
