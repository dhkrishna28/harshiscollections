import { BrowserRouter as Router, Routes, Route } from "react-router";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/common/ProtectedRoute";
import SignIn from "./pages/AuthPages/SignIn";
import NotFound from "./pages/OtherPage/NotFound";
import AppLayout from "./layout/AppLayout";
import { ScrollToTop } from "./components/common/ScrollToTop";
import Home from "./pages/Dashboard/Home";
import ProductList from "./pages/Ecommerce/ProductList";
import AddProduct from "./pages/Ecommerce/AddProduct";
import EditProduct from "./pages/Ecommerce/EditProduct";
import Transactions from "./pages/Ecommerce/Transactions";
import SingleTransaction from "./pages/Ecommerce/SingleTransaction";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      staleTime: 30_000,
    },
  },
});

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
      <Router basename="/admin">
        <ScrollToTop />
        <Routes>
          {/* Protected Dashboard Layout */}
          <Route element={<ProtectedRoute />}>
          <Route element={<AppLayout />}>
            <Route index path="/" element={<Home />} />

            {/* Ecommerce */}
            <Route path="/products" element={<ProductList />} />
            <Route path="/products/:id" element={<EditProduct />} />
            <Route path="/add-product" element={<AddProduct />} />
            <Route path="/transactions" element={<Transactions />} />
            <Route path="/transactions/:id" element={<SingleTransaction />} />
          </Route>
          </Route>

          {/* Auth Layout */}
          <Route path="/signin" element={<SignIn />} />

          {/* Fallback Route */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
      </AuthProvider>
    </QueryClientProvider>
  );
}
