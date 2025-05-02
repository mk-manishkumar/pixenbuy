import React, { useEffect, useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Button } from "@/components/ui/button";
import { Link, useNavigate } from "react-router-dom";
import Header from "../shared/Header";
// import { signInUser, getUserRole } from "@/supabase/authService"; // Uncomment once wired
// import { useDispatch } from "react-redux"; // If using redux
// import { setUser, setRole } from "@/store/authSlice"; // If using redux

const Login = () => {
  const navigate = useNavigate();
  // const dispatch = useDispatch(); // If using redux

  const [input, setInput] = useState({
    email: "",
    password: "",
    role: "",
  });

  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState(null); // For redirect simulation, use Redux or context in prod

  const handleChange = (e) => {
    setInput({ ...input, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.email || !input.password || !input.role) {
      alert("Please fill all fields.");
      return;
    }

    setLoading(true);
    try {
      // const { user, error } = await signInUser(input.email, input.password);
      // if (error) throw new Error(error);

      // const { role } = await getUserRole();
      // dispatch(setUser(user));
      // dispatch(setRole(role));

      // For now, simulate login:
      setTimeout(() => {
        setUser({ email: input.email, role: input.role });
        navigate(input.role === "seller" ? "/seller/dashboard" : "/");
      }, 1000);
    } catch (err) {
      console.error("Login error:", err.message);
      alert("Login failed.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      navigate("/");
    }
  }, [user, navigate]);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <div className="flex-grow flex justify-center items-center px-4 sm:px-6 py-8">
        <form onSubmit={handleSubmit} className="w-full max-w-md sm:max-w-lg md:max-w-xl border border-gray-200 rounded-md p-4 sm:p-6 my-4 sm:my-6 md:my-10 shadow-md">
          <h1 className="font-bold text-xl mb-4 sm:mb-5">Login</h1>

          <div className="my-3">
            <Label className="text-sm sm:text-base">Email</Label>
            <Input type="email" placeholder="Enter your email" value={input.email} name="email" onChange={handleChange} className="mt-1 sm:mt-2 text-sm sm:text-base w-full p-1" />
          </div>

          <div className="my-3">
            <Label className="text-sm sm:text-base">Password</Label>
            <Input type="password" placeholder="Enter your password" value={input.password} name="password" onChange={handleChange} className="mt-1 sm:mt-2 text-sm sm:text-base w-full p-1" />
          </div>

          <div className="my-4 sm:my-5">
            <Label className="block mb-2 text-sm sm:text-base">Select your role</Label>
            <RadioGroup value={input.role} onValueChange={(value) => setInput({ ...input, role: value })} className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="buyer" id="buyer" />
                <Label htmlFor="buyer" className="text-sm sm:text-base">
                  Buyer
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="seller" id="seller" />
                <Label htmlFor="seller" className="text-sm sm:text-base">
                  Seller
                </Label>
              </div>
            </RadioGroup>
          </div>

          <Button type="submit" className="w-full my-3 sm:my-4" disabled={loading}>
            {loading ? "Please wait..." : "Login"}
          </Button>

          <div className="text-xs sm:text-sm text-center sm:text-left">
            Don't have an account?{" "}
            <Link to="/register" className="text-blue-600 hover:underline">
              Click here to create an account
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
