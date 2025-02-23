// pages/signin.js
import Head from "next/head";
import { FaGoogle } from "react-icons/fa";
import Link from "next/link";

export default function Signin() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900">
      <Head>
        <title>Sign In</title>
      </Head>
      <div className="flex w-full max-w-4xl bg-gray-800 rounded-lg shadow-lg p-8">
        {/* Left Side (Logo) */}
        <div className="w-1/2 flex justify-center items-center">
          <div className="text-orange-500 text-[12rem] font-bold">R</div>
        </div>

        {/* Right Side (Form) */}
        <div className="w-1/2 text-white">
          <h2 className="text-2xl font-semibold">Welcome Back!</h2>
          <p className="text-orange-400">Sign in to your account.</p>

          <button className="flex items-center justify-center w-full mt-4 bg-white text-black rounded-md py-2 gap-2 transition hover:bg-gray-300">
            <FaGoogle className="text-orange-500" />
            Sign in with Google
          </button>

          <p className="mt-4 text-sm">Sign in with Credentials</p>
          <input
            type="email"
            placeholder="Email"
            className="w-full mt-2 p-3 rounded bg-gray-700 focus:outline-none focus:ring-2 focus:ring-orange-400"
          />
          <input
            type="password"
            placeholder="Password"
            className="w-full mt-2 p-3 rounded bg-gray-700 focus:outline-none focus:ring-2 focus:ring-orange-400"
          />

          {/* Forgot Password */}
          <div className="text-right mt-2">
            <Link href="/forgot-password" className="text-sm text-orange-400 hover:underline">
              Forgot Password?
            </Link>
          </div>

          <button className="w-full mt-4 bg-orange-500 py-2 rounded-md transition hover:bg-orange-600">
            Sign in
          </button>

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
