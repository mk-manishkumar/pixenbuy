import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Home from './pages/Home';
import Category from './pages/Category';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import ProductDetails from './components/SharedComponents/ProductDetails';

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
    path: "/product/:id",
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
