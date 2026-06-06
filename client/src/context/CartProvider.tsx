import React, { useState, useEffect, useMemo } from "react";
import { CartContext } from "./CartContext";
import type { CartItem, CartContextType } from "./CartContext";

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>(() => {
    try {
      const stored = localStorage.getItem("cart");
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cartItems));
  }, [cartItems]);

  const addToCart = (item: CartItem) => {
    setCartItems((prev) => {
      const exists = prev.find((i) => i.id === item.id);
      if (exists) {
        return prev.map((i) => (i.id === item.id ? { ...i, quantity: i.quantity + item.quantity } : i));
      }
      return [...prev, item];
    });
  };

  const removeFromCart = (id: number) => {
    setCartItems((prev) => prev.filter((i) => i.id !== id));
  };

  const updateQuantity = (id: number, amount: number) => {
    setCartItems((prev) => prev.map((i) => (i.id === id ? { ...i, quantity: Math.max(1, i.quantity + amount) } : i)));
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const [canAccessCheckout, setCanAccessCheckout] = useState(() => {
    return sessionStorage.getItem("canAccessCheckout") === "true";
  });

  const allowCheckout = () => {
    sessionStorage.setItem("canAccessCheckout", "true");
    setCanAccessCheckout(true);
  };

  const resetCheckoutAccess = () => {
    sessionStorage.removeItem("canAccessCheckout");
    setCanAccessCheckout(false);
  };

  const value: CartContextType = useMemo(
    () => ({
      cartItems,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      canAccessCheckout,
      allowCheckout,
      resetCheckoutAccess,
    }),
    [cartItems, canAccessCheckout]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};
