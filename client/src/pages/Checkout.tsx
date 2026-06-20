import { Footer } from "@/components/SharedComponents/Footer";
import Navbar from "@/components/SharedComponents/Navbar";
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@clerk/clerk-react";
import { useCartQuery } from "@/hooks/useCartQuery";
import { useClearCart } from "@/hooks/useCartMutations";
import { useUserQuery } from "@/hooks/useUserQuery";
import { checkoutFormSchema } from "@/utils/schemas";
import { usePlaceOrder } from "@/hooks/useOrderQuery";
import { useCreateRazorpayOrder, useVerifyPayment } from "@/hooks/usePaymentQuery";

const Checkout: React.FC = () => {
  const navigate = useNavigate();
  const { isSignedIn } = useAuth();
  const { data: cart } = useCartQuery();
  const { data: user } = useUserQuery();
  const { mutate: clearCart } = useClearCart();
  const { mutate: placeOrder, isPending: isPlacingOrder } = usePlaceOrder();
  const { mutate: createRazorpayOrder, isPending: isCreatingPayment } = useCreateRazorpayOrder();
  const { mutate: verifyPayment, isPending: isVerifying } = useVerifyPayment();

  const [shippingCost, setShippingCost] = useState(10);
  const [name, setName] = useState(user?.name || "");
  const [email, setEmail] = useState(user?.email || "");
  const [phone, setPhone] = useState(user?.phone || "");
  const [address, setAddress] = useState(user?.address || "");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showPopup, setShowPopup] = useState(false);
  const [finalCost, setFinalCost] = useState(0);

  const cartItems = cart?.items ?? [];
  const totalItems = cart?.totalItems ?? 0;
  const totalCost = cart?.totalPrice ?? 0;

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    document.body.appendChild(script);
    return () => {
      document.body.removeChild(script);
    };
  }, []);

  // Redirect if not signed in or cart is empty
  if (!isSignedIn) {
    navigate("/sign-in");
    return null;
  }

  if (cartItems.length === 0 && !showPopup) {
    navigate("/cart");
    return null;
  }

  const handlePlaceOrder = () => {
    const result = checkoutFormSchema.safeParse({ name, email, phone, address });

    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      result.error.issues.forEach((issue) => {
        const field = String(issue.path[0]);
        if (!fieldErrors[field]) {
          fieldErrors[field] = issue.message;
        }
      });
      setErrors(fieldErrors);
      return;
    }

    setErrors({});
    
    // Proceed to place order via backend API
    placeOrder(
      { shippingCost, shippingAddress: address, phone, name },
      {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        onSuccess: (orderData: any) => {
          const orderId = orderData._id;

          createRazorpayOrder(
            { orderId },
            {
              onSuccess: (rzpOrder) => {
                const options = {
                  key: import.meta.env.VITE_RAZORPAY_KEY_ID,
                  amount: rzpOrder.amount,
                  currency: rzpOrder.currency,
                  name: "PixenBuy",
                  description: "Order Payment",
                  order_id: rzpOrder.orderId,
                  // eslint-disable-next-line @typescript-eslint/no-explicit-any
                  handler: function (response: any) {
                    verifyPayment(
                      {
                        razorpay_order_id: response.razorpay_order_id,
                        razorpay_payment_id: response.razorpay_payment_id,
                        razorpay_signature: response.razorpay_signature,
                        orderId: orderId,
                      },
                      {
                        onSuccess: () => {
                          setFinalCost(totalCost + shippingCost);
                          setShowPopup(true);
                        },
                        onError: (err) => {
                          console.error("Payment verification failed:", err);
                          alert("Payment verification failed");
                        },
                      }
                    );
                  },
                  prefill: {
                    name: name,
                    email: email,
                    contact: phone,
                  },
                  theme: {
                    color: "#6366f1",
                  },
                };

                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                const rzp1 = new (window as any).Razorpay(options);
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                rzp1.on("payment.failed", function (response: any) {
                  alert("Payment failed: " + response.error.description);
                });
                rzp1.open();
              },
              onError: (err) => {
                console.error("Failed to initialize payment gateway:", err);
                alert("Failed to initialize payment gateway.");
              },
            }
          );
        },
        onError: (err) => {
          console.error("Failed to place order:", err);
        }
      }
    );
  };

  const goToHome = () => {
    clearCart();
    setShowPopup(false);
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
                {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
              </div>
              <div>
                <Label className="block mb-2">Email</Label>
                <Input type="email" placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)} />
                {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
              </div>
              <div>
                <Label className="block mb-2">Mobile Number</Label>
                <Input type="tel" placeholder="+1 234 567 8901" value={phone} onChange={(e) => setPhone(e.target.value)} />
                {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
              </div>
              <div>
                <Label className="block mb-2">Address</Label>
                <textarea rows={5} className="w-full border px-3 py-2 rounded text-sm resize-none" placeholder="123 Street, City, Country" value={address} onChange={(e) => setAddress(e.target.value)} />
                {errors.address && <p className="text-red-500 text-xs mt-1">{errors.address}</p>}
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

            <Button onClick={handlePlaceOrder} disabled={isPlacingOrder || isCreatingPayment || isVerifying} className="w-full text-lg cursor-pointer select-none bg-indigo-500 hover:bg-indigo-600">
              {isPlacingOrder || isCreatingPayment || isVerifying ? "PROCESSING..." : "PLACE ORDER"}
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
            <p className="text-gray-600 mb-6">
              Thank you {name} for your purchase. Your payment of ${finalCost.toFixed(2)} was successful! We will ship your items shortly.
            </p>
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
