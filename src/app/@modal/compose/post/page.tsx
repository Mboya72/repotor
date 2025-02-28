"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";

const PostModal = () => {
  const router = useRouter();

  const closeModal = () => {
    router.back();
  };

  return (
    <div className="absolute w-screen h-screen top-0 left-0 z-20 bg-[#293139a6] flex justify-center">
      <div className="py-4 px-8 rounded-xl bg-[#292E36] w-[600px] h-max mt-12">
        {/* TOP */}
        <div className="flex items-center justify-between">
          <div className="cursor-pointer" onClick={closeModal}>
            X
          </div>
          <div className="text-iconBlue font-bold">Drafts</div>
        </div>
        {/* CENTER */}
        <div className="py-8 flex gap-4">
          <div className="relative w-10 h-10 rounded-full overflow-hidden">
            <Image
              src="/general/avatar.png" // Corrected to 'src'
              alt="Elvizz"
              width={100} // Corrected to 'width'
              height={100} // Corrected to 'height'
              unoptimized={true} // Optional to disable optimization if needed
            />
          </div>
          <input
            className="flex-1 bg-transparent outline-none text-lg"
            type="text"
            placeholder="What is happening?!"
          />
        </div>
        {/* BOTTOM */}
        <div className=" flex items-center justify-between gap-4 flex-wrap border-t border-borderGray pt-4">
          <div className="flex gap-4 flex-wrap">
            <Image
              src="/icons/image.svg" // Corrected to 'src'
              alt=""
              width={20} // Corrected to 'width'
              height={20} // Corrected to 'height'
              className="cursor-pointer"
            />
            <Image
              src="/icons/gif.svg" // Corrected to 'src'
              alt=""
              width={20}
              height={20}
              className="cursor-pointer"
            />
            <Image
              src="/icons/poll.svg" // Corrected to 'src'
              alt=""
              width={20}
              height={20}
              className="cursor-pointer"
            />
            <Image
              src="/icons/emoji.svg" // Corrected to 'src'
              alt=""
              width={20}
              height={20}
              className="cursor-pointer"
            />
            <Image
              src="/icons/schedule.svg" // Corrected to 'src'
              alt=""
              width={20}
              height={20}
              className="cursor-pointer"
            />
            <Image
              src="/icons/location.svg" // Corrected to 'src'
              alt=""
              width={20}
              height={20}
              className="cursor-pointer"
            />
          </div>
          <button className="py-2 px-5 text-black bg-white rounded-full font-bold">Post</button>
        </div>
      </div>
    </div>
  );
};

export default PostModal;
