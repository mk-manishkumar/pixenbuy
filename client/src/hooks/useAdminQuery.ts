import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@clerk/clerk-react";
import backendApi from "@/api/backendApi";

interface ProductStat {
  productId: number;
  title: string;
  price: number;
  category: string;
  totalQuantity: number;
  totalRevenue: number;
}

interface DashboardStats {
  totalUsers: number;
  totalProducts: number;
  totalOrders: number;
  totalItemsPurchased: number;
  totalEarnings: number;
  productStats: ProductStat[];
}

/**
 * Fetches admin dashboard statistics.
 */
export const useDashboardStats = () => {
  const { isSignedIn } = useAuth();

  return useQuery<DashboardStats>({
    queryKey: ["admin", "dashboard"],
    queryFn: async () => {
      const { data } = await backendApi.get("/api/v1/admin/dashboard");
      return data;
    },
    enabled: !!isSignedIn,
    staleTime: 1000 * 60 * 2, // 2 minutes — dashboard data doesn't need to be real-time
  });
};

export type { DashboardStats, ProductStat };
