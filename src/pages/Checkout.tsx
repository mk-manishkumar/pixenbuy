import { Footer } from "@/components/SharedComponents/Footer";
import Navbar from "@/components/SharedComponents/Navbar";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useCart } from "@/context/useCart";
import { useNavigate } from "react-router-dom";

const Checkout: React.FC = () => {
  const navigate = useNavigate();

  const { cartItems, updateQuantity, clearCart } = useCart();
  const [shippingCost, setShippingCost] = useState(10);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [showPopup, setShowPopup] = useState(false);

  const formValid = name && email && phone && address;

  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const totalCost = cartItems.reduce((sum, item) => sum + item.quantity * item.price, 0);

  const handlePlaceOrder = () => {
    cartItems.forEach((item) => updateQuantity(item.id, -item.quantity));
    setShowPopup(true);
  };

  const goToHome = () => {
    setShowPopup(false);
    setName("");
    setEmail("");
    setPhone("");
    setAddress("");
    clearCart();
    navigate("/");
  };

  return (
    <div className="min-h-screen flex flex-col relative">
      <Navbar />

      {/* Overlay Blur when Popup is active */}
      <div className={`flex-grow bg-gray-50 py-10 px-4 sm:px-6 lg:px-16 transition-all duration-300 ${showPopup ? "blur-sm pointer-events-none" : ""}`}>
        <div className="max-w-7xl mx-auto bg-white p-6 shadow-sm rounded-lg flex flex-col lg:flex-row gap-8">
          {/* Left - Customer Details */}
          <div className="flex-1">
            <h2 className="text-2xl font-bold mb-6">Customer Details</h2>
            <form className="grid grid-cols-1 gap-4">
              <div>
                <Label className="block mb-2">Name</Label>
                <Input type="text" placeholder="Enter your name" value={name} onChange={(e) => setName(e.target.value)} />
              </div>
              <div>
                <Label className="block mb-2">Email</Label>
                <Input type="email" placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)} />
              </div>
              <div>
                <Label className="block mb-2">Mobile Number</Label>
                <Input type="tel" placeholder="+1 234 567 8901" value={phone} onChange={(e) => setPhone(e.target.value)} />
              </div>
              <div>
                <Label className="block mb-2">Address</Label>
                <textarea rows={5} className="w-full border px-3 py-2 rounded text-sm resize-none" placeholder="123 Street, City, Country" value={address} onChange={(e) => setAddress(e.target.value)} />
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
              <Input type="text" placeholder="Enter your code" />
              <Button className="w-full bg-red-500 hover:bg-red-600 cursor-pointer mt-2 select-none">APPLY</Button>
            </div>

            <hr className="my-4" />

            <div className="flex justify-between text-lg font-semibold mb-4">
              <span>Total Cost</span>
              <span>${(totalCost + shippingCost).toFixed(2)}</span>
            </div>

            <Button disabled={!formValid} onClick={handlePlaceOrder} className={`w-full text-lg cursor-pointer select-none ${formValid ? "bg-indigo-500 hover:bg-indigo-600" : "bg-indigo-500 cursor-not-allowed"}`}>
              PLACE ORDER
            </Button>
          </div>
        </div>
      </div>

      <Footer />

      {/* Popup Modal */}
      {showPopup && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white w-[90%] max-w-md p-6 rounded-lg shadow-lg text-center">
            <h2 className="text-xl font-bold mb-4">Order Placed Successfully!</h2>
            <p className="text-gray-600 mb-6">Thank you for your purchase. Your order has been received.</p>
            <Button onClick={goToHome} className="bg-green-600 hover:bg-green-700 cursor-pointer px-4 py-2 rounded">
              Go to Home
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Checkout;
