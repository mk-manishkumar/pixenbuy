import React from "react";
import { TrendingUp, BarChart3 } from "lucide-react";
import type { DashboardStats, ProductStat } from "@/hooks/useAdminQuery";

interface Props {
  stats: DashboardStats;
}

const DashboardProductsTable: React.FC<Props> = ({ stats }) => {
  return (
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
  );
};

export default DashboardProductsTable;
