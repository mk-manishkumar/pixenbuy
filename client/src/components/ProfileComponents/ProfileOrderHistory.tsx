import React from "react";
import { Package } from "lucide-react";
import type { Order, OrdersResponse } from "@/hooks/useOrderQuery";
import OrderAccordionHeader from "./OrderHistory/OrderAccordionHeader";
import OrderAccordionBody from "./OrderHistory/OrderAccordionBody";
import OrderPagination from "./OrderHistory/OrderPagination";

interface Props {
  ordersLoading: boolean;
  orderData: OrdersResponse | undefined;
  setPage: React.Dispatch<React.SetStateAction<number>>;
  expandedOrder: string | null;
  toggleOrder: (orderId: string) => void;
}

const ProfileOrderHistory: React.FC<Props> = ({
  ordersLoading,
  orderData,
  setPage,
  expandedOrder,
  toggleOrder,
}) => {
  if (ordersLoading) {
    return <p className="text-gray-500">Loading orders...</p>;
  }

  if (!orderData || orderData.orders.length === 0) {
    return (
      <div className="text-center py-12">
        <Package size={48} className="mx-auto text-gray-300 mb-4" />
        <p className="text-gray-500 text-lg">No purchases yet</p>
        <p className="text-gray-400 text-sm mt-1">Your order history will appear here</p>
      </div>
    );
  }

  return (
    <>
      <div className="space-y-3">
        {orderData.orders.map((order: Order) => (
          <div key={order._id} className="border rounded-xl overflow-hidden transition-shadow hover:shadow-md">
            {/* Accordion Header */}
            <OrderAccordionHeader
              order={order}
              expandedOrder={expandedOrder}
              toggleOrder={toggleOrder}
            />

            {/* Accordion Body */}
            {expandedOrder === order._id && (
              <OrderAccordionBody order={order} />
            )}
          </div>
        ))}
      </div>

      {/* Pagination */}
      <OrderPagination
        currentPage={orderData.pagination.currentPage}
        totalPages={orderData.pagination.totalPages}
        setPage={setPage}
      />
    </>
  );
};

export default ProfileOrderHistory;
