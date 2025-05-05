import React, { useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Link, useNavigate } from "react-router-dom";
import Header from "../shared/Header";
import Footer from "../shared/Footer";
import { supabase } from "../../../supabase/supabase-client";
import { toast } from "sonner";
import { useAuth } from "@/context/AuthContext";

const Login = () => {
  const [input, setInput] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { setUser } = useAuth();

  const handleChange = (e) => {
    setInput({ ...input, [e.target.name]: e.target.value });
  };

  // LOGIN FORM SUBMISSION
  const handleSubmit = async (e) => {
    e.preventDefault();

    const { email, password } = input;
    if (!email || !password) {
      toast.error("Please fill in both email and password.");
      return;
    }

    setLoading(true);

    try {
      const { data: signInData, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        toast.error(error.message);
        return;
      }

      const { user } = signInData;

      console.log(user.user_metadata);
      if (!user?.user_metadata?.role) {
        toast.error("User role is missing.");
        await supabase.auth.signOut();
        return;
      }

      // Set user context with session info and role
      setUser({
        id: user.id,
        email: user.email,
        role: user.user_metadata.role,
      });

      toast.success(`Welcome back, ${user.user_metadata.role}!`);
      navigate("/");
    } catch (err) {
      toast.error("An unexpected error occurred.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <div className="flex-grow flex justify-center items-center px-4 py-8">
        <form onSubmit={handleSubmit} className="w-full max-w-md border border-gray-200 rounded-md p-4 sm:p-6 shadow-md">
          <h1 className="font-bold text-xl mb-4 text-center">Login</h1>

          <div className="mb-4">
            <Label className="mb-2">Email</Label>
            <Input type="email" name="email" value={input.email} onChange={handleChange} placeholder="Enter your email" required />
          </div>

          <div className="mb-4">
            <Label className="mb-2">Password</Label>
            <Input type="password" name="password" value={input.password} onChange={handleChange} placeholder="Enter your password" required />
          </div>

          {loading ? (
            <Button className="w-full cursor-pointer" disabled>
              Logging in...
            </Button>
          ) : (
            <Button type="submit" className="w-full cursor-pointer">
              Login
            </Button>
          )}

          <div className="text-sm text-center mt-4">
            Don't have an account?{" "}
            <Link to="/signup" className="text-blue-600 hover:underline">
              Click here to sign up
            </Link>
          </div>
        </form>
      </div>
      <Footer />
    </div>
  );
};

export default Login;
