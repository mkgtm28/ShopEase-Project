import { BrowserRouter, Routes, Route } from "react-router-dom";

import { CartProvider } from "./context/CartContext";

import Navbar from "./components/Navbar";

import Home from "./pages/Home";
import Products from "./pages/Products";
import ProductDetails from "./pages/ProductDetails";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import Orders from "./pages/Orders";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import Wishlist from "./pages/Wishlist";
import Profile from "./pages/Profile";
import OrderDetails from "./pages/OrderDetails";
import ScrollToTop from "./components/ScrollToTop";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import { WishlistProvider } from "./context/WishlistContext";
function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <WishlistProvider>
          <CartProvider>
            <ScrollToTop />
            <Navbar />

            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/products" element={<Products />} />
              <Route path="/products/:id" element={<ProductDetails />} />
              <Route path="/wishlist" element={<Wishlist />} />
              
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/cart" element={<Cart />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/reset-password" element={<ResetPassword />} />


              <Route
                path="/checkout"
                element={
                  <ProtectedRoute>
                    <Checkout />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/orders"
                element={
                  <ProtectedRoute>
                    <Orders />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/profile"
                element={
                  <ProtectedRoute>
                    <Profile />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/orders/:id"
                element={
                  <ProtectedRoute>
                    <OrderDetails />
                  </ProtectedRoute>
                }
              />
            </Routes>
          </CartProvider>
        </WishlistProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;