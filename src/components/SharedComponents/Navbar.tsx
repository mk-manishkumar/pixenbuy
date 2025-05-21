import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Search, LayoutGrid, ShoppingCart, Menu } from "lucide-react";

const Navbar: React.FC = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="w-full shadow-md bg-white">
      <div className="flex justify-between items-center py-3 px-6 md:px-12">
        <Link to="/" className="text-2xl md:text-3xl font-bold text-green-600">
          PixenBuy
        </Link>

        {/* Desktop Search */}
        <div className="hidden md:flex items-center">
          <Input placeholder="Enter products..." className="w-96 p-2 outline-0" />
          <Search className="ml-[-2rem] font-light cursor-pointer text-green-600" size={15} />
        </div>

        {/* Desktop Icons */}
        <div className="flex justify-center gap-10">
          {/* Only desktop icon */}
          <div className="hidden md:flex">
            <Link to="/categories">
              <LayoutGrid className="cursor-pointer text-green-600" />
            </Link>
          </div>

          {/* All Screen Icon */}
          <div>
            <Link to="/cart">
              <ShoppingCart className="cursor-pointer text-green-600" />
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
          <Input placeholder="Enter products..." className="w-full p-2 outline-0" />
          <Link to="/categories" onClick={() => setMenuOpen(false)} className="text-sm text-gray-700 hover:text-green-600">
            Categories
          </Link>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
