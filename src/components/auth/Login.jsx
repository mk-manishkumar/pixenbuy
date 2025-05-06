import React, { useState, useEffect } from "react";
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

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { email, password } = input;
    if (!email || !password) {
      toast.error("Please fill in both email and password.");
      return;
    }

    setLoading(true);

    try {
      console.log("[Login] Attempting login for email:", email);

      // Sign in the user with Supabase Auth
      const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (signInError) {
        console.error("[Login] Login error:", signInError);
        toast.error(signInError.message);
        setLoading(false);
        return;
      }

      const user = signInData?.user;
      if (!user) {
        console.error("[Login] No user returned from signin");
        toast.error("Login failed: User not found.");
        setLoading(false);
        return;
      }

      console.log("[Login] User authenticated successfully:", user.id);

      // Let the AuthContext handle setting the user with role
      // The enhanced setUser in AuthContext will automatically fetch the role
      await setUser(user);

      // Navigate after a small delay to ensure AuthContext has updated
      setTimeout(() => {
        toast.success(`Welcome back!`);
        navigate("/");
        setLoading(false);
      }, 500);
    } catch (err) {
      console.error("[Login] Login error:", err);
      toast.error("An unexpected error occurred: " + err.message);
      setLoading(false);
    }
  };

  // Check for existing session on component mount
  useEffect(() => {
    const checkSession = async () => {
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession();
        if (session) {
          console.log("[Login] Existing session found, redirecting");
          navigate("/");
        }
      } catch (err) {
        console.error("[Login] Session check failed", err);
      }
    };

    checkSession();
  }, [navigate]);

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
