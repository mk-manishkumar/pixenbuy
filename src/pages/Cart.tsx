import { Footer } from "@/components/SharedComponents/Footer";
import Navbar from "@/components/SharedComponents/Navbar";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Label } from "@/components/ui/label";

type CartItem = {
  id: number;
  title: string;
  brand: string;
  price: number;
  quantity: number;
};

const Cart: React.FC = () => {
  const [cartItems, setCartItems] = useState<CartItem[]>([
    {
      id: 1,
      title: "Iphone 6S",
      brand: "Apple",
      price: 400,
      quantity: 1,
    },
    {
      id: 2,
      title: "Xiaomi Mi 20000mAh",
      brand: "Xiaomi",
      price: 40,
      quantity: 1,
    },
    {
      id: 3,
      title: "Airpods",
      brand: "Apple",
      price: 150,
      quantity: 1,
    },
    {
      id: 4,
      title: "Airpods",
      brand: "Apple",
      price: 150,
      quantity: 1,
    },
    {
      id: 5,
      title: "Airpods",
      brand: "Apple",
      price: 150,
      quantity: 1,
    },
    {
      id: 7,
      title: "Airpods",
      brand: "Apple",
      price: 150,
      quantity: 1,
    },
    {
      id: 8,
      title: "Airpods",
      brand: "Apple",
      price: 150,
      quantity: 1,
    },
  ]);

  const [shippingCost, setShippingCost] = useState<number>(10);

  const updateQuantity = (id: number, amount: number) => {
    setCartItems((prev) =>
      prev.map((item) =>
        item.id === id
          ? {
              ...item,
              quantity: Math.max(1, item.quantity + amount),
            }
          : item
      )
    );
  };

  const removeItem = (id: number) => {
    setCartItems((prev) => prev.filter((item) => item.id !== id));
  };

  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const totalCost = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <>
      <Navbar />
      <div className="bg-gray-50 py-10 px-4 sm:px-6 lg:px-16 min-h-screen">
        <div className="max-w-7xl mx-auto bg-white p-6 shadow-sm rounded-lg flex flex-col lg:flex-row gap-8">
          {/* Left - Cart Items */}
          <div className="flex-1">
            <div className="flex md:flex-row flex-col items-center justify-between mb-8">
              <h2 className="text-2xl font-bold">Shopping Cart</h2>
              <p className="text-xl font-light md:text-2xl md:font-bold">
                {cartItems.length} {cartItems.length > 1 ? "items" : "item"}
              </p>
            </div>
            <div className="hidden sm:grid grid-cols-4 text-gray-500 text-sm font-semibold border-b pb-2">
              <p className="col-span-2">Product Details</p>
              <p>Quantity</p>
              <p className="text-right">Total</p>
            </div>

            {cartItems.map((item) => (
              <div key={item.id} className="grid grid-cols-1 sm:grid-cols-4 items-center py-4 border-b text-sm">
                <div className="col-span-2">
                  <h3 className="font-semibold">{item.title}</h3>
                  <p className="text-red-500">{item.brand}</p>
                  <button onClick={() => removeItem(item.id)} className="text-blue-500 mt-1 cursor-pointer">
                    Remove
                  </button>
                </div>
                <div className="flex items-center gap-2 mt-2 sm:mt-0">
                  <button onClick={() => updateQuantity(item.id, -1)} className="border px-2 cursor-pointer">
                    -
                  </button>
                  <span>{item.quantity}</span>
                  <button onClick={() => updateQuantity(item.id, 1)} className="border px-2 cursor-pointer">
                    +
                  </button>
                </div>
                <div className="text-right mt-2 sm:mt-0 font-medium">${(item.price * item.quantity).toFixed(2)}</div>
              </div>
            ))}

            <Link to="/" className="text-indigo-600 mt-6 inline-block">
              ← Continue Shopping
            </Link>
          </div>

          {/* Right - Order Summary */}
          <div className="lg:w-1/3 w-full border rounded-md p-6 bg-gray-50">
            <h3 className="text-xl font-semibold mb-4">Order Summary</h3>
            <div className="flex justify-between mb-2">
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
              <Button className="w-full bg-red-500 hover:bg-red-600">APPLY</Button>
            </div>

            <hr className="my-4" />

            <div className="flex justify-between text-lg font-semibold mb-4">
              <span>Total Cost</span>
              <span>${(totalCost + shippingCost).toFixed(2)}</span>
            </div>

            <Button className="w-full bg-indigo-500 hover:bg-indigo-600 text-white text-lg">CHECKOUT</Button>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Cart;
