"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Head from "next/head";
import Image from "next/image";

// Import your components (ensure these components are client components)
import Homepage from "@/app/components/Connect/Hompage";
import Dashboard from "@/app/components/Dashboard/Dashboard";
import Signup from "./signup/page";
import { User } from "./components/types"; // Adjust the path as necessary

export default function Home() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const router = useRouter();

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
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-900 text-white">
        <Image
          src={"/R 1.svg"}
          alt="logo"
          width={200} // Adjusted the width and height
          height={200}
        />
        <p className="text-orange-600">Loading...</p>
      </div>
    );
  }

  // If there's no user, render the Signup page
  if (!user) {
    return <Signup />;
  }

  // If user exists, render Dashboard for admin and Homepage for non-admin
  return (
    <>
      <Head>
        <title>Home</title>
      </Head>
      {user.is_admin ? <Dashboard user={user} /> : <Homepage user={user} />}
    </>
  );
}
