import { Footer } from "@/components/SharedComponents/Footer";
import Navbar from "@/components/SharedComponents/Navbar";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useCart } from "@/context/CartContext";

const Checkout: React.FC = () => {
  const { cartItems } = useCart();
  const [shippingCost, setShippingCost] = useState(10);

  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const totalCost = cartItems.reduce((sum, item) => sum + item.quantity * item.price, 0);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <div className="flex-grow bg-gray-50 py-10 px-4 sm:px-6 lg:px-16">
        <div className="max-w-7xl mx-auto bg-white p-6 shadow-sm rounded-lg flex flex-col lg:flex-row gap-8">
          {/* Left - Customer Details */}
          <div className="flex-1">
            <h2 className="text-2xl font-bold mb-6">Customer Details</h2>
            <form className="grid grid-cols-1 gap-4">
              <div>
                <Label className="block mb-1">Name</Label>
                <input type="text" className="w-full border px-3 py-2 rounded text-sm" placeholder="Enter your name" />
              </div>
              <div>
                <Label className="block mb-1">Email</Label>
                <input type="email" className="w-full border px-3 py-2 rounded text-sm" placeholder="you@example.com" />
              </div>
              <div>
                <Label className="block mb-1">Mobile Number</Label>
                <input type="tel" className="w-full border px-3 py-2 rounded text-sm" placeholder="+1 234 567 8901" />
              </div>
              <div>
                <Label className="block mb-1">Address</Label>
                <textarea rows={4} className="w-full border px-3 py-2 rounded text-sm" placeholder="123 Street, City, Country" />
              </div>
            </form>
          </div>

          {/* Right - Order Summary */}
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
              <input type="text" placeholder="Enter your code" className="w-full border rounded px-3 py-2 text-sm mb-2" />
              <Button className="w-full bg-red-500 hover:bg-red-600 text-white text-sm">APPLY</Button>
            </div>

            <hr className="my-4" />

            <div className="flex justify-between text-lg font-semibold mb-4">
              <span>Total Cost</span>
              <span>${(totalCost + shippingCost).toFixed(2)}</span>
            </div>

            <Button className="w-full bg-indigo-500 hover:bg-indigo-600 text-white text-lg">PLACE ORDER</Button>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Checkout;
