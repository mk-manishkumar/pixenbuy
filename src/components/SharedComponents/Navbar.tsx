import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Search, LayoutGrid, ShoppingCart, Menu } from "lucide-react";
import { useCart } from "@/context/useCart";

const Navbar: React.FC = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();
  const { cartItems } = useCart();
  const uniqueItemsCount = cartItems.length;

  // Determine if search bar should be shown
  const showSearchBar = location.pathname === "/" || location.pathname === "/categories";

  return (
    <nav className="w-full shadow-md bg-white">
      <div className="flex justify-between items-center py-3 px-6 md:px-12">
        <Link to="/" className="text-2xl md:text-3xl font-bold">
          <span className="text-red-600">PIXEN</span>BUY
        </Link>

        {/* Desktop Search - conditionally rendered */}
        {showSearchBar && (
          <div className="hidden md:flex items-center">
            <Input placeholder="Enter products..." className="w-96 p-2 outline-0" />
            <Search className="ml-[-2rem] font-light cursor-pointer" size={15} />
          </div>
        )}

        {/* Desktop Icons */}
        <div className="flex justify-center gap-10">
          <div className="hidden md:flex">
            <Link to="/categories">
              <LayoutGrid className="cursor-pointer" size={20} />
            </Link>
          </div>

          <div className="flex items-center">
            <Link to="/cart" className="relative">
              <ShoppingCart className="cursor-pointer" size={20} />
              {uniqueItemsCount > 0 && <span className="absolute -top-2 -right-2 w-[20px] h-[20px] bg-[#e21717] rounded-full flex justify-center items-center text-white text-xs">{uniqueItemsCount}</span>}
            </Link>
          </div>

          {/* Hamburger for Mobile */}
          <button onClick={() => setMenuOpen(!menuOpen)} aria-label="Toggle menu" className="md:hidden">
            <Menu className="cursor-pointer text-green-600" />
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="flex flex-col gap-4 px-6 pb-4 md:hidden transition-all duration-300 ease-in-out transform">
          {showSearchBar && <Input placeholder="Enter products..." className="w-full p-2 outline-0" />}
          <Link to="/categories" onClick={() => setMenuOpen(false)} className="text-sm text-gray-700 hover:text-green-600">
            Categories
          </Link>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
