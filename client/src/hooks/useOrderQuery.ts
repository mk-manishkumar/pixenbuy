import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@clerk/clerk-react";
import backendApi from "@/api/backendApi";

interface OrderItem {
  productId: number;
  title: string;
  price: number;
  brand: string;
  quantity: number;
}

interface Order {
  _id: string;
  userId: string;
  items: OrderItem[];
  totalItems: number;
  totalPrice: number;
  shippingCost: number;
  shippingAddress: string;
  status: string;
  createdAt: string;
  updatedAt: string;
}

interface OrdersResponse {
  orders: Order[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalOrders: number;
  };
}

interface PlaceOrderPayload {
  shippingCost: number;
  shippingAddress: string;
}

/**
 * Mutation to place an order (snapshot cart → order, clear cart).
 */
export const usePlaceOrder = () => {
  const queryClient = useQueryClient();

  return useMutation<Order, Error, PlaceOrderPayload>({
    mutationFn: async (payload) => {
      const { data } = await backendApi.post("/api/v1/orders", payload);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cart"] });
      queryClient.invalidateQueries({ queryKey: ["orders"] });
    },
  });
};

/**
 * Paginated query for the user's order history.
 */
export const useOrderHistory = (page: number = 1) => {
  const { isSignedIn } = useAuth();

  return useQuery<OrdersResponse>({
    queryKey: ["orders", page],
    queryFn: async () => {
      const { data } = await backendApi.get(
        `/api/v1/orders?page=${page}&limit=5`
      );
      return data;
    },
    enabled: !!isSignedIn,
  });
};

export type { Order, OrderItem, OrdersResponse };
