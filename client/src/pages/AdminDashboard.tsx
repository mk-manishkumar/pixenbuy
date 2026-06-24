import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@clerk/clerk-react";
import Navbar from "@/components/SharedComponents/Navbar";
import { Footer } from "@/components/SharedComponents/Footer";
import { useUserQuery } from "@/hooks/useUserQuery";
import { useDashboardStats } from "@/hooks/useAdminQuery";
import DashboardStatsCards from "@/components/DashboardComponents/DashboardStatsCards";
import DashboardProductsTable from "@/components/DashboardComponents/DashboardProductsTable";

const AdminDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { isSignedIn } = useAuth();
  const { data: user, isLoading: userLoading } = useUserQuery();
  const { data: stats, isLoading: statsLoading } = useDashboardStats();

  if (!isSignedIn) {
    navigate("/sign-in");
    return null;
  }

  if (userLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow flex items-center justify-center">
          <p className="text-gray-500 text-lg">Loading...</p>
        </main>
        <Footer />
      </div>
    );
  }

  if (user?.role !== "admin") {
    navigate("/");
    return null;
  }

  const renderDashboardContent = () => {
    if (statsLoading) {
      return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="bg-white rounded-2xl p-6 shadow-sm border animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-1/2 mb-3" />
              <div className="h-8 bg-gray-200 rounded w-3/4" />
            </div>
          ))}
        </div>
      );
    }

    if (!stats) {
      return <p className="text-center text-gray-500">Failed to load dashboard data</p>;
    }

    return (
      <>
        <DashboardStatsCards stats={stats} />
        <DashboardProductsTable stats={stats} />

        <div className="mt-8 bg-white rounded-2xl shadow-sm border overflow-hidden hover:shadow-md transition-shadow">
          <div 
            onClick={() => navigate('/admin/users')}
            className="p-6 flex items-center justify-between cursor-pointer group border-b border-gray-100"
          >
            <div>
              <h2 className="text-xl font-semibold text-gray-800 group-hover:text-indigo-600 transition-colors">Registered Users Directory</h2>
              <p className="text-gray-500 mt-1">View contact information and details of all {stats.totalUsers} registered users.</p>
            </div>
            <div className="text-indigo-500 bg-indigo-50 p-3 rounded-full group-hover:bg-indigo-100 transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </div>
          
          <div 
            onClick={() => navigate('/admin/shipments')}
            className="p-6 flex items-center justify-between cursor-pointer group"
          >
            <div>
              <h2 className="text-xl font-semibold text-gray-800 group-hover:text-indigo-600 transition-colors">Shipment & Order Details</h2>
              <p className="text-gray-500 mt-1">Track customer orders, products purchased, and shipping addresses.</p>
            </div>
            <div className="text-indigo-500 bg-indigo-50 p-3 rounded-full group-hover:bg-indigo-100 transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
            </div>
          </div>
        </div>
      </>
    );
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />

      <main className="flex-grow py-10 px-4 sm:px-6 lg:px-16">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
            <p className="text-gray-500 mt-1">Welcome back, {user?.name || "Admin"}. Here's what's happening on Pixenbuy.</p>
          </div>

          {renderDashboardContent()}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default AdminDashboard;
