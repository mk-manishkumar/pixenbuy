import React from "react";
import { Users, Package, ShoppingBag, DollarSign } from "lucide-react";
import type { DashboardStats } from "@/hooks/useAdminQuery";

interface Props {
  stats: DashboardStats;
}

const DashboardStatsCards: React.FC<Props> = ({ stats }) => {
  return (
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
  );
};

export default DashboardStatsCards;
