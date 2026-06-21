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
