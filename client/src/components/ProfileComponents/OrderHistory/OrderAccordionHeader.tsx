import React from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import type { Order } from "@/hooks/useOrderQuery";

interface Props {
  order: Order;
  expandedOrder: string | null;
  toggleOrder: (orderId: string) => void;
}

const getStatusBadgeColor = (status: string) => {
  if (status === "placed") return "bg-yellow-100 text-yellow-700";
  if (status === "delivered") return "bg-green-100 text-green-700";
  return "bg-blue-100 text-blue-700";
};

const OrderAccordionHeader: React.FC<Props> = ({ order, expandedOrder, toggleOrder }) => {
  return (
    <button
      onClick={() => toggleOrder(order._id)}
      className="w-full flex items-center justify-between px-6 py-4 bg-gradient-to-r from-gray-50 to-white cursor-pointer"
    >
      <div className="flex items-center gap-6 text-sm">
        <div>
          <span className="text-gray-500">Order</span>
          <p className="font-mono font-semibold text-xs">#{order._id.slice(-8).toUpperCase()}</p>
        </div>
        <div className="hidden sm:block">
          <span className="text-gray-500">Date</span>
          <p className="font-medium">{new Date(order.createdAt).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" })}</p>
        </div>
        <div>
          <span className="text-gray-500">Items</span>
          <p className="font-medium">{order.totalItems}</p>
        </div>
        <div>
          <span className="text-gray-500">Total</span>
          <p className="font-bold text-indigo-600">${(order.totalPrice + order.shippingCost).toFixed(2)}</p>
        </div>
      </div>
      <div className="flex items-center gap-3">
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusBadgeColor(order.status)}`}>
          {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
        </span>
        {expandedOrder === order._id ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
      </div>
    </button>
  );
};

export default OrderAccordionHeader;
