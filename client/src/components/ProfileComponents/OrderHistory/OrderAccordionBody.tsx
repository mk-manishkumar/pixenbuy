import React from "react";
import { MapPin } from "lucide-react";
import type { Order } from "@/hooks/useOrderQuery";

interface Props {
  order: Order;
}

const OrderAccordionBody: React.FC<Props> = ({ order }) => {
  return (
    <div className="px-6 py-4 border-t bg-white">
      <div className="space-y-3">
        {order.items.map((item) => (
          <div key={item.productId} className="flex justify-between items-center text-sm py-2 border-b last:border-0">
            <div>
              <p className="font-medium">{item.title}</p>
              <p className="text-gray-500 text-xs">{item.brand} • Qty: {item.quantity}</p>
            </div>
            <p className="font-semibold">${(item.price * item.quantity).toFixed(2)}</p>
          </div>
        ))}
      </div>
      <div className="mt-4 pt-3 border-t text-sm space-y-1">
        <div className="flex justify-between text-gray-600">
          <span>Subtotal</span>
          <span>${order.totalPrice.toFixed(2)}</span>
        </div>
        <div className="flex justify-between text-gray-600">
          <span>Shipping</span>
          <span>${order.shippingCost.toFixed(2)}</span>
        </div>
        <div className="flex justify-between font-bold text-base pt-1">
          <span>Total</span>
          <span className="text-indigo-600">${(order.totalPrice + order.shippingCost).toFixed(2)}</span>
        </div>
        <p className="text-gray-400 text-xs pt-2">
          <MapPin size={12} className="inline mr-1" />
          {order.shippingAddress}
        </p>
      </div>
    </div>
  );
};

export default OrderAccordionBody;
