import React from "react";
import ProductCard from "../SharedComponents/ProductCard";

const ProductSection: React.FC = () => {
  return (
    <div className="my-20 mx-4 md:mx-10">
      <div>
        <h2 className="text-center text-3xl font-bold mb-16">Our Products</h2>
      </div>

      <div>
        <ProductCard />
      </div>
    </div>
  );
};

export default ProductSection;
