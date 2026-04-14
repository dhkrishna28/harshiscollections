import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import MainLayout from './layout/MainLayout';
import AuthLayout from './layout/AuthLayout';

// Pages
import Home from './pages/Home';
import Products from './pages/Products';
import ProductDetail from './pages/ProductDetail';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import OrderConfirmation from './pages/OrderConfirmation';
import NotFound from './pages/NotFound';

// Auth pages
import Login from './pages/Auth/Login';
import SignUp from './pages/Auth/SignUp';
import ForgotPassword from './pages/Auth/ForgotPassword';
import ResetPassword from './pages/Auth/ResetPassword';
import VerifyEmail from './pages/Auth/VerifyEmail';

// Account pages
import Profile from './pages/Account/Profile';
import OrderHistory from './pages/Account/OrderHistory';
import OrderDetail from './pages/Account/OrderDetail';

// CMS pages
import AboutUs from './pages/CMS/AboutUs';
import FAQ from './pages/CMS/FAQ';
import PrivacyPolicy from './pages/CMS/PrivacyPolicy';
import TermsConditions from './pages/CMS/TermsConditions';
import Contact from './pages/CMS/Contact';

import ProtectedRoute from './components/common/ProtectedRoute';

export default function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <BrowserRouter>
          <Routes>
            {/* Main storefront */}
            <Route element={<MainLayout />}>
              <Route path="/" element={<Home />} />
              <Route path="/products" element={<Products />} />
              <Route path="/products/:slug" element={<ProductDetail />} />
              <Route path="/cart" element={<Cart />} />
              <Route path="/checkout" element={<ProtectedRoute><Checkout /></ProtectedRoute>} />
              <Route path="/order-confirmation/:orderId" element={<ProtectedRoute><OrderConfirmation /></ProtectedRoute>} />

              {/* Account */}
              <Route path="/account/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
              <Route path="/account/orders" element={<ProtectedRoute><OrderHistory /></ProtectedRoute>} />
              <Route path="/account/orders/:id" element={<ProtectedRoute><OrderDetail /></ProtectedRoute>} />

              {/* CMS */}
              <Route path="/about-us" element={<AboutUs />} />
              <Route path="/faq" element={<FAQ />} />
              <Route path="/privacy-policy" element={<PrivacyPolicy />} />
              <Route path="/terms-conditions" element={<TermsConditions />} />
              <Route path="/contact" element={<Contact />} />
            </Route>

            {/* Auth (no header/footer) */}
            <Route element={<AuthLayout />}>
              <Route path="/auth/login" element={<Login />} />
              <Route path="/auth/signup" element={<SignUp />} />
              <Route path="/auth/forgot-password" element={<ForgotPassword />} />
              <Route path="/auth/reset-password/:token" element={<ResetPassword />} />
              <Route path="/auth/verify-email/:token" element={<VerifyEmail />} />
            </Route>

            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </CartProvider>
    </AuthProvider>
  );
}
