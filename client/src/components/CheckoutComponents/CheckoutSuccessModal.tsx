import React from "react";
import { Button } from "@/components/ui/button";

interface Props {
  showPopup: boolean;
  name: string;
  finalCost: number;
  goToHome: () => void;
}

const CheckoutSuccessModal: React.FC<Props> = ({ showPopup, name, finalCost, goToHome }) => {
  if (!showPopup) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white w-[90%] max-w-md p-6 rounded-lg shadow-lg text-center">
        <h2 className="text-xl font-bold mb-4">Order Placed Successfully!</h2>
        <p className="text-gray-600 mb-6">
          Thank you {name} for your purchase. Your payment of ${finalCost.toFixed(2)} was successful! We will ship your items shortly.
        </p>
        <Button onClick={goToHome} className="bg-green-600 hover:bg-green-700 cursor-pointer px-4 py-2 rounded">
          Go to Home
        </Button>
      </div>
    </div>
  );
};

export default CheckoutSuccessModal;
