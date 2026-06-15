import React from "react";
import { SignUp as ClerkSignUp } from "@clerk/clerk-react";
import Navbar from "@/components/SharedComponents/Navbar";
import { Footer } from "@/components/SharedComponents/Footer";

const SignUp: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow flex items-center justify-center bg-gray-50 py-12">
        <ClerkSignUp routing="path" path="/sign-up" signInUrl="/sign-in" />
      </main>
      <Footer />
    </div>
  );
};

export default SignUp;
