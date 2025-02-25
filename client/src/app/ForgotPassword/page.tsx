// "use client";

// import { useState } from "react";
// import { useRouter } from "next/navigation";
// import Head from "next/head";

// export default function ForgotPassword() {
//   const [email, setEmail] = useState("");
//   const [message, setMessage] = useState("");
//   const router = useRouter();

//   const handleReset = async (e) => {
//     e.preventDefault();
    
//     // Simulate API call (Replace with actual backend request)
//     if (email) {
//       setMessage("If this email is registered, a reset link has been sent.");
//     } else {
//       setMessage("Please enter a valid email.");
//     }
//   };

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-gray-900 px-4">
//       <Head>
//         <title>Forgot Password</title>
//       </Head>
//       <div className="w-full max-w-md bg-gray-800 rounded-lg shadow-lg p-6">
//         <h2 className="text-2xl font-semibold text-white">Reset Password</h2>
//         <p className="text-gray-400">Enter your email to reset your password.</p>

//         <form onSubmit={handleReset}>
//           <input
//             type="email"
//             name="email"
//             placeholder="Enter your email"
//             className="w-full mt-4 p-3 rounded bg-gray-700 focus:outline-none focus:ring-2 focus:ring-orange-400"
//             onChange={(e) => setEmail(e.target.value)}
//             required
//           />

//           <button type="submit" className="w-full mt-4 bg-orange-500 py-2 rounded-md transition hover:bg-orange-600">
//             Reset Password
//           </button>
//         </form>

//         {message && <p className="text-green-400 mt-2">{message}</p>}

//         <div className="text-center mt-4">
//           <button
//             className="text-sm text-orange-400 hover:underline"
//             onClick={() => router.push("/signin")}
//           >
//             Back to Sign In
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// }

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Head from "next/head";

export default function ForgotPassword() {
  const [email, setEmail] = useState<string>("");
  const [message, setMessage] = useState<string>("");
  const router = useRouter();

  const handleReset = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    // Simulate API call (Replace with actual backend request)
    if (email.trim()) {
      setMessage("If this email is registered, a reset link has been sent.");
    } else {
      setMessage("Please enter a valid email.");
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

        <form onSubmit={handleReset}>
          <input
            type="email"
            name="email"
            placeholder="Enter your email"
            className="w-full mt-4 p-3 rounded bg-gray-700 focus:outline-none focus:ring-2 focus:ring-orange-400"
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <button type="submit" className="w-full mt-4 bg-orange-500 py-2 rounded-md transition hover:bg-orange-600">
            Reset Password
          </button>
        </form>

        {message && <p className="text-green-400 mt-2">{message}</p>}

        <div className="text-center mt-4">
          <button
            className="text-sm text-orange-400 hover:underline"
            onClick={() => router.push("/signin")}
          >
            Back to Sign In
          </button>
        </div>
      </div>
    </div>
  );
}
