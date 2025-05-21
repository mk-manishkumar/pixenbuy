import { Carousel } from "@/components/HomeComponents/Carousel";
import {Features} from "@/components/HomeComponents/Features";
import { Footer } from "@/components/SharedComponents/Footer";
import Navbar from "@/components/SharedComponents/Navbar";
import React from "react";

const Home: React.FC = () => {
  return (
    <>
      <Navbar />
      <Carousel />
      <Features/>
      <Footer />
    </>
  );
};

export default Home;
