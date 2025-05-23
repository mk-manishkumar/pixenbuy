import React, { useEffect, useState } from "react";
import { getAllProducts } from "@/api/fakeStoreApi";
import type { Product } from "@/api/fakeStoreApi";
import { Link } from "react-router-dom";

const PRODUCTS_PER_PAGE = 8;

const slugify = (text: string) =>
  text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");


const ProductCard: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(products.length / PRODUCTS_PER_PAGE);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await getAllProducts();
        setProducts(data);
      } catch (error) {
        console.error("Failed to load products:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const startIndex = (currentPage - 1) * PRODUCTS_PER_PAGE;
  const paginatedProducts = products.slice(startIndex, startIndex + PRODUCTS_PER_PAGE);

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  if (loading) {
    return <p className="text-center">Loading products...</p>;
  }

  return (
    <div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
        {paginatedProducts.map((product) => (
          <div key={product.id} className="border rounded-lg p-4 shadow-md flex flex-col items-center text-center hover:shadow-xl transition duration-300">
            <img src={product.image} alt={product.title} className="h-40 object-contain mb-4" />
            <Link to={`/product/${slugify(product.title)}`}>
              <h3 className="text-lg font-semibold mb-2 line-clamp-2 hover:underline cursor-pointer">{product.title}</h3>
            </Link>
            <p className="text-primary font-bold text-xl mb-1">${product.price}</p>
            <p className="text-sm text-gray-600 mb-4">Rating: ⭐ {product.rating.rate} / 5</p>
          </div>
        ))}
      </div>

      {/* Pagination */}
      <div className="flex justify-center mt-10 gap-2">
        <button onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1} className="px-4 py-2 border rounded disabled:opacity-50 cursor-pointer">
          Prev
        </button>

        {Array.from({ length: totalPages }, (_, i) => {
          const pageNum = i + 1;
          return (
            <button key={`page-${pageNum}`} onClick={() => handlePageChange(pageNum)} className={`cursor-pointer px-4 py-2 border rounded ${currentPage === pageNum ? "bg-black text-white" : "bg-white text-black"}`}>
              {pageNum}
            </button>
          );
        })}

        <button onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages} className="px-4 py-2 border rounded disabled:opacity-50 cursor-pointer">
          Next
        </button>
      </div>
    </div>
  );
};

export default ProductCard;
