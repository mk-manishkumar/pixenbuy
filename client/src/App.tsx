import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { useEffect } from "react";
import { useAuth, useUser } from "@clerk/clerk-react";
import { setTokenGetter } from "./api/backendApi";
import { useCreateUser } from "./hooks/useUserQuery";
import Home from "./pages/Home";
import Category from "./pages/Category";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import Profile from "./pages/Profile";
import AdminDashboard from "./pages/AdminDashboard";
import AdminUsers from "./pages/AdminUsers";
import AdminShipments from "./pages/AdminShipments";
import ProductDetails from "./components/SharedComponents/ProductDetails";
import ErrorPage from "./pages/ErrorPage";
import AiChatWidget from "./components/SharedComponents/AiChatWidget";

const appRouter = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
    errorElement: <ErrorPage />,
  },
  {
    path: "/categories",
    element: <Category />,
    errorElement: <ErrorPage />,
  },
  {
    path: "/product/:slug",
    element: <ProductDetails />,
    errorElement: <ErrorPage />,
  },
  {
    path: "/cart",
    element: <Cart />,
    errorElement: <ErrorPage />,
  },
  {
    path: "/checkout",
    element: <Checkout />,
    errorElement: <ErrorPage />,
  },
  {
    path: "/profile",
    element: <Profile />,
    errorElement: <ErrorPage />,
  },
  {
    path: "/sign-in/*",
    element: <SignIn />,
  },
  {
    path: "/sign-up/*",
    element: <SignUp />,
  },
  {
    path: "/admin/dashboard",
    element: <AdminDashboard />,
    errorElement: <ErrorPage />,
  },
  {
    path: "/admin/users",
    element: <AdminUsers />,
    errorElement: <ErrorPage />,
  },
  {
    path: "/admin/shipments",
    element: <AdminShipments />,
    errorElement: <ErrorPage />,
  },

  {
    path: "*",
    element: <ErrorPage />,
  },
]);

const App = () => {
  const { getToken, isSignedIn, userId } = useAuth();
  const { user } = useUser();
  const { mutate: createUser } = useCreateUser();

  // Wire up the Clerk token getter for the backend API client
  useEffect(() => {
    setTokenGetter(() => getToken());
  }, [getToken]);

  // Auto-create backend user profile on first sign-in
  useEffect(() => {
    if (isSignedIn && userId && user) {
      createUser({ 
        email: user.primaryEmailAddress?.emailAddress || "", 
        name: user.fullName || "" 
      });
    }
  }, [isSignedIn, userId, user, createUser]);

  return (
    <>
      <RouterProvider router={appRouter} />
      <AiChatWidget />
    </>
  );
};

export default App;
