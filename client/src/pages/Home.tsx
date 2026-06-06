import { Carousel } from "@/components/HomeComponents/Carousel";
import {Features} from "@/components/HomeComponents/Features";
import ProductSection from "@/components/HomeComponents/ProductSection";
import { Footer } from "@/components/SharedComponents/Footer";
import Navbar from "@/components/SharedComponents/Navbar";
import React from "react";

const Home: React.FC = () => {
  return (
    <>
      <Navbar />
      <Carousel />
      <Features/>
      <ProductSection/>
      <Footer />
    </>
  );
};

export default Home;
