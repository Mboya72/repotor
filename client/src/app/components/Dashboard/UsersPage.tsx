import React, { useEffect, useState } from "react";
import { User } from "../types";

const UsersPage = () => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [users, setUsers] = useState<User[]>([])

  // Refetch function
  const fetchUsers = () => {
    fetch("https://repotor.onrender.com/users")
      .then((r) => r.json())
      .then((users) => {
        setUsers(users);
      })
      .catch((err) => console.log(err));
  };

  useEffect(() => {
    fetchUsers(); // Fetch users when the component is mounted
  }, []);
  

  // Function to handle image click to open in popup
  const handleImageClick = (imageUrl: string) => {
    setSelectedImage(imageUrl);
  };

  // Function to close the image popup
  const closePopup = () => {
    setSelectedImage(null);
  };

  return (
    <div className="bg-gray-800 p-6 rounded-lg shadow-sm">
      <h2 className="text-2xl font-semibold text-white mb-4">Users</h2>
      <table className="min-w-full bg-gray-700 rounded-lg">
        <thead>
          <tr className="text-left">
            <th className="px-6 py-3 text-sm font-medium text-white">Avatar</th>
            <th className="px-6 py-3 text-sm font-medium text-white">Name</th>
            <th className="px-6 py-3 text-sm font-medium text-white">Email</th>
            <th className="px-6 py-3 text-sm font-medium text-white">Role</th>
            <th className="px-6 py-3 text-sm font-medium text-white">Status</th> {/* Status column */}
            <th className="px-6 py-3 text-sm font-medium text-white">Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id} className="border-t border-gray-600">
              <td className="px-6 py-4 text-sm text-gray-300">
                {/* User Avatar */}
                <div
                  onClick={() => handleImageClick(user.profile_picture!)}
                  className="cursor-pointer w-10 h-10 rounded-full overflow-hidden"
                >
                  <img
                    src={user.profile_picture || "/icons/user.png"}
                    alt={user.username}
                    className="w-full h-full object-cover"
                  />
                </div>
              </td>
              <td className="px-6 py-4 text-sm text-gray-300">{user.username}</td>
              <td className="px-6 py-4 text-sm text-gray-300">{user.email}</td>
              <td className="px-6 py-4 text-sm text-gray-300">{user.is_admin ? "Admin" : "User"}</td>
              <td className="px-6 py-4 text-sm">
                <span
                  className={`px-2 py-1 text-xs font-semibold rounded-md ${user.is_verified
                    ? "bg-green-600 text-white"
                    : "bg-red-600 text-white"
                    }`}
                >
                  {user.is_verified ? "Verified" : "Unverified"}
                </span>
              </td>
              <td className="px-6 py-4 text-sm">
                <button className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm">
                  Edit
                </button>
                <button className="bg-red-600 text-white px-4 py-2 rounded-md text-sm ml-2" onClick={() => {
                  if (confirm("Are you sure you'd like to delete this user?")) {
                    fetch(`https://repotor.onrender.com/users/${user.id}`, {
                      method: "DELETE",
                      credentials: "include"
                    })
                      .then((r) => {
                        if (r.ok) {
                          alert("User successfully deleted!")
                          fetchUsers()
                        }
                      })
                  }
                }}>
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Image Popup Modal */}
      {selectedImage && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex justify-center items-center z-50">
          <div className="relative">
            <button
              onClick={closePopup}
              className="absolute top-0 right-0 text-white text-2xl p-2"
            >
              ×
            </button>
            <img
              src={selectedImage}
              alt="Full view"
              className="max-w-full max-h-full object-contain"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default UsersPage;
