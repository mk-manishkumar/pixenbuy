import { useMutation } from "@tanstack/react-query";
import { backendApi } from "@/api/backendApi";

interface CreateRazorpayOrderPayload {
  orderId: string;
}

interface CreateRazorpayOrderResponse {
  orderId: string;
  amount: number;
  currency: string;
}

export const useCreateRazorpayOrder = () => {
  return useMutation({
    mutationFn: async (payload: CreateRazorpayOrderPayload): Promise<CreateRazorpayOrderResponse> => {
      const response = await backendApi.post("/payments/create-order", payload);
      return response.data;
    },
  });
};

interface VerifyPaymentPayload {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
  orderId: string;
}

export const useVerifyPayment = () => {
  return useMutation({
    mutationFn: async (payload: VerifyPaymentPayload) => {
      const response = await backendApi.post("/payments/verify-payment", payload);
      return response.data;
    },
  });
};
