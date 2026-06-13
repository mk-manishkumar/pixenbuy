import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@clerk/clerk-react";
import backendApi from "@/api/backendApi";
import { useUserQuery } from "./useUserQuery";

export interface CartItem {
  productId: number;
  title: string;
  price: number;
  brand: string;
  quantity: number;
  image: string;
}

export interface CartResponse {
  items: CartItem[];
  totalItems: number;
  totalPrice: number;
}

const fetchCart = async (): Promise<CartResponse> => {
  const { data } = await backendApi.get("/api/v1/cart");
  return data;
};

/**
 * Fetches the current user's cart from the backend.
 * Only runs when the user is signed in and has a "user" role.
 * Returns empty cart data when not authenticated or if admin.
 */
export const useCartQuery = () => {
  const { isSignedIn } = useAuth();
  const { data: user } = useUserQuery();
  const isRegularUser = user?.role === "user";

  return useQuery<CartResponse>({
    queryKey: ["cart"],
    queryFn: fetchCart,
    enabled: !!isSignedIn && isRegularUser,
    placeholderData: { items: [], totalItems: 0, totalPrice: 0 },
    retry: false,
  });
};
