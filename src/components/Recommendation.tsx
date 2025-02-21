import Link from "next/link";
import Image from "next/image";

const Recommendations = () => {
  return (
    <div className="p-4 rounded-2xl border-[1px] border-borderGray flex flex-col gap-4">
      {/* USER CARD */}
      <div className='flex items-center justify-between'>
        {/* IMAGE AND USER INFO */}
        <div className='flex items-center gap-2'>
          <div className='relative rounded-full overflow-hidden w-10 h-10'>
            <Image
                          src="/general/hhh-Photoroom.png"
                          alt="lama dev"
                          width={40} // Adjusted the width and height
                          height={40}
                        />
          </div>
          <div className=''>
            <h1 className="text-md font-bold">John Doe</h1>
            <span className="text-textGray text-sm">@johnDoe</span>
          </div>
        </div>
        {/* BUTTON */}
        <button className="py-1 px-4 font-semibold bg-[#FB6535] text-black rounded-full">Follow</button>
      </div>
      <div className='flex items-center justify-between'>
        {/* IMAGE AND USER INFO */}
        <div className='flex items-center gap-2'>
          <div className='relative rounded-full overflow-hidden w-10 h-10'>
            <Image
                          src="/general/hhh-Photoroom.png"
                          alt="lama dev"
                          width={40} // Adjusted the width and height
                          height={40}
                        />
          </div>
          <div className=''>
            <h1 className="text-md font-bold">John Doe</h1>
            <span className="text-textGray text-sm">@johnDoe</span>
          </div>
        </div>
        {/* BUTTON */}
        <button className="py-1 px-4 font-semibold bg-[#FB6535] text-black rounded-full">Follow</button>
      </div>
      <div className='flex items-center justify-between'>
        {/* IMAGE AND USER INFO */}
        <div className='flex items-center gap-2'>
          <div className='relative rounded-full overflow-hidden w-10 h-10'>
            <Image
                          src="/general/hhh-Photoroom.png"
                          alt="lama dev"
                          width={40} // Adjusted the width and height
                          height={40}
                        />
          </div>
          <div className=''>
            <h1 className="text-md font-bold">John Doe</h1>
            <span className="text-textGray text-sm">@johnDoe</span>
          </div>
        </div>
        {/* BUTTON */}
        <button className="py-1 px-4 font-semibold bg-[#FB6535] text-black rounded-full">Follow</button>
      </div>
      <Link href="/" className="text-[#FB6535]">
        Show More
      </Link>
    </div>
  );
};

export default Recommendations;
