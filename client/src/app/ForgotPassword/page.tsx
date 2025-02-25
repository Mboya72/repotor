"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Head from "next/head";

export default function ForgotPassword() {
  const [email, setEmail] = useState<string>("");
  const [message, setMessage] = useState<string>("");
  const router = useRouter();

  const handleResetRequest = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    try {
      const response = await fetch("http://localhost:5000/api/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();
      setMessage(data.message || "If this email is registered, a reset link has been sent.");
    } catch (error) {
      setMessage("Something went wrong. Please try again later.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 px-4">
      <Head>
        <title>Forgot Password</title>
      </Head>
      <div className="w-full max-w-md bg-gray-800 rounded-lg shadow-lg p-6">
        <h2 className="text-2xl font-semibold text-white">Reset Password</h2>
        <p className="text-gray-400">Enter your email to reset your password.</p>

        <form onSubmit={handleResetRequest}>
          <input
            type="email"
            placeholder="Enter your email"
            className="w-full mt-4 p-3 rounded-full bg-gray-700 focus:outline-none focus:ring-2 focus:ring-orange-400"
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <button type="submit" className="w-full mt-4 bg-orange-500 py-2 rounded-md transition hover:bg-orange-600">
            Send Reset Link
          </button>
        </form>

        {message && <p className="text-green-400 mt-2">{message}</p>}

        <div className="text-center mt-4">
          <button onClick={() => router.push("/signin")} className="text-sm text-orange-400 hover:underline">
            Back to Sign In
          </button>
        </div>
      </div>
    </div>
  );
}
