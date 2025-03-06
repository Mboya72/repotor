// "use client";

// import { useState } from "react";
// import { Bookmark, BookmarkCheck, Trash2 } from "lucide-react";

// interface Post {
//   id: number;
//   title: string;
//   author: string;
// }

// const posts: Post[] = [
//   { id: 1, title: "Understanding Next.js Middleware", author: "@dev_guru" },
//   { id: 2, title: "10 Tips for Writing Clean Code", author: "@coder_tips" },
//   { id: 3, title: "Why TypeScript is the Future", author: "@tech_savvy" },
// ];

// export default function BookmarkPage() {
//   const [bookmarks, setBookmarks] = useState<any[]>([]);

//   const toggleBookmark = (post: Post) => {
//     setBookmarks((prev) =>
//       prev.some((b) => b.id === post.id)
//         ? prev.filter((b) => b.id !== post.id)
//         : [...prev, post]
//     );
//   };

//   return (
//     <div className="max-w-3xl mx-auto p-6 space-y-8">
//       <h1 className="text-3xl font-extrabold text-center text-white">Posts</h1>

//       <div className="space-y-4">
//         {posts.map((post) => (
//           <div
//             key={post.id}
//             className="flex justify-between items-center bg-gray-900 text-white p-5 rounded-lg shadow-lg hover:shadow-xl transition-shadow"
//           >
//             <div>
//               <h2 className="text-xl font-semibold">{post.title}</h2>
//               <p className="text-sm text-gray-400">By {post.author}</p>
//             </div>
//             <button
//               onClick={() => toggleBookmark(post)}
//               className="text-yellow-400 hover:text-yellow-300 transition-colors"
//             >
//               {bookmarks.some((b) => b.id === post.id) ? (
//                 <BookmarkCheck className="w-7 h-7" />
//               ) : (
//                 <Bookmark className="w-7 h-7" />
//               )}
//             </button>
//           </div>
//         ))}
//       </div>

//       <h2 className="text-3xl font-extrabold text-center text-white mt-8">Bookmarked Posts</h2>
//       {bookmarks.length === 0 ? (
//         <p className="text-gray-400 text-center mt-4">No bookmarks yet.</p>
//       ) : (
//         <div className="space-y-4 mt-4">
//           {bookmarks.map((bookmark) => (
//             <div
//               key={bookmark.id}
//               className="flex justify-between items-center bg-gray-800 text-white p-5 rounded-lg shadow-lg hover:shadow-xl transition-shadow"
//             >
//               <div>
//                 <h3 className="text-xl font-semibold">{bookmark.title}</h3>
//                 <p className="text-sm text-gray-400">By {bookmark.author}</p>
//               </div>
//               <button
//                 onClick={() => toggleBookmark(bookmark)}
//                 className="text-red-500 hover:text-red-400 transition-colors"
//               >
//                 <Trash2 className="w-7 h-7" />
//               </button>
//             </div>
//           ))}
//         </div>
//       )}
//     </div>
//   );
// }
