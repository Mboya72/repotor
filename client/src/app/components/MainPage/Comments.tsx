import Image from "next/image"
import { Comment, User } from "../types"
import React from "react"
import { FiTrash } from "react-icons/fi"

interface CommentProps {
  comments: Comment[],
  user: User 
}

const Comments: React.FC<CommentProps> = ({ comments, user }) => {
  return (
    <div className=''>
      {comments.map((comment) => (
        <div key={comment.id} className="flex items-start p-4 border-b border-gray-700">
          {/* Profile Image */}
          <img
            src={comment.user.profile_picture || "/icons/user.png"}
            alt="Profile"
            className="w-10 h-10 rounded-full mr-4"
          />

          <div className="flex flex-col w-full">
            {/* Username, Time and Trash Icon */}
            <div className="flex items-center justify-between mb-2">
              <span className="font-semibold">{comment.user.username}</span>
              <div className="flex items-center">
                <span className="text-gray-400 text-sm mr-4">
                  {comment.created_at && new Date(comment.created_at).toLocaleString()}
                </span>
                {comment.user_id === user.id ? (
                  <button
                    className="text-red-400"
                    onClick={() => {
                      if (confirm("Are you sure you want to delete this comment?")) {
                        // Call your delete API endpoint here
                        fetch(`http://localhost:5000/comments_for_record/${comment.record_id}`, {
                          method: "DELETE",
                          credentials: "include",
                          headers: {"Content-Type": "application/json"},
                          body: JSON.stringify({
                            "user_id": user.id,
                            "comment_id": comment.id
                          })
                        })
                          .then((r) => {
                            if (r.ok) {
                              // Optionally trigger a re-fetch or navigate away
                              alert("Comment deleted successfully");
                              window.location.reload();
                            }
                          })
                          .catch((err) => console.error(err));
                      }
                    }}
                  >
                    <FiTrash />
                  </button>
                ) : null}
              </div>
            </div>

            {/* Message */}
            <p>{comment.message}</p>

            {/* Display Image if Comment Contains One */}
            {comment.image_url && (
              <div className="mt-2">
                <Image
                  src={comment.image_url}
                  alt="Comment Image"
                  width={500}
                  height={500}
                  className="rounded-lg"
                />
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  )
}

export default Comments
