// pages/Homepage.tsx or wherever your Homepage component is
import React, { ReactNode } from "react";
import Link from "next/link";
import Feed from "../MainPage/Feed";
import Share from "../MainPage/Share";
import MainLayout from "@/app/MainLayout";


const Homepage = ({modal}:{modal:ReactNode}) => {
  return (
    <MainLayout modal={modal}>
      <div className="">
        {/* Top Links */}
        <div className="px-4 pt-4 flex justify-between text-textGray font-bold border-b-[1px] border-borderGray">
          <Link className="pb-3 flex items-center border-b-4 border-[#]" href="/">
            For you
          </Link>
          <Link className="pb-3 flex items-center " href="/">
            Following
          </Link>
        </div>

        {/* Share and Feed */}
        <Share />
        <Feed />
      </div>
    </MainLayout>
  );
};

export default Homepage;
