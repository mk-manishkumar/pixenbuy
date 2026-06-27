import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@clerk/clerk-react";
import type { UserProfile } from "./useUserQuery";
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
      // 1. Fetch the purchase counts and user stats from your backend
      const { data } = await backendApi.get("/api/v1/admin/dashboard");
      
      // 2. Fetch the products from FakeStoreAPI directly from the user's browser (bypasses Vercel IP blocks)
      const productsRes = await fetch("https://fakestoreapi.com/products");
      const products = await productsRes.json();

      // 3. Merge them together exactly like the backend used to
      const productStats = products.map((product: { id: number; title: string; price: number; category: string }) => {
        const purchaseData = data.productPurchaseCounts.find(
          (p: { _id: number; totalQuantity: number; totalRevenue: number }) => p._id === product.id
        );
        return {
          productId: product.id,
          title: product.title,
          price: product.price,
          category: product.category,
          totalQuantity: purchaseData ? purchaseData.totalQuantity : 0,
          totalRevenue: purchaseData
            ? Math.round(purchaseData.totalRevenue * 100) / 100
            : 0,
        };
      });

      return {
        totalUsers: data.totalUsers,
        totalProducts: products.length,
        totalOrders: data.totalOrders,
        totalItemsPurchased: data.totalItemsPurchased,
        totalEarnings: data.totalEarnings,
        productStats,
      };
    },
    enabled: !!isSignedIn,
    staleTime: 1000 * 60 * 2, // 2 minutes — dashboard data doesn't need to be real-time
  });
};

export const useGetAllUsers = () => {
  const { isSignedIn } = useAuth();

  return useQuery<UserProfile[]>({
    queryKey: ["admin", "users"],
    queryFn: async () => {
      const { data } = await backendApi.get("/api/v1/admin/users");
      return data;
    },
    enabled: !!isSignedIn,
  });
};

export interface AdminOrder {
  _id: string;
  userId: {
    _id: string;
    name: string;
    email: string;
  };
  items: {
    title: string;
    quantity: number;
    price: number;
  }[];
  totalPrice: number;
  shippingAddress: string;
  createdAt: string;
}

export const useAdminOrdersQuery = () => {
  const { isSignedIn } = useAuth();

  return useQuery<AdminOrder[]>({
    queryKey: ["admin", "orders"],
    queryFn: async () => {
      const { data } = await backendApi.get("/api/v1/admin/orders");
      return data;
    },
    enabled: !!isSignedIn,
  });
};

export type { DashboardStats, ProductStat };
