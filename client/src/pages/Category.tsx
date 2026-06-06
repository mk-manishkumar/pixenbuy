import React, { useEffect, useState } from "react";
import { Footer } from "@/components/SharedComponents/Footer";
import Navbar from "@/components/SharedComponents/Navbar";
import { getAllProducts, type Product } from "@/api/fakeStoreApi";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Link } from "react-router-dom";
import { slugify } from "@/utils/slugify";

const categories = ["men's clothing", "jewelery", "electronics", "women's clothing"];

const Category: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>(categories[0]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await getAllProducts();
        setProducts(data);
      } catch (error) {
        console.error("Failed to fetch products:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const filteredProducts = products.filter((p) => p.category === selectedCategory);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow bg-gray-50 py-10 px-4 sm:px-6 lg:px-16">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-10">
          {/* Left: Categories */}
          <div className="w-full lg:w-1/4 bg-white p-6 rounded shadow-sm">
            <h2 className="text-lg font-semibold mb-4">Categories</h2>
            <RadioGroup defaultValue={categories[0]} value={selectedCategory} onValueChange={(value) => setSelectedCategory(value)} className="space-y-3">
              {categories.map((cat) => (
                <div key={cat} className="flex items-center space-x-2">
                  <RadioGroupItem value={cat} id={cat} />
                  <Label htmlFor={cat} className="capitalize cursor-pointer">
                    {cat}
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </div>

          {/* Right: Products */}
          <div className="w-full lg:flex-1">
            <h2 className="text-lg font-semibold mb-4 capitalize">{selectedCategory}</h2>
            {loading ? (
              <p>Loading products...</p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                {filteredProducts.map((product) => (
                  <div key={product.id} className="bg-white rounded shadow-sm p-4 flex flex-col items-center gap-2 text-center hover:shadow-xl transition duration-300">
                    <img src={product.image} alt={product.title} className="h-48 mx-auto object-contain" />
                    <Link to={`/product/${slugify(product.title)}`} className="mt-2 text-sm font-medium cursor-pointer hover:underline">
                      {product.title}
                    </Link>
                    <p className="text-sm text-gray-600">${product.price}</p>
                    <p className="text-sm text-gray-600 mb-4">Rating: ⭐ {product.rating.rate} / 5</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Category;
