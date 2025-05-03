import React from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Login from "./components/auth/Login";
import Signup from "./components/auth/Signup";
import Home from './components/pages/Home';
import Category from './components/pages/Category';
import { Toaster } from "@/components/ui/sonner"; 

const appRouter = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/signup",
    element: <Signup />,
  },
  {
    path: "/category",
    element: <Category />,
  },
]);

const App = () => {
  return (
    <>
      <Toaster richColors position="top-center" /> 
      <RouterProvider router={appRouter} />
    </>
  );
};

export default App;
