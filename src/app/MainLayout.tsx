import RightBar from "@/components/MainPage/RightBar";
import "./globals.css";


import type { Metadata } from 'next'
import LeftBar from "@/components/MainPage/LeftBar";

export const metadata: Metadata = {
  title: 'Repotor Dashboard',
  description: 'Next.js I reporter application project',
}

export default function RootLayout({
  children,
  modal
}: Readonly<{
  children: React.ReactNode;
  modal: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <div className="max-w-screen-md lg:max-w-screen-lg xl:max-w-screen-xl xxl:max-w-screen-xxl mx-auto flex justify-between">
          <div className="px-2 xsm:px-4 xxl:px-8 ">
            <LeftBar />
          </div>
          <div className="flex-1 lg:min-w-[700px] border-[1px]  border-gray-700 ">
            {children}
            {modal}
          </div>
          <div className="hidden lg:flex ml-4 md:ml-8 flex-1 ">
            <RightBar />
          </div>
        </div>
      </body>
    </html>
  );
}