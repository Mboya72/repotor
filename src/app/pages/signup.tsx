"use client";

import Head from "next/head";
import { FaGoogle } from "react-icons/fa";
import Link from "next/link";
import { useState } from "react";

export default function Signup() {
  const [isAdmin, setIsAdmin] = useState(false);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900">
      <Head>
        <title>Sign Up</title>
      </Head>
      <div className="flex w-full max-w-4xl bg-gray-800 rounded-lg shadow-lg p-8">
        {/* Left Side (Logo) */}
        <div className="w-1/2 flex justify-center items-center flex-grow">
          <div className="text-orange-500 text-[12rem] font-bold">R</div>
        </div>

        {/* Right Side (Form) */}
        <div className="w-1/2 text-white">
          <h2 className="text-xl font-semibold">Know what's happening now</h2>
          <p className="text-orange-400">Join Now.</p>

          <button className="flex items-center justify-center w-full mt-4 bg-white text-black rounded-md py-2">
            <FaGoogle className="text-orange-500" />
            Sign up with Google
          </button>

          <p className="mt-4 text-sm">Sign Up with Credentials</p>
          <input
            type="text"
            placeholder="Username"
            className="w-full mt-2 p-2 rounded bg-gray-700"
          />
          <input
            type="email"
            placeholder="Email"
            className="w-full mt-2 p-2 rounded bg-gray-700"
          />
          <input
            type="password"
            placeholder="Password"
            className="w-full mt-2 p-2 rounded bg-gray-700"
          />

          {/* Admin Toggle */}
          <div className="flex items-center mt-4">
            <input
              type="checkbox"
              id="adminToggle"
              className="mr-2 w-4 h-4"
              checked={isAdmin}
              onChange={() => setIsAdmin(!isAdmin)}
            />
            <label htmlFor="adminToggle" className="text-sm">
              Sign up as Admin
            </label>
          </div>

          <button className="w-full mt-4 bg-orange-500 py-2 rounded-md">
            {isAdmin ? "Sign up as Admin" : "Sign up as User"}
          </button>

          <div className="flex justify-center mt-4">
            <span className="text-gray-400">or</span>
          </div>

          <Link href="/signin">
            <button className="w-full mt-4 bg-orange-500 py-2 rounded-md">
              Already have an account?
            </button>
          </Link>

          <p className="mt-4 text-xs text-gray-400">
            By signing up, you agree to the{" "}
            <span className="text-orange-400">Terms of Service</span> and{" "}
            <span className="text-orange-400">Privacy Policy</span>, including{" "}
            <span className="text-orange-400">cookie use</span>.
          </p>
        </div>
      </div>
    </div>
  );
}
