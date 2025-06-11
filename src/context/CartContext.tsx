import React, { createContext, useContext, useState, useEffect, useMemo } from "react";

export type CartItem = {
  id: number;
  title: string;
  price: number;
  brand: string;
  quantity: number;
};

type CartContextType = {
  cartItems: CartItem[];
  addToCart: (item: CartItem) => void;
  removeFromCart: (id: number) => void;
  updateQuantity: (id: number, amount: number) => void;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used within a CartProvider");
  return context;
};

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  // Load cart from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem("cart");
    if (stored) {
      try {
        setCartItems(JSON.parse(stored));
      } catch (error) {
        console.error("Failed to parse cart from localStorage:", error);
      }
    }
  }, []);

  // Save cart to localStorage whenever cartItems changes
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
    setCartItems((prev) => prev.filter((item) => item.id !== id));
  };

  const updateQuantity = (id: number, amount: number) => {
    setCartItems((prev) => prev.map((item) => (item.id === id ? { ...item, quantity: Math.max(1, item.quantity + amount) } : item)));
  };

  // Memoize the context value to prevent unnecessary re-renders
  const contextValue = useMemo(
    () => ({
      cartItems,
      addToCart,
      removeFromCart,
      updateQuantity,
    }),
    [cartItems]
  );

  return <CartContext.Provider value={contextValue}>{children}</CartContext.Provider>;
};
