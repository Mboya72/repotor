"use client"
import Feed from "@/components/MainPage/Feed";
import Image from "next/image"; // Corrected import path
import Link from "next/link";
import { useState } from "react";
import MainLayout from "../MainLayout";

const UserPage = () => {
  const [coverImage, setCoverImage] = useState("/general/00.jpeg");
  const [avatarImage, setAvatarImage] = useState("/general/hhh-Photoroom.png");

  const modal = undefined
  const handleCoverImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const file = URL.createObjectURL(event.target.files[0]);
      setCoverImage(file);
    }
  };

  const handleAvatarImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const file = URL.createObjectURL(event.target.files[0]);
      setAvatarImage(file);
    }
  };

  return (
    <MainLayout modal={modal}>
    <div className="">
      {/* PROFILE TITLE */}
      <div className="flex items-center gap-8 sticky top-0 backdrop-blur-md p-4 z-10 bg-[#00000084]">
        <Link href="/">
          <Image src="/icons/back.svg" alt="back" width={24} height={24} /> {/* Corrected Image usage */}
        </Link>
        <h1 className="font-bold text-lg">Elviz</h1>
      </div>
      {/* INFO */}
      <div className="">
        {/* COVER & AVATAR CONTAINER */}
        <div className="relative w-full">
          {/* COVER */}
          <div className="w-full aspect-[3/1] relative">
            <Image className="h-80" src={coverImage} alt="Cover Image" width={600} height={200} />
            <input type="file" accept="image/*" onChange={handleCoverImageChange} className="absolute top-0 left-0 w-full h-full opacity-0 cursor-pointer" />
          </div>
          {/* AVATAR */}
          <div className="w-1/5 aspect-square rounded-full overflow-hidden border-4 border-black bg-gray-300 absolute left-4 -translate-y-1/2">
            <Image src={avatarImage} alt="Avatar" width={100} height={100} />
            <input type="file" accept="image/*" onChange={handleAvatarImageChange} className="absolute top-0 left-0 w-full h-full opacity-0 cursor-pointer" />
          </div>
        </div>
        <div className="flex w-full items-center justify-end gap-2 p-2">
          <div className="w-9 h-9 flex items-center justify-center rounded-full border-[1px] border-gray-500 cursor-pointer">
            <Image src="/icons/more.svg" alt="more" width={20} height={20} />
          </div>
          <div className="w-9 h-9 flex items-center justify-center rounded-full border-[1px] border-gray-500 cursor-pointer">
            <Image src="/icons/explore.svg" alt="explore" width={20} height={20} />
          </div>
          <div className="w-9 h-9 flex items-center justify-center rounded-full border-[1px] border-gray-500 cursor-pointer">
            <Image src="/icons/message.svg" alt="message" width={20} height={20} />
          </div>
          <button className="py-2 px-4 bg-[#FB6535] text-black font-bold rounded-full">
            Follow
          </button>
        </div>
        {/* USER DETAILS */}
        <div className="p-4 flex flex-col gap-2">
          {/* USERNAME & HANDLE */}
          <div className="">
            <h1 className="text-2xl font-bold">Elviz</h1>
            <span className="text-textGray text-sm">@Elvizz</span>
          </div>
          <p>Elviz Designs</p>
          {/* JOB & LOCATION & DATE */}
          <div className="flex gap-4 text-textGray text-[15px]">
            <div className="flex items-center gap-2">
              <Image
                src="/icons/userLocation.svg"
                alt="location"
                width={20}
                height={20}
              />
              <span>Kenya</span>
            </div>
            <div className="flex items-center gap-2">
              <Image src="/icons/date.svg" alt="date" width={20} height={20} />
              <span>Joined June 2024</span>
            </div>
          </div>
          {/* FOLLOWINGS & FOLLOWERS */}
          <div className="flex gap-4">
            <div className="flex items-center gap-2">
              <span className="font-bold">100</span>
              <span className="text-textGray text-[15px]">Followers</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-bold">100</span>
              <span className="text-textGray text-[15px]">Followings</span>
            </div>
          </div>
        </div>
      </div>
      {/* FEED */}
      <Feed />
    </div>
    </MainLayout>
  );
};

export default UserPage;
