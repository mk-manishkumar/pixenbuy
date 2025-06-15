import React, { useState, useEffect } from "react";

const images = ["https://placehold.co/1600x400/A0D9EF/000000?text=Shop+New+Arrivals", "https://placehold.co/1600x400/FFB996/000000?text=Exclusive+Deals+Daily", "https://placehold.co/1600x400/CEE6F3/000000?text=Discover+Our+Collection"];

export const Carousel: React.FC = () => {
  const [current, setCurrent] = useState(0);

  const nextSlide = () => setCurrent((prev) => (prev + 1) % images.length);
  const prevSlide = () => setCurrent((prev) => (prev - 1 + images.length) % images.length);
  const goToSlide = (index: number) => setCurrent(index);

  useEffect(() => {
    const interval = setInterval(nextSlide, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative w-full md:aspect-[16/5] aspect-[16/6] overflow-hidden">
      {/* Slides */}
      {images.map((img, index) => (
        <div key={img} className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${index === current ? "opacity-100 z-10" : "opacity-0 z-0"}`}>
          <img src={img} alt={`Slide ${index + 1}`} className="w-full h-full object-cover" style={{ objectFit: "cover", width: "100%", height: "100%" }} />
        </div>
      ))}

      {/* Controls */}
      <button onClick={prevSlide} className="absolute top-1/2 left-2 md:left-4 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full z-20 hidden md:block" aria-label="Previous Slide">
        ‹
      </button>

      <button onClick={nextSlide} className="absolute top-1/2 right-2 md:right-4 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full z-20 hidden md:block" aria-label="Next Slide">
        ›
      </button>

      {/* Indicators */}
      <div className="absolute bottom-2 sm:bottom-4 left-1/2 -translate-x-1/2 flex gap-1 sm:gap-2 z-20">
        {images.map((img, index) => (
          <button key={img} onClick={() => goToSlide(index)} className={`w-2 h-2 sm:w-3 sm:h-3 rounded-full border ${index === current ? "bg-white" : "bg-white/40"}`} />
        ))}
      </div>
    </div>
  );
};
