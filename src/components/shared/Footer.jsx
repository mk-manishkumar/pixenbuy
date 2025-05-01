import React from "react";

const Footer = () => {
  return (
    <div className="w-full">
      <footer className="bg-gray-800 text-white py-6 md:py-10">
        <div className="container mx-auto px-4 text-center">
          <p className="text-sm md:text-base">&copy; PixenBuy. All rights reserved.</p>
          <p className="text-sm md:text-base mt-2">Follow us on:</p>
          <div className="flex flex-wrap justify-center gap-3 md:space-x-4 mt-2">
            <a href="https://www.facebook.com" className="text-xs md:text-sm text-gray-400 hover:text-white transition-colors duration-300" target="_blank" rel="noopener noreferrer">
              Facebook
            </a>
            <a href="https://www.twitter.com" className="text-xs md:text-sm text-gray-400 hover:text-white transition-colors duration-300" target="_blank" rel="noopener noreferrer">
              Twitter
            </a>
            <a href="https://www.linkedin.com" className="text-xs md:text-sm text-gray-400 hover:text-white transition-colors duration-300" target="_blank" rel="noopener noreferrer">
              LinkedIn
            </a>
          </div>
        </div>
      </footer>
      <div className="bg-gray-900 text-white py-2 text-center">
        <p className="text-xs md:text-sm">Powered by PixenBuy, 2025</p>
      </div>
    </div>
  );
};

export default Footer;
