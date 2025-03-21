"use client";
import React, { useState, useEffect } from "react";
import {
  FiHome,
  FiPieChart,
  FiFileText,
  FiSettings,
  FiUser,
  FiLogOut,
  FiMenu,
} from "react-icons/fi";

// Import the page components
import DashboardPage from "./DashboardPage";
import AllPostsPage from "./AllPostsPage";
import RedflagsPage from "./RedflagsPage";
import InterventionsPage from "./InterventionsPage";
import InvestigationPage from "./InvestigationPage";
import RejectedPage from "./RejectedPage";
import ResolvedPage from "./ResolvedPage";
import UsersPage from "./UsersPage";  // Import UsersPage
import { Record, User } from "../types";
import { useRouter } from "next/navigation";

interface props {
  user: User
}

const Dashboard: React.FC<props> = ({ user }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [activeItem, setActiveItem] = useState("Dashboard");
  const [isMobile, setIsMobile] = useState(false);
  
  const [allPosts, setAllPosts] = useState<Record[]>([])

  useEffect(() => {
    // Fetch posts from backend
    fetch("https://repotor.onrender.com/records")
      .then((r) => r.json())
      .then((records) => {
        setAllPosts(records);
        console.log(records)
      })
      .catch((err) => console.log(err));
  }, []);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth < 768) {
        setIsSidebarOpen(false);
      }
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  const navItems = [
    { name: "Dashboard", icon: <FiHome size={20} /> },
    { name: "Users", icon: <FiUser size={20} /> },  // Added Users page item
    { name: "All Posts", icon: <FiFileText size={20} /> },
    { name: "Redflags", icon: <FiPieChart size={20} /> },
    { name: "Interventions", icon: <FiSettings size={20} /> },
    { name: "Investigation", icon: <FiUser size={20} /> },
    { name: "Rejected", icon: <FiFileText size={20} /> },
    { name: "Resolved", icon: <FiSettings size={20} /> },
  ];

  const renderPage = () => {
    switch (activeItem) {
      case "Dashboard":
        return <DashboardPage />;
      case "All Posts":
        return <AllPostsPage posts={allPosts} />;
      case "Redflags":
        return <RedflagsPage posts={allPosts.filter(post => post.type==="red-flag")}/>;
      case "Interventions":
        return <InterventionsPage posts={allPosts.filter(post => post.type==="intervention")}/>;
      case "Investigation":
        return <InvestigationPage posts={allPosts.filter(post => post.status==="under investigation")}/>;
      case "Rejected":
        return <RejectedPage posts={allPosts.filter(post => post.status==="rejected")}/>;
      case "Resolved":
        return <ResolvedPage posts={allPosts.filter(post => post.status==="resolved")}/>;
      case "Users":
        return <UsersPage />;  // Return UsersPage
      default:
        return <DashboardPage />;
    }
  };

  const router = useRouter()
  return (
    <div className="flex h-screen overflow-hidden bg-gray-900">
      {isMobile && isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-20"
          onClick={toggleSidebar}
        />
      )}

      <aside
        className={`${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}
          ${isMobile ? "fixed" : "relative"}
          w-64 h-full bg-gray-800 transform transition-transform duration-300 ease-in-out z-30
          border-r border-gray-700 flex flex-col`}
      >
        <div className="flex flex-col items-center p-6 border-b border-gray-700">
          <img src="/R 1.svg" alt="Logo" className="h-12 w-auto mb-2" />
          <h3 className="text-white font-medium">Repotor</h3>
        </div>

        <nav className="flex-1 overflow-y-auto py-4">
          <ul className="space-y-1">
            {navItems.map((item) => (
              <li key={item.name}>
                <button
                  onClick={() => setActiveItem(item.name)}
                  className={`w-full flex items-center px-4 py-2.5 text-sm
                    ${activeItem === item.name
                      ? "bg-[#FB6535] text-gray-800"
                      : "text-gray-300 hover:bg-gray-700"
                    }`}
                >
                  <span className="mr-3">{item.icon}</span>
                  <span>{item.name}</span>
                </button>
              </li>
            ))}
          </ul>
        </nav>

        {/* User Info & Logout Button at the bottom */}
        <div className="mt-auto border-t border-gray-700 p-4">
          <div className="flex items-center space-x-3 mb-4 px-4 py-2">
            <img
              src={user.profile_picture || "/icons/user.png"}
              alt="Profile"
              className="h-8 w-8 rounded-full"
            />
            <div>
              <p className="text-sm text-white">{user.username}</p>
              <p className="text-xs text-gray-400">Administrator</p>
            </div>
          </div>
          <button className="w-full flex items-center px-4 py-2 text-sm text-red-400 hover:bg-gray-700 rounded-md" onClick={() => {
            if (confirm("Are you sure you'd like to logout?")) {
              fetch(`https://repotor.onrender.com/logout`, {
                method: "DELETE",
                credentials: "include",
              })
                .then((r) => {
                  if (r.ok) {
                    window.location.reload();
                  }
                })
                .catch((err) => console.error(err));
            }
          }}>
            <FiLogOut className="mr-3" />
            Logout
          </button>
        </div>
      </aside>

      <main className="flex-1 overflow-y-auto">
        <header className="bg-gray-800 shadow-sm">
          <div className="flex items-center justify-between px-6 py-4">
            <div className="flex items-center space-x-4">
              <button
                onClick={toggleSidebar}
                className="p-2 rounded-md hover:bg-gray-700"
              >
                <FiMenu className="h-6 w-6 text-gray-400" />
              </button>
              <h1 className="text-2xl font-semibold text-white">
                {activeItem}
              </h1>
            </div>
          </div>
        </header>

        <div className="p-6">
          {/* Render the page based on activeItem */}
          {renderPage()}
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
