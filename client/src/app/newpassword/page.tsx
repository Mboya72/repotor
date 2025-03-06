// src/app/newpassword/page.tsx
'use client';
import dynamic from "next/dynamic";

// Dynamically import the ResetPassword component, disabling SSR.
const ResetPassword = dynamic(() => import("../components/MainPage/ResetPassword"), {
  ssr: false,
});

export default ResetPassword;
