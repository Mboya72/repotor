import React from 'react';

const DashboardPage = () => {
  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold text-white mb-4">Dashboard</h2>

      {/* Overview Section */}
      <div className="bg-gray-800 rounded-lg shadow-sm p-6 mb-6">
        <h3 className="text-xl font-medium text-white">Overview</h3>
        <p className="text-sm text-gray-400 mt-2">Welcome to the dashboard!</p>
        <p className="text-sm text-gray-400 mt-2">
          Here you can view and manage posts, statistics, and more.
        </p>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gray-800 rounded-lg shadow-sm p-6">
          <h3 className="text-xl font-medium text-white">Manage Posts</h3>
          <p className="text-sm text-gray-400 mt-2">
            Quickly review and update post statuses.
          </p>
          <button className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm mt-4">
            View Posts
          </button>
        </div>

        <div className="bg-gray-800 rounded-lg shadow-sm p-6">
          <h3 className="text-xl font-medium text-white">Reports</h3>
          <p className="text-sm text-gray-400 mt-2">
            View reports and insights on the flagged content.
          </p>
          <button className="bg-green-600 text-white px-4 py-2 rounded-md text-sm mt-4">
            View Reports
          </button>
        </div>

        <div className="bg-gray-800 rounded-lg shadow-sm p-6">
          <h3 className="text-xl font-medium text-white">User Management</h3>
          <p className="text-sm text-gray-400 mt-2">
            Manage users and their permissions.
          </p>
          <button className="bg-yellow-600 text-white px-4 py-2 rounded-md text-sm mt-4">
            Manage Users
          </button>
        </div>
      </div>

      {/* Statistics Section */}
      <div className="bg-gray-800 rounded-lg shadow-sm p-6 mt-6">
        <h3 className="text-xl font-medium text-white">Statistics</h3>
        <p className="text-sm text-gray-400 mt-2">
          Check out the latest stats for flagged content and user activity.
        </p>

        <div className="mt-4 space-y-4">
          <div className="bg-gray-700 p-4 rounded-lg">
            <h4 className="text-sm text-gray-200">Flagged Posts</h4>
            <p className="text-lg text-white">123 Posts</p>
          </div>

          <div className="bg-gray-700 p-4 rounded-lg">
            <h4 className="text-sm text-gray-200">Resolved Posts</h4>
            <p className="text-lg text-white">85 Posts</p>
          </div>

          <div className="bg-gray-700 p-4 rounded-lg">
            <h4 className="text-sm text-gray-200">Rejected Posts</h4>
            <p className="text-lg text-white">12 Posts</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
