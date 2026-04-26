import { HelmetProvider } from "react-helmet-async";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Navigate, Route, Routes, useParams } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "./context/AuthContext";
import { CartProvider } from "./context/CartContext";
import Index from "./pages/Index";
import Collection from "./pages/Collection";
import Product from "./pages/Product";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import ThankYou from "./pages/ThankYou";
import Account from "./pages/Account";
import About from "./pages/About";
import Orders from "./pages/Orders";
import OrderDetail from "./pages/OrderDetail";
import Terms from "./pages/Terms";
import Faq from "./pages/Faq";
import Contact from "./pages/Contact";
import NotFound from "./pages/NotFound";
import ProtectedRoute from "./components/common/ProtectedRoute";
import AuthLogin from "./pages/Auth/Login";
import AuthSignUp from "./pages/Auth/SignUp";
import ForgotPassword from "./pages/Auth/ForgotPassword";
import ResetPassword from "./pages/Auth/ResetPassword";
import VerifyEmail from "./pages/Auth/VerifyEmail";

const queryClient = new QueryClient();

function LegacyProductRedirect() {
  const { slug } = useParams();
  return <Navigate to={slug ? `/product/${slug}` : "/collection"} replace />;
}

function LegacyOrderConfirmationRedirect() {
  const { orderId } = useParams();
  return <Navigate to={orderId ? `/thank-you/${orderId}` : "/orders"} replace />;
}

function LegacyOrderDetailRedirect() {
  const { id } = useParams();
  return <Navigate to={id ? `/orders/${id}` : "/orders"} replace />;
}

export default function App() {
  return (
    <HelmetProvider>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <CartProvider>
            <TooltipProvider>
              <Toaster />
              <Sonner />
              <BrowserRouter>
                <Routes>
                  <Route path="/" element={<Index />} />
                  <Route path="/collection" element={<Collection />} />
                  <Route path="/product/:slug" element={<Product />} />
                  <Route path="/cart" element={<Cart />} />
                  <Route
                    path="/checkout"
                    element={
                      <ProtectedRoute>
                        <Checkout />
                      </ProtectedRoute>
                    }
                  />
                  <Route path="/login" element={<Login />} />
                  <Route path="/signup" element={<Signup />} />
                  <Route path="/auth/login" element={<AuthLogin />} />
                  <Route path="/auth/signup" element={<AuthSignUp />} />
                  <Route path="/auth/forgot-password" element={<ForgotPassword />} />
                  <Route path="/auth/reset-password/:token" element={<ResetPassword />} />
                  <Route path="/auth/verify-email/:token" element={<VerifyEmail />} />
                  <Route
                    path="/thank-you/:orderId"
                    element={
                      <ProtectedRoute>
                        <ThankYou />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/account"
                    element={
                      <ProtectedRoute>
                        <Account />
                      </ProtectedRoute>
                    }
                  />
                  <Route path="/about" element={<About />} />
                  <Route
                    path="/orders"
                    element={
                      <ProtectedRoute>
                        <Orders />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/orders/:id"
                    element={
                      <ProtectedRoute>
                        <OrderDetail />
                      </ProtectedRoute>
                    }
                  />
                  <Route path="/terms" element={<Terms />} />
                  <Route path="/faq" element={<Faq />} />
                  <Route path="/contact" element={<Contact />} />
                  <Route path="/products" element={<Navigate to="/collection" replace />} />
                  <Route path="/products/:slug" element={<LegacyProductRedirect />} />
                  <Route path="/about-us" element={<Navigate to="/about" replace />} />
                  <Route path="/order-confirmation/:orderId" element={<LegacyOrderConfirmationRedirect />} />
                  <Route path="/account/orders" element={<Navigate to="/orders" replace />} />
                  <Route path="/account/orders/:id" element={<LegacyOrderDetailRedirect />} />
                  <Route path="/account/profile" element={<Navigate to="/account#profile" replace />} />
                  <Route path="/privacy-policy" element={<Navigate to="/terms" replace />} />
                  <Route path="/terms-conditions" element={<Navigate to="/terms" replace />} />
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </BrowserRouter>
            </TooltipProvider>
          </CartProvider>
        </AuthProvider>
      </QueryClientProvider>
    </HelmetProvider>
  );
}
