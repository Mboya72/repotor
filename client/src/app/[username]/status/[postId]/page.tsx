'use client';
import Comments from "@/app/components/MainPage/Comments";
import Post from "@/app/components/MainPage/Post";
import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import React from "react";
import { User } from "@/app/components/types";
import { useParams } from 'next/navigation';
import RightBar from "@/app/components/MainPage/RightBar";
import LeftBar from "@/app/components/MainPage/LeftBar";

const StatusPage = () => {
    const { postId } = useParams(); // Get postId from route params

    const [post, setPost] = useState<any>(null);
    const [comments, setComments] = useState<any[]>([]);
    const [user, setUser] = useState<User | null>(null);

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
       <LeftBar/>
       <div>

        <div>
            <div className="flex items-center gap-8 sticky top-0 backdrop-blur-md p-4 z-10 bg-[#00000084]">
                <Link href="/">
                    <Image src="/icons/back.svg" alt="back" width={24} height={24} />
                </Link>
                <h1 className="font-bold text-lg">Post</h1>
            </div>

            {post && user ? <Post post={post} type="status" user={user} /> : <p>Loading post...</p>}

            {user && comments && comments.length > 0 ? <Comments comments={comments} user={user} /> : <p>No comments yet...</p>}
        </div> 
       </div>
        <RightBar/>
    );
};

export default StatusPage;