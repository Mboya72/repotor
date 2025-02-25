import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Bookmark, Trash2 } from "lucide-react";

export default function BookmarkPage() {
  const [bookmarks, setBookmarks] = useState([
    { id: 1, title: "Corruption Scandal Exposed", reporter: "@investigator1" },
    { id: 2, title: "New Environmental Laws Introduced", reporter: "@eco_warrior" },
    { id: 3, title: "Community Rallies for Justice", reporter: "@activist" }
  ]);

  const removeBookmark = (id) => {
    setBookmarks(bookmarks.filter((bookmark) => bookmark.id !== id));
  };

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4 flex items-center gap-2">
        <Bookmark className="w-6 h-6" /> iReporter Bookmarks
      </h1>
      {bookmarks.length === 0 ? (
        <p className="text-gray-500">No bookmarks yet.</p>
      ) : (
        bookmarks.map((bookmark) => (
          <Card key={bookmark.id} className="mb-3 shadow-md p-3 flex justify-between items-center">
            <CardContent>
              <p className="text-gray-900 font-medium">{bookmark.title}</p>
              <p className="text-gray-500 text-sm">Reported by {bookmark.reporter}</p>
            </CardContent>
            <Button variant="ghost" onClick={() => removeBookmark(bookmark.id)}>
              <Trash2 className="w-5 h-5 text-red-500" />
            </Button>
          </Card>
        ))
      )}
    </div>
  );
}
