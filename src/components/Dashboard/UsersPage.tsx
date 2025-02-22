import React from "react";

const UsersPage = () => {
  const users = [
    { id: 1, name: "John Doe", email: "john.doe@example.com", role: "Admin" },
    { id: 2, name: "Jane Smith", email: "jane.smith@example.com", role: "User" },
    { id: 3, name: "Mike Johnson", email: "mike.johnson@example.com", role: "User" },
  ];

  return (
    <div className="bg-gray-800 p-6 rounded-lg shadow-sm">
      <h2 className="text-2xl font-semibold text-white mb-4">Users</h2>
      <table className="min-w-full bg-gray-700 rounded-lg">
        <thead>
          <tr className="text-left">
            <th className="px-6 py-3 text-sm font-medium text-white">Name</th>
            <th className="px-6 py-3 text-sm font-medium text-white">Email</th>
            <th className="px-6 py-3 text-sm font-medium text-white">Role</th>
            <th className="px-6 py-3 text-sm font-medium text-white">Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id} className="border-t border-gray-600">
              <td className="px-6 py-4 text-sm text-gray-300">{user.name}</td>
              <td className="px-6 py-4 text-sm text-gray-300">{user.email}</td>
              <td className="px-6 py-4 text-sm text-gray-300">{user.role}</td>
              <td className="px-6 py-4 text-sm">
                <button className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm">
                  Edit
                </button>
                <button className="bg-red-600 text-white px-4 py-2 rounded-md text-sm ml-2">
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UsersPage;
