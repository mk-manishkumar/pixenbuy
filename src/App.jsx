import React from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Login from "./components/auth/Login";
import Register from "./components/auth/Register";
import Home from './components/pages/Home';
import Category from './components/pages/Category';

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
    element: <Register />,
  },
  {
    path: "/category",
    element: <Category />,
  },
]);

const App = () => {
  return (
    <RouterProvider router={appRouter} />
  );
};

export default App;
