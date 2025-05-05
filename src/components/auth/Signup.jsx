import React, { useEffect, useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Button } from "@/components/ui/button";
import { Link, useNavigate } from "react-router-dom";
import Header from "../shared/Header";
import Footer from "../shared/Footer";
import { supabase } from "../../../supabase/supabase-client";
import { toast } from "sonner";

const Signup = () => {
  const [input, setInput] = useState({
    fullname: "",
    email: "",
    password: "",
    role: "",
    file: null,
  });

  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setInput({ ...input, [e.target.name]: e.target.value });
  };

  const handleFile = (e) => {
    setInput({ ...input, file: e.target.files?.[0] });
  };

  // submit form
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!input.fullname || !input.email || !input.password || !input.role) {
      toast.error("Please fill in all required fields.");
      return;
    }

    setLoading(true);

    // Check if email already exists in the respective table
    const table = input.role === "buyer" ? "buyer" : "seller";
    const { data: existingUser, error: checkError } = await supabase.from(table).select("email").eq("email", input.email).maybeSingle();

    if (existingUser) {
      toast.error("Email already exists. Please use a different email address.");
      setLoading(false);
      return;
    }

    if (checkError && checkError.code !== "PGRST116") {
      // PGRST116 is "no rows returned" error which is expected if email doesn't exist
      toast.error("Error while checking email uniqueness");
      setLoading(false);
      return;
    }

    // Sign up using Supabase Auth
    const { data, error } = await supabase.auth.signUp({
      email: input.email,
      password: input.password,
      options: {
        data: { role: input.role },
      },
    });

    if (error) {
      toast.error(error.message);
      setLoading(false);
      return;
    }

    const userId = data.user?.id;

    // Upload image
    let avatarUrl = null;

    if (input.file && userId) {
      const fileExt = input.file.name.split(".").pop();
      const fileName = `${userId}.${fileExt}`;
      const { data: uploadData, error: uploadError } = await supabase.storage.from("profile-images").upload(fileName, input.file, {
        cacheControl: "3600",
        upsert: true,
      });

      if (uploadError) {
        toast.warning("Account created but image upload failed.");
      } else {
        const { data: publicUrlData } = supabase.storage.from("profile-images").getPublicUrl(uploadData.path);
        avatarUrl = publicUrlData.publicUrl;
      }
    }

    const { error: profileError } = await supabase.from(table).insert([
      {
        id: userId,
        fullname: input.fullname,
        email: input.email,
        avatar: avatarUrl,
        role: input.role,
      },
    ]);

    if (profileError) {
      toast.error("Account creating failed.");
    } else {
      toast.success("Account created!");
      navigate("/login");
    }

    setLoading(false);
  };

  useEffect(() => {
    const checkSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (session) {
        navigate("/");
      }
    };

    checkSession();
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <div className="flex-grow flex justify-center items-center px-4 py-8">
        <form onSubmit={handleSubmit} className="w-full max-w-md sm:max-w-lg md:max-w-xl border border-gray-200 rounded-md p-4 sm:p-6 shadow-md">
          <h1 className="font-bold text-xl mb-4 text-center">Sign Up</h1>

          <div className="mb-4">
            <Label className="mb-2">Full Name</Label>
            <Input type="text" name="fullname" value={input.fullname} onChange={handleChange} placeholder="Enter your full name" required />
          </div>

          <div className="mb-4">
            <Label className="mb-2">Email</Label>
            <Input type="email" name="email" value={input.email} onChange={handleChange} placeholder="Enter your email" required />
          </div>

          <div className="mb-4">
            <Label className="mb-2">Password</Label>
            <Input type="password" name="password" value={input.password} onChange={handleChange} placeholder="Enter your password" required />
          </div>

          <div className="mb-4">
            <Label className="mb-4 block">Select your role</Label>
            <RadioGroup value={input.role} onValueChange={(value) => setInput({ ...input, role: value })} className="flex gap-6">
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="buyer" id="buyer" />
                <Label htmlFor="buyer">Buyer</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="seller" id="seller" />
                <Label htmlFor="seller">Seller</Label>
              </div>
            </RadioGroup>
          </div>

          <div className="mb-4">
            <Label className="block mb-3">Profile Image </Label>
            <div className="relative flex flex-col items-center w-full py-6 border-2 border-dashed border-gray-300 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors duration-200 cursor-pointer group">
              <div className="flex flex-col items-center justify-center space-y-2 text-center">
                <svg className="w-12 h-12 text-gray-400 group-hover:text-blue-500 transition-colors duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path>
                </svg>
                <p className="text-sm font-medium text-gray-600 group-hover:text-gray-900">
                  Drag your image here, or <span className="text-blue-500 group-hover:text-blue-700">browse</span>
                </p>
                <p className="text-xs text-gray-500">Supports: JPG, PNG, GIF</p>
              </div>
              <input accept="image/*" type="file" className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" onChange={handleFile} />
            </div>
          </div>

          {loading ? (
            <Button className="w-full cursor-pointer" disabled>
              Please wait...
            </Button>
          ) : (
            <Button type="submit" className="w-full cursor-pointer">
              Sign Up
            </Button>
          )}

          <div className="text-sm text-center mt-4">
            Already have an account?{" "}
            <Link to="/login" className="text-blue-600 hover:underline">
              Click here to login
            </Link>
          </div>
        </form>
      </div>
      <Footer />
    </div>
  );
};

export default Signup;
