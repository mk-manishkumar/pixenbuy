import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Search, LayoutGrid, ShoppingCart, Menu } from "lucide-react";
import { useCart } from "@/context/useCart";
import { getAllProducts } from "@/api/fakeStoreApi";
import type { Product } from "@/api/fakeStoreApi";
import { slugify } from "@/utils/slugify";

const Navbar: React.FC = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { cartItems } = useCart();
  const uniqueItemsCount = cartItems.length;

  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Product[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);

  const showSearchBar = location.pathname === "/" || location.pathname === "/categories";

  useEffect(() => {
    const delayDebounce = setTimeout(async () => {
      if (query.trim().length > 0) {
        try {
          const products = await getAllProducts();
          const filtered = products.filter((product) => product.title.toLowerCase().includes(query.toLowerCase()));
          setResults(filtered);
          setShowDropdown(true);
        } catch (error) {
          console.error("Failed to fetch products:", error);
          setResults([]);
          setShowDropdown(false);
        }
      } else {
        setShowDropdown(false);
        setResults([]);
      }
    }, 300); 

    return () => clearTimeout(delayDebounce);
  }, [query]);

  const handleSelect = (product: Product) => {
    setQuery("");
    setShowDropdown(false);
    const slug = slugify(product.title);
    navigate(`/product/${slug}`);
  };

  return (
    <nav className="w-full shadow-md bg-white relative z-50">
      <div className="flex justify-between items-center py-3 px-6 md:px-12">
        <Link to="/" className="text-2xl md:text-3xl font-bold">
          <span className="text-red-600">PIXEN</span>BUY
        </Link>

        {/* Search Bar - Desktop only */}
        {showSearchBar && (
          <div className="hidden md:flex flex-col items-start relative w-[400px]">
            <div className="w-full flex items-center">
              <Input placeholder="Search for products..." value={query} onChange={(e) => setQuery(e.target.value)} className="w-full p-2 outline-0" />
              <Search className="ml-[-2rem] font-light cursor-pointer" size={15} />
            </div>

            {/* Search Suggestions Dropdown */}
            {showDropdown && results.length > 0 && (
              <ul className="absolute top-12 w-full bg-white border rounded-md shadow-md z-50 max-h-60 overflow-y-auto">
                {results.map((item) => (
                  <button
                    key={item.id}
                    className="w-full text-left px-4 py-2 cursor-pointer hover:bg-gray-100 text-sm"
                    onClick={() => handleSelect(item)}
                    type="button"
                  >
                    {item.title}
                  </button>
                ))}
              </ul>
            )}
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

          {/* Mobile Hamburger */}
          <button onClick={() => setMenuOpen(!menuOpen)} className="md:hidden">
            <Menu className="cursor-pointer text-green-600" />
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="flex flex-col gap-4 px-6 pb-4 md:hidden">
          {showSearchBar && <Input placeholder="Search for products..." value={query} onChange={(e) => setQuery(e.target.value)} className="w-full p-2 outline-0" />}
          <Link to="/categories" onClick={() => setMenuOpen(false)} className="text-sm text-gray-700 hover:text-green-600">
            Categories
          </Link>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
