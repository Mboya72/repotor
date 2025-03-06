import React from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

// Register chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const DashboardPage: React.FC = () => {
  // Sample chart data with "Rejected Posts" added
  const data = {
    labels: ["January", "February", "March", "April", "May", "June"],
    datasets: [
      {
        label: "Flagged Posts",
        data: [65, 59, 80, 81, 56, 55],
        borderColor: "rgba(75, 192, 192, 1)", // teal
        backgroundColor: "rgba(75, 192, 192, 0.2)", // light teal
        borderWidth: 2,
        // Make the rectangles rounded
        borderRadius: 10, // Rounded corners for the bars
        fill: true, // Fill the area under the line (optional)
      },
      {
        label: "Resolved Posts",
        data: [28, 48, 40, 19, 86, 27],
        borderColor: "rgba(153, 102, 255, 1)", // purple
        backgroundColor: "green",
        borderWidth: 2,
        borderRadius: 10, // Rounded corners for the bars
        fill: true, // Fill the area under the line (optional)
      },
      {
        label: "Rejected Posts",
        data: [12, 22, 18, 27, 14, 8],
        backgroundColor: "#F78183",
        borderColor: "#EF0307",
        borderWidth: 2,
        borderRadius: 10, // Rounded corners for the bars
        fill: true, // Fill the area under the line (optional)
      },
    ],
  };
  

  // Chart options
  const options = {
    responsive: true,
    plugins: {
      title: {
        display: true,
        text: "Posts Statistics",
      },
    },
    scales: {
      y: {
        beginAtZero: true,
      },
    },
    maintainAspectRatio: false, // Important for making the chart scale properly
  };

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
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
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
          <button className="bg-yellow-400 text-white px-4 py-2 rounded-md text-sm mt-4">
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

        {/* Chart and Stats Section */}
        <div className="flex flex-col lg:flex-row p-4 space-y-6 lg:space-y-0">
          {/* Chart Container */}
          <div className="w-full lg:w-2/3 mb-6 lg:mb-0">
            <div className="relative w-full" style={{ height: "300px" }}>
              <Line data={data} options={options} />
            </div>
          </div>

          {/* Stats Section */}
          <div className=" ml-0 lg:ml-4 p-4 space-y-4 w-full lg:w-1/3">
            <div className="bg-[#f0ebd8] p-4 rounded-lg">
              <h4 className="text-sm text-gray-900">Flagged Posts</h4>
              <p className="text-lg text-gray-900">123 Posts</p>
            </div>

            <div className="bg-[#f0ebd8] p-4 rounded-lg">
              <h4 className="text-sm text-gray-900">Resolved Posts</h4>
              <p className="text-lg text-gray-900">85 Posts</p>
            </div>

            <div className="bg-[#f0ebd8] p-4 rounded-lg">
              <h4 className="text-sm text-gray-900">Rejected Posts</h4>
              <p className="text-lg text-gray-900">12 Posts</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
