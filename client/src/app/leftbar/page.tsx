import Link from "next/link";
import Image from 'next/image';

const menuList = [
  {
    id: 1,
    name: "Homepage",
    link: "/",
    icon: "home.svg",
  },
  {
    id: 2,
    name: "Explore",
    link: "/",
    icon: "explore.svg",
  },
  {
    id: 3,
    name: "Notification",
    link: "/",
    icon: "notification.svg",
  },
  {
    id: 4,
    name: "Messages",
    link: "/",
    icon: "message.svg",
  },
  {
    id: 5,
    name: "Bookmarks",
    link: "/",
    icon: "bookmark.svg",
  },
  {
    id: 6,
    name: "Profile",
    link: "/",
    icon: "profile.svg",
  },
  {
    id: 7,
    name: "More",
    link: "/",
    icon: "more.svg",
  },
];

const LeftBar = () => {
  return (
    <div className="h-screen sticky top-0 flex flex-col justify-between pt-2 pb-8">
      {/* LOGO MENU BUTTON */}
      <div className="flex flex-col gap-4 text-lg items-center sm:items-start">
        {/* LOGO */}
        <Link href="/" className="p-2 rounded-full hover:bg-[#181818] ">
          <Image
            src="/icons/R.svg"  // Correct way
            alt="Logo"
            width={50}
            height={50}
          />
        </Link>
        {/* MENU LIST */}
        <div className="flex flex-col gap-4">
          {menuList.map((item) => (
            <Link
              href={item.link}
              className="p-2 rounded-full hover:bg-[#181818] flex items-center gap-4"
              key={item.id}
            >
              <Image
                src={`/icons/${item.icon}`} // Correct way to handle dynamic image paths
                alt={item.name}
                width={24}
                height={24}
              />
              <span className="hidden sm:inline">{item.name}</span>
            </Link>
          ))}
        </div>
        {/* BUTTON */}
        <Link
          href="/compose/post"
          className="bg-white text-black rounded-full w-12 h-12 flex items-center justify-center sm:hidden"
        >
          <Image src="/icons/post.svg" alt="new post" width={24} height={24} />
        </Link>
        <Link
          href="/compose/post"
          className="hidden sm:block bg-orange-600 text-black rounded-full font-bold py-2 px-8 sm:px-20"
        >
          Post
        </Link>
      </div>
      {/* USER */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 relative rounded-full overflow-hidden">
            <Image
              src="/general/hhh-Photoroom.png"
              alt="lama dev"
              width={40} // Adjusted the width and height
              height={40}
            />
          </div>
          <div className="hidden sm:flex flex-col">
            <span className="font-bold">Elviz</span>
            <span className="text-sm text-textGray">@Elvizzz</span>
          </div>
        </div>
        <div className="hidden sm:block cursor-pointer font-bold">...</div>
      </div>
    </div>
  );
};

export default LeftBar;