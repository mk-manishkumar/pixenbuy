import { useMutation, useQueryClient } from "@tanstack/react-query";
import backendApi from "@/api/backendApi";
import type { CartResponse } from "./useCartQuery";

interface AddItemPayload {
  productId: number;
  title: string;
  price: number;
  brand: string;
  quantity: number;
  image: string;
}

interface UpdateItemPayload {
  productId: number;
  quantity: number;
}

/**
 * Mutation hook to add an item to the cart.
 * Invalidates the cart query on success so all consumers get fresh data.
 */
export const useAddToCart = () => {
  const queryClient = useQueryClient();

  return useMutation<CartResponse, Error, AddItemPayload>({
    mutationFn: async (item) => {
      const { data } = await backendApi.post("/api/v1/cart/items", item);
      return data;
    },
    onSuccess: (data) => {
      queryClient.setQueryData(["cart"], data);
    },
  });
};

/**
 * Mutation hook to update an item's quantity.
 */
export const useUpdateCartItem = () => {
  const queryClient = useQueryClient();

  return useMutation<CartResponse, Error, UpdateItemPayload>({
    mutationFn: async ({ productId, quantity }) => {
      const { data } = await backendApi.patch(
        `/api/v1/cart/items/${productId}`,
        { quantity }
      );
      return data;
    },
    onSuccess: (data) => {
      queryClient.setQueryData(["cart"], data);
    },
  });
};

/**
 * Mutation hook to remove an item from the cart.
 */
export const useRemoveFromCart = () => {
  const queryClient = useQueryClient();

  return useMutation<CartResponse, Error, number>({
    mutationFn: async (productId) => {
      const { data } = await backendApi.delete(
        `/api/v1/cart/items/${productId}`
      );
      return data;
    },
    onSuccess: (data) => {
      queryClient.setQueryData(["cart"], data);
    },
  });
};

/**
 * Mutation hook to clear the entire cart.
 */
export const useClearCart = () => {
  const queryClient = useQueryClient();

  return useMutation<CartResponse, Error, void>({
    mutationFn: async () => {
      const { data } = await backendApi.delete("/api/v1/cart");
      return data;
    },
    onSuccess: (data) => {
      queryClient.setQueryData(["cart"], data);
    },
  });
};
