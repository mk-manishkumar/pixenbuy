import React, { useState } from "react";
import { Search, ShoppingCart, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Link, useNavigate } from "react-router-dom";

const Header = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <header className="w-full bg-white shadow-sm py-3 px-4 md:px-6">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-4">
        {/* Logo + Desktop Nav */}
        <div className="flex items-center flex-grow lg:flex-grow-0">
          <h1 className="text-xl md:text-2xl font-bold mr-6">
            Pixen<span className="text-[#16d66d]">Buy</span>
          </h1>
          <div className="hidden lg:flex items-center space-x-6">
            <Link to="/" className="text-gray-700 hover:text-[#16d66d]">
              Home
            </Link>
            <Link to="/category" className="text-gray-700 hover:text-[#16d66d]">
              Category
            </Link>
          </div>
        </div>

        {/* Search - Desktop only */}
        <div className="hidden md:flex items-center flex-grow max-w-md w-full mx-4">
          <div className="relative w-full">
            <Input type="text" placeholder="Search for Products, Brands and More" className="w-full py-3 px-4 pl-5 pr-14 border border-gray-300 rounded-lg focus:border-[#16d66d] focus:ring-[#16d66d] text-base" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
            <Button className="absolute right-0 top-0 bottom-0 px-4 bg-[#16d66d] hover:bg-[#14c061] text-white rounded-r-lg">
              <Search size={20} />
            </Button>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center space-x-3">
          {/* Desktop */}
          <div className="hidden sm:flex items-center space-x-5">
            <Button variant="ghost" className="hover:bg-transparent text-gray-800">
              <ShoppingCart size={30} />
            </Button>
            <Button variant="outline" className="border-none hover:bg-gray-100">
              <User size={30} />
            </Button>
          </div>

          {/* Mobile icons */}
          <div className="flex sm:hidden space-x-2">
            <Button variant="ghost" size="icon" className="text-gray-700">
              <Search size={20} />
            </Button>
            <Button variant="ghost" size="icon" className="text-gray-700">
              <User size={20} />
            </Button>
            <Button variant="ghost" size="icon" className="text-gray-700">
              <ShoppingCart size={20} />
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Nav */}
      <div className="md:hidden flex flex-col mt-3 px-2">
        <div className="flex flex-wrap gap-4 mb-3">
          <Link to="/" className="text-gray-700 hover:text-[#16d66d]">
            Home
          </Link>
          <Link to="/category" className="text-gray-700 hover:text-[#16d66d]">
            Category
          </Link>
        </div>
        <div className="relative w-full">
          <Input type="text" placeholder="Search for Products, Brands and More" className="w-full py-2 px-4 border border-gray-300 rounded-lg" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
          <Button className="absolute right-0 top-0 bottom-0 px-3 bg-[#16d66d] hover:bg-[#14c061] text-white rounded-r-lg">
            <Search size={18} />
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Header;
