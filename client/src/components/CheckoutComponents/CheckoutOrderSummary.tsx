import React from "react";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface Props {
  totalItems: number;
  totalCost: number;
  shippingCost: number;
  setShippingCost: (v: number) => void;
  handlePlaceOrder: () => void;
  isProcessing: boolean;
}

const CheckoutOrderSummary: React.FC<Props> = ({
  totalItems,
  totalCost,
  shippingCost,
  setShippingCost,
  handlePlaceOrder,
  isProcessing
}) => {
  return (
    <div className="lg:w-1/3 w-full border rounded-md p-6 bg-gray-50">
      <h3 className="text-xl font-semibold mb-4">Order Summary</h3>

      <div className="flex justify-between mb-2 text-sm">
        <span>Items ({totalItems})</span>
        <span className="font-medium">${totalCost.toFixed(2)}</span>
      </div>

      <div className="mb-4">
        <Label className="block mb-1 text-sm font-medium">Shipping</Label>
        <select className="w-full border rounded px-3 py-2 text-sm cursor-pointer" onChange={(e) => setShippingCost(Number(e.target.value))}>
          <option value={10}>Fast Shipping - $10.00</option>
          <option value={0}>Free Shipping - $0.00</option>
        </select>
      </div>

      <div className="mb-4">
        <Label className="block mb-1 text-sm font-medium">Promo Code</Label>
        <Input type="text" placeholder="Enter your code" />
        <Button className="w-full bg-red-500 hover:bg-red-600 cursor-pointer mt-2 select-none">APPLY</Button>
      </div>

      <hr className="my-4" />

      <div className="flex justify-between text-lg font-semibold mb-4">
        <span>Total Cost</span>
        <span>${(totalCost + shippingCost).toFixed(2)}</span>
      </div>

      <Button onClick={handlePlaceOrder} disabled={isProcessing} className="w-full text-lg cursor-pointer select-none bg-indigo-500 hover:bg-indigo-600">
        {isProcessing ? "PROCESSING..." : "PLACE ORDER"}
      </Button>
    </div>
  );
};

export default CheckoutOrderSummary;
