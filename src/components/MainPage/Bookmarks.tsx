"use client";
import MainLayout from "@/app/MainLayout";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

// Bookmark interface to define the structure of a bookmark
interface Bookmark {
  id: number;
  title: string;
  description: string;
  image: string;
  link: string;
}

const BookmarksPage = () => {
  // Sample bookmarks list, you can replace this with actual data
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([
    {
      id: 1,
      title: "Design Trends 2025",
      description: "Explore the top design trends in 2025.",
      image: "/images/bookmark1.jpg",
      link: "/articles/design-trends-2025",
    },
    {
      id: 2,
      title: "Next JS Guide",
      description: "A comprehensive guide to mastering Next.js.",
      image: "/images/bookmark2.jpg",
      link: "/articles/nextjs-guide",
    },
  ]);

  // Remove bookmark handler
  const handleRemoveBookmark = (id: number) => {
    setBookmarks((prevBookmarks) => prevBookmarks.filter((bookmark) => bookmark.id !== id));
  };

  return (
    <MainLayout modal={undefined}>
      <div className="p-4">
        {/* TITLE */}
        <div className="flex items-center gap-8 sticky top-0 backdrop-blur-md p-4 z-10 bg-[#00000084]">
          <Link href="/">
            <Image src="/icons/back.svg" alt="back" width={24} height={24} />
          </Link>
          <h1 className="font-bold text-lg">Bookmarks</h1>
        </div>

        {/* BOOKMARKS LIST */}
        <div className="mt-4">
          {bookmarks.length === 0 ? (
            <p>No bookmarks found!</p>
          ) : (
            <div className="space-y-4">
              {bookmarks.map((bookmark) => (
                <div key={bookmark.id} className="flex gap-4 p-4 border-b">
                  <div className="w-1/4">
                    <Image
                      src={bookmark.image}
                      alt={bookmark.title}
                      width={100}
                      height={100}
                      className="object-cover"
                    />
                  </div>
                  <div className="w-3/4">
                    <h2 className="font-bold text-xl">{bookmark.title}</h2>
                    <p className="text-sm text-textGray">{bookmark.description}</p>
                    <div className="mt-2 flex gap-2">
                      <Link href={bookmark.link}>
                        <button className="py-1 px-4 bg-[#FB6535] text-white rounded-full">
                          View
                        </button>
                      </Link>
                      <button
                        onClick={() => handleRemoveBookmark(bookmark.id)}
                        className="py-1 px-4 border-[1px] border-gray-500 text-gray-500 rounded-full"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </MainLayout>
  );
};

export default BookmarksPage;
