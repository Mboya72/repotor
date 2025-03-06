"use client";

import { useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Head from "next/head";

export default function ResetPassword() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const router = useRouter();

  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [message, setMessage] = useState<string>("");

  const handleResetPassword = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setMessage("Passwords do not match!");
      return;
    }

    try {
      const response = await fetch(`http://localhost:5000/newpassword/${token}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password }),
      });

      const data = await response.json();
      if (response.ok) {
        setMessage("Password reset successful! Redirecting...");
        setTimeout(() => router.push("/signin"), 2000);
      } else {
        setMessage(data.error || "Error resetting password.");
      }
    } catch (error) {
      setMessage("Something went wrong. Please try again.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 px-4">
      <Head>
        <title>Reset Password</title>
      </Head>
      <div className="w-full max-w-md bg-gray-800 rounded-lg shadow-lg p-6">
        <h2 className="text-2xl font-semibold text-white">Reset Password</h2>
        <p className="text-gray-400">Enter your new password.</p>

        <form onSubmit={handleResetPassword}>
          <input
            type="password"
            placeholder="New Password"
            className="w-full mt-4 p-3 rounded-full bg-gray-700 focus:outline-none focus:ring-2 focus:ring-orange-400"
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Confirm Password"
            className="w-full mt-4 p-3 rounded-full bg-gray-700 focus:outline-none focus:ring-2 focus:ring-orange-400"
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />

          <button type="submit" className="w-full mt-4 bg-orange-500 py-2 rounded-md transition hover:bg-orange-600">
            Reset Password
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
