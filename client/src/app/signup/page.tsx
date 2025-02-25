"use client";

import Head from "next/head";
import { FaGoogle } from "react-icons/fa";
import { useState, ChangeEvent, FormEvent } from "react";
import { useRouter } from "next/navigation";

interface SignupFormData {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export default function Signup() {
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [formData, setFormData] = useState<SignupFormData>({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const router = useRouter();

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value.trim() });
  };

  const handleSignup = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    console.log("User Data:", formData, "Admin:", isAdmin);

    // Simulate successful signup (Replace with actual API call)
    setTimeout(() => {
      router.push("/signin"); // Redirect to sign-in page
    }, 1000);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 px-4">
      <Head>
        <title>Sign Up</title>
      </Head>
      <div className="flex flex-col md:flex-row w-full max-w-4xl bg-gray-800 rounded-lg shadow-lg p-6 md:p-8">
        {/* Left Side (Logo) */}
        <div className="md:w-1/2 flex justify-center items-center py-4 md:py-0">
          <img src="/R 1.svg" alt="Logo" className="h-32 w-auto md:h-48" />
        </div>

        {/* Right Side (Form) */}
        <div className="md:w-1/2 text-white">
          <h2 className="text-2xl font-semibold">Know what's happening now</h2>
          <p className="text-orange-400">Join Now.</p>

          {/* Google Signup */}
          <button className="flex items-center justify-center w-full mt-4 bg-white text-black rounded-md py-2 gap-2 transition hover:bg-gray-300">
            <FaGoogle className="text-orange-500" />
            Sign up with Google
          </button>

          <p className="mt-4 text-sm">Sign Up with Credentials</p>
          <form onSubmit={handleSignup}>
            <input
              type="text"
              name="username"
              placeholder="Username"
              className="w-full mt-2 p-3 rounded bg-gray-700 focus:outline-none focus:ring-2 focus:ring-orange-400"
              onChange={handleInputChange}
              required
            />
            <input
              type="email"
              name="email"
              placeholder="Email"
              className="w-full mt-2 p-3 rounded bg-gray-700 focus:outline-none focus:ring-2 focus:ring-orange-400"
              onChange={handleInputChange}
              required
            />
            <input
              type="password"
              name="password"
              placeholder="Password"
              className="w-full mt-2 p-3 rounded bg-gray-700 focus:outline-none focus:ring-2 focus:ring-orange-400"
              onChange={handleInputChange}
              required
            />
            <input
              type="password"
              name="confirmPassword"
              placeholder="Confirm Password"
              className="w-full mt-2 p-3 rounded bg-gray-700 focus:outline-none focus:ring-2 focus:ring-orange-400"
              onChange={handleInputChange}
              required
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

            <button type="submit" className="w-full mt-4 bg-orange-500 py-2 rounded-md transition hover:bg-orange-600">
              {isAdmin ? "Sign up as Admin" : "Sign up as User"}
            </button>
          </form>

          <div className="flex justify-center mt-4">
            <span className="text-gray-400">or</span>
          </div>

          {/* Redirect to Signin Page */}
          <button
            onClick={() => router.push("/signin")}
            className="w-full mt-4 bg-orange-500 py-2 rounded-md transition hover:bg-orange-600"
          >
            Already have an account?
          </button>

          <p className="mt-4 text-xs text-gray-400">
            By signing up, you agree to the{" "}
            <span className="text-orange-400 hover:underline">Terms of Service</span> and{" "}
            <span className="text-orange-400 hover:underline">Privacy Policy</span>, including{" "}
            <span className="text-orange-400 hover:underline">cookie use</span>.
          </p>
        </div>
      </div>
    </div>
  );
}
