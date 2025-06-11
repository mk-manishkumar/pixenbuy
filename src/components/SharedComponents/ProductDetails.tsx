import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getAllProducts } from "@/api/fakeStoreApi";
import type { Product } from "@/api/fakeStoreApi";
import Navbar from "@/components/SharedComponents/Navbar";
import { Footer } from "@/components/SharedComponents/Footer";
import { Button } from "@/components/ui/button";
import { useCart } from "@/context/CartContext";
import { ToastContainer, toast } from "react-toastify";

const slugify = (text: string) =>
  text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");

const ProductDetails: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);

  const increment = () => setQuantity((prev) => prev + 1);
  const decrement = () => setQuantity((prev) => (prev > 1 ? prev - 1 : 1));

  const { addToCart } = useCart();

  const handleAddToCart = () => {
    if (product) {
      addToCart({
        id: product.id,
        title: product.title,
        price: product.price,
        brand: product.category,
        quantity: quantity,
      });

      toast.success("Added to cart!", {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: "colored",
      });
    }
  };
  

  useEffect(() => {
    const fetchProductBySlug = async () => {
      try {
        if (slug) {
          const products = await getAllProducts();
          const matched = products.find((p) => slugify(p.title) === slug);
          if (matched) {
            setProduct(matched);
          }
        }
      } catch (error) {
        console.error("Failed to fetch product:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProductBySlug();
  }, [slug]);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-grow px-4 md:px-8 py-12">
        <div className="max-w-7xl mx-auto">
          {(() => {
            if (loading) {
              return <p className="text-center">Loading...</p>;
            } else if (product) {
              return (
                <div className="grid gap-12 md:grid-cols-3 items-start">
                  {/* Image Section */}
                  <div className="md:col-span-1 flex justify-center">
                    <img src={product.image} alt={product.title} className="h-96 object-contain" />
                  </div>

                  {/* Details Section */}
                  <div className="md:col-span-2">
                    <h1 className="text-3xl font-semibold mb-4">{product.title}</h1>
                    <p className="text-2xl text-gray-800 font-medium mb-2">${product.price}</p>
                    <p className="text-sm text-gray-500 mb-4">⭐ {product.rating.rate} / 5</p>
                    <p className="text-gray-700 leading-relaxed mb-6">{product.description}</p>
                    <p className="text-sm text-gray-500 mb-6">Category: {product.category}</p>

                    {/* Quantity Selector */}
                    <div className="flex items-center mb-6 border rounded overflow-hidden w-max">
                      <button onClick={decrement} className="cursor-pointer px-4 py-2 text-black-600 text-xl border-r">
                        -
                      </button>
                      <div className="px-6 py-2 text-black-600 text-lg border-r">{quantity}</div>
                      <button onClick={increment} className="cursor-pointer px-4 py-2 text-black-600 text-xl">
                        +
                      </button>
                    </div>

                    <Button onClick={handleAddToCart} className="cursor-pointer hover:bg-zinc-600">
                      ADD CART
                    </Button>
                  </div>
                </div>
              );
            } else {
              return <p className="text-center text-red-500">Product not found.</p>;
            }
          })()}
        </div>
      </main>

      <ToastContainer />

      <Footer />
    </div>
  );
};

export default ProductDetails;
