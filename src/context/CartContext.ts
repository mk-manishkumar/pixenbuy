import { createContext } from "react";

export type CartItem = {
  id: number;
  title: string;
  price: number;
  brand: string;
  quantity: number;
};

export type CartContextType = {
  cartItems: CartItem[];
  addToCart: (item: CartItem) => void;
  removeFromCart: (id: number) => void;
  updateQuantity: (id: number, amount: number) => void;
  clearCart: () => void;
  canAccessCheckout: boolean;
  allowCheckout: () => void;
  resetCheckoutAccess: () => void;
};

export const CartContext = createContext<CartContextType | undefined>(undefined);
