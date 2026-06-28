import { Footer } from "@/components/SharedComponents/Footer";
import Navbar from "@/components/SharedComponents/Navbar";
import React, { useState, useEffect } from "react";
import CheckoutCustomerForm from "@/components/CheckoutComponents/CheckoutCustomerForm";
import CheckoutOrderSummary from "@/components/CheckoutComponents/CheckoutOrderSummary";
import CheckoutSuccessModal from "@/components/CheckoutComponents/CheckoutSuccessModal";
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
  const { isLoaded, isSignedIn } = useAuth();
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

  const [checkoutStarted, setCheckoutStarted] = useState(false);

  const cartItems = cart?.items ?? [];
  const totalItems = cart?.totalItems ?? 0;
  const totalCost = cart?.totalPrice ?? 0;

  useEffect(() => {
    const script = document.createElement("script"); // NOSONAR - Razorpay dynamic script
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    document.body.appendChild(script);
    return () => {
      script.remove();
    };
  }, []);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleRazorpaySuccess = (response: any, orderId: string) => {
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
          setCheckoutStarted(false);
        },
      }
    );
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const initiateRazorpayPayment = (orderData: any) => {
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
              handleRazorpaySuccess(response, orderId);
            },
            prefill: {
              name: name,
              email: email,
              contact: phone,
            },
            theme: {
              color: "#6366f1",
            },
            modal: {
              ondismiss: function() {
                setCheckoutStarted(false);
                navigate("/profile"); // Give them a place to go if they close the modal
              }
            }
          };

          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const rzp1 = new (globalThis as any).Razorpay(options);
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          rzp1.on("payment.failed", function (response: any) {
            alert("Payment failed: " + response.error.description);
            setCheckoutStarted(false);
            navigate("/profile");
          });
          rzp1.open();
        },
        onError: (err) => {
          console.error("Failed to initialize payment gateway:", err);
          alert("Failed to initialize payment gateway.");
          setCheckoutStarted(false);
        },
      }
    );
  };

  useEffect(() => {
    if (isLoaded && !isSignedIn) {
      navigate("/sign-in");
    } else if (isLoaded && isSignedIn && cartItems.length === 0 && !showPopup && !checkoutStarted) {
      navigate("/cart");
    }
  }, [isLoaded, isSignedIn, cartItems.length, showPopup, checkoutStarted, navigate]);

  if (!isLoaded || !isSignedIn) {
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
    setCheckoutStarted(true);
    
    // Proceed to place order via backend API
    placeOrder(
      { shippingCost, shippingAddress: address, phone, name },
      {
        onSuccess: initiateRazorpayPayment,
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
          <CheckoutCustomerForm
            name={name}
            setName={setName}
            email={email}
            setEmail={setEmail}
            phone={phone}
            setPhone={setPhone}
            address={address}
            setAddress={setAddress}
            errors={errors}
          />

          <CheckoutOrderSummary
            totalItems={totalItems}
            totalCost={totalCost}
            shippingCost={shippingCost}
            setShippingCost={setShippingCost}
            handlePlaceOrder={handlePlaceOrder}
            isProcessing={isPlacingOrder || isCreatingPayment || isVerifying}
          />
        </div>
      </div>

      <Footer />

      <CheckoutSuccessModal
        showPopup={showPopup}
        name={name}
        finalCost={finalCost}
        goToHome={goToHome}
      />
    </div>
  );
};

export default Checkout;
