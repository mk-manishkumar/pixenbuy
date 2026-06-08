import { Footer } from "@/components/SharedComponents/Footer";
import Navbar from "@/components/SharedComponents/Navbar";
import React from "react";
import { Button } from "@/components/ui/button";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@clerk/clerk-react";
import { useCartQuery } from "@/hooks/useCartQuery";
import { useUpdateCartItem, useRemoveFromCart } from "@/hooks/useCartMutations";
import { slugify } from "@/utils/slugify";

const Cart: React.FC = () => {
  const navigate = useNavigate();
  const { isSignedIn } = useAuth();
  const { data: cart, isLoading } = useCartQuery();
  const { mutate: updateItem } = useUpdateCartItem();
  const { mutate: removeItem } = useRemoveFromCart();

  const cartItems = cart?.items ?? [];

  const handleQuantityChange = (productId: number, currentQty: number, delta: number) => {
    const newQty = currentQty + delta;
    if (newQty < 1) return;
    updateItem({ productId, quantity: newQty });
  };

  const handleRemove = (productId: number) => {
    removeItem(productId);
  };

  const handleCheckout = () => {
    navigate("/checkout");
  };

  if (!isSignedIn) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-grow flex items-center justify-center">
          <div className="text-center">
            <p className="text-lg text-gray-600 mb-4">Please sign in to view your cart</p>
            <Button onClick={() => navigate("/sign-in")} className="bg-indigo-500 hover:bg-indigo-600 cursor-pointer">
              Sign In
            </Button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="flex-grow">
        <div className="bg-gray-50 py-10 px-4 sm:px-6 lg:px-16">
          <div className="max-w-7xl mx-auto bg-white p-6 shadow-sm rounded-lg flex flex-col lg:flex-row gap-8">
            {/* Cart Items */}
            <div className="flex-1">
              <div className="flex md:flex-row flex-col items-center justify-between mb-8">
                <h2 className="text-2xl font-bold">Shopping Cart</h2>
                <p className="text-xl font-light md:text-2xl md:font-bold">
                  {isLoading ? "..." : `${cartItems.length} ${cartItems.length > 1 ? "items" : "item"}`}
                </p>
              </div>

              <div className="hidden sm:grid grid-cols-4 text-gray-500 text-sm font-semibold border-b pb-2">
                <p className="col-span-2">Product Details</p>
                <p>Quantity</p>
                <p className="text-right">Total</p>
              </div>

              {cartItems.map((item) => (
                <div key={item.productId} className="grid grid-cols-1 sm:grid-cols-4 items-center py-4 border-b text-sm">
                  <div className="col-span-2 flex items-center gap-4">
                    {item.image && <img src={item.image} alt={item.title} className="w-16 h-16 object-contain" />}
                    <div>
                      <Link to={`/product/${slugify(item.title)}`} className="font-semibold hover:underline">
                        {item.title}
                      </Link>
                      <p className="text-red-500">{item.brand}</p>
                      <button onClick={() => handleRemove(item.productId)} className="text-blue-500 mt-1 cursor-pointer">
                        Remove
                      </button>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 mt-2 sm:mt-0">
                    <button onClick={() => handleQuantityChange(item.productId, item.quantity, -1)} className="border px-2 cursor-pointer">
                      -
                    </button>
                    <span>{item.quantity}</span>
                    <button onClick={() => handleQuantityChange(item.productId, item.quantity, 1)} className="border px-2 cursor-pointer">
                      +
                    </button>
                  </div>
                  <div className="text-right mt-2 sm:mt-0 font-medium">${(item.price * item.quantity).toFixed(2)}</div>
                </div>
              ))}

              <div className="flex flex-col md:flex-row justify-between items-center mt-6 gap-4">
                <Link to="/categories" className="hidden md:inline text-indigo-600 text-sm sm:text-base">
                  ← Continue Shopping
                </Link>
                {cartItems.length > 0 && (
                  <Button onClick={handleCheckout} className="w-full cursor-pointer md:w-auto bg-indigo-500 hover:bg-indigo-600 text-sm sm:text-base block mx-auto md:mx-0">
                    Proceed to Checkout
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Cart;
