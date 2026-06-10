import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@clerk/clerk-react";
import Navbar from "@/components/SharedComponents/Navbar";
import { Footer } from "@/components/SharedComponents/Footer";
import { useUserQuery } from "@/hooks/useUserQuery";
import { useDashboardStats } from "@/hooks/useAdminQuery";
import type { ProductStat } from "@/hooks/useAdminQuery";
import { Users, Package, ShoppingBag, DollarSign, TrendingUp, BarChart3 } from "lucide-react";

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

          {statsLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="bg-white rounded-2xl p-6 shadow-sm border animate-pulse">
                  <div className="h-4 bg-gray-200 rounded w-1/2 mb-3" />
                  <div className="h-8 bg-gray-200 rounded w-3/4" />
                </div>
              ))}
            </div>
          ) : stats ? (
            <>
              {/* Stat Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
                <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-6 text-white shadow-lg shadow-blue-500/20">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-blue-100 text-sm font-medium">Registered Users</p>
                      <p className="text-4xl font-bold mt-2">{stats.totalUsers}</p>
                    </div>
                    <div className="bg-white/20 p-3 rounded-xl">
                      <Users size={28} />
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-2xl p-6 text-white shadow-lg shadow-emerald-500/20">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-emerald-100 text-sm font-medium">Total Products</p>
                      <p className="text-4xl font-bold mt-2">{stats.totalProducts}</p>
                    </div>
                    <div className="bg-white/20 p-3 rounded-xl">
                      <Package size={28} />
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl p-6 text-white shadow-lg shadow-orange-500/20">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-orange-100 text-sm font-medium">Items Purchased</p>
                      <p className="text-4xl font-bold mt-2">{stats.totalItemsPurchased}</p>
                      <p className="text-orange-200 text-xs mt-1">{stats.totalOrders} orders</p>
                    </div>
                    <div className="bg-white/20 p-3 rounded-xl">
                      <ShoppingBag size={28} />
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-violet-500 to-violet-600 rounded-2xl p-6 text-white shadow-lg shadow-violet-500/20">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-violet-100 text-sm font-medium">Total Earnings</p>
                      <p className="text-4xl font-bold mt-2">${stats.totalEarnings.toFixed(2)}</p>
                    </div>
                    <div className="bg-white/20 p-3 rounded-xl">
                      <DollarSign size={28} />
                    </div>
                  </div>
                </div>
              </div>

              {/* Products Table */}
              <div className="bg-white rounded-2xl shadow-sm border overflow-hidden">
                <div className="px-6 py-5 border-b flex items-center justify-between">
                  <h2 className="text-xl font-bold flex items-center gap-2">
                    <BarChart3 size={22} /> Product Performance
                  </h2>
                  <span className="text-sm text-gray-500">{stats.productStats.length} products</span>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50 text-left text-sm text-gray-500">
                      <tr>
                        <th className="px-6 py-3 font-medium">#</th>
                        <th className="px-6 py-3 font-medium">Product</th>
                        <th className="px-6 py-3 font-medium">Category</th>
                        <th className="px-6 py-3 font-medium text-right">Price</th>
                        <th className="px-6 py-3 font-medium text-right">Units Sold</th>
                        <th className="px-6 py-3 font-medium text-right">Revenue</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y">
                      {stats.productStats.map((product: ProductStat, index: number) => (
                        <tr key={product.productId} className="hover:bg-gray-50 transition-colors text-sm">
                          <td className="px-6 py-4 text-gray-400">{index + 1}</td>
                          <td className="px-6 py-4 font-medium text-gray-900 max-w-xs truncate">{product.title}</td>
                          <td className="px-6 py-4">
                            <span className="px-2 py-1 bg-gray-100 rounded-full text-xs capitalize">{product.category}</span>
                          </td>
                          <td className="px-6 py-4 text-right">${product.price.toFixed(2)}</td>
                          <td className="px-6 py-4 text-right">
                            <span className={`font-semibold ${product.totalQuantity > 0 ? "text-emerald-600" : "text-gray-400"}`}>
                              {product.totalQuantity}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-right">
                            <span className={`font-semibold ${product.totalRevenue > 0 ? "text-violet-600" : "text-gray-400"}`}>
                              ${product.totalRevenue.toFixed(2)}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Table Footer */}
                <div className="px-6 py-4 border-t bg-gray-50 flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2 text-gray-600">
                    <TrendingUp size={16} className="text-emerald-500" />
                    <span>
                      <strong>{stats.productStats.filter((p: ProductStat) => p.totalQuantity > 0).length}</strong> of {stats.totalProducts} products have sales
                    </span>
                  </div>
                  <div className="font-bold text-violet-600">
                    Total: ${stats.totalEarnings.toFixed(2)}
                  </div>
                </div>
              </div>
            </>
          ) : (
            <p className="text-center text-gray-500">Failed to load dashboard data</p>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default AdminDashboard;
