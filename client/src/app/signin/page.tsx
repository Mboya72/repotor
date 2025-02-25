"use client";

import Head from "next/head";
import { FaGoogle } from "react-icons/fa";
import Link from "next/link";
import { useState, ChangeEvent, FormEvent } from "react";
import { useRouter } from "next/navigation";

interface SigninFormData {
  email: string;
  password: string;
}

export default function Signin() {
  const [formData, setFormData] = useState<SigninFormData>({ email: "", password: "" });
  const [error, setError] = useState<string>("");
  const router = useRouter();

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSignin = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("Sign in Data:", formData);

    // Simulate sign-in (Replace this with an actual API call)
    if (formData.email.trim() === "test@example.com" && formData.password.trim() === "password") {
      router.push("/dashboard"); // Redirect to home/dashboard after successful login
    } else {
      setError("Invalid email or password. Please try again.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 px-4">
      <Head>
        <title>Sign In</title>
      </Head>
      <div className="flex flex-col md:flex-row w-full max-w-4xl bg-gray-800 rounded-lg shadow-lg p-6 md:p-8">
        {/* Left Side (Logo) */}
        <div className="md:w-1/2 flex justify-center items-center py-4 md:py-0">
          <img src="/R 1.svg" alt="Logo" className="h-32 w-auto md:h-48" />
        </div>

        {/* Right Side (Form) */}
        <div className="md:w-1/2 text-white">
          <h2 className="text-2xl font-semibold">Welcome Back!</h2>
          <p className="text-orange-400">Sign in to your account.</p>

          {/* Google Sign-in */}
          <button className="flex items-center justify-center w-full mt-4 bg-white text-black rounded-md py-2 gap-2 transition hover:bg-gray-300">
            <FaGoogle className="text-orange-500" />
            Sign in with Google
          </button>

          <p className="mt-4 text-sm">Sign in with Credentials</p>
          <form onSubmit={handleSignin}>
            <input
              type="email"
              name="email"
              placeholder="Email"
              className="w-full mt-2 p-3 rounded-full bg-gray-700 focus:outline-none focus:ring-2 focus:ring-orange-400"
              onChange={handleInputChange}
              required
            />
            <input
              type="password"
              name="password"
              placeholder="Password"
              className="w-full mt-2 p-3 rounded-full bg-gray-700 focus:outline-none focus:ring-2 focus:ring-orange-400"
              onChange={handleInputChange}
              required
            />

            {/* Error Message */}
            {error && <p className="text-red-500 text-sm mt-2">{error}</p>}

            {/* Forgot Password */}
            <div className="text-right mt-2">
              <Link href="/ForgotPassword" className="text-sm text-orange-400 hover:underline">
                Forgot Password?
              </Link>
            </div>

            <button type="submit" className="w-full mt-4 bg-orange-500 py-2 rounded-md transition hover:bg-orange-600">
              Sign in
            </button>
          </form>

          <div className="flex justify-center mt-4">
            <span className="text-gray-400">or</span>
          </div>

          <Link href="/signup">
            <button className="w-full mt-4 bg-orange-500 py-2 rounded-md transition hover:bg-orange-600">
              Don't have an account? Sign up
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}
