import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Home from './pages/Home';
import Category from './pages/Category';
import ProductDetails from './pages/ProductDetails';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';

const appRouter = createBrowserRouter([
  {
    path: "/",
    element: (
        <Home />
    ),
  },
  {
    path: "/categories",
    element: (
        <Category />
    ),
  },
  {
    path: "/products/:id",
    element: (
        <ProductDetails />
    ),
  },
  {
    path: "/cart",
    element: (
        <Cart />
    ),
  },
  {
    path: "/checkout",
    element: (
        <Checkout />
    ),
  },
  
]);

const App = () => {
  return (
      <RouterProvider router={appRouter} />
  )
}

export default App
