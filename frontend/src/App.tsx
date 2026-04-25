import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Index from "@/pages/Index.tsx";
import Collection from "@/pages/Collection.tsx";
import Product from "@/pages/Product.tsx";
import Cart from "@/pages/Cart.tsx";
import Checkout from "@/pages/Checkout.tsx";
import Login from "@/pages/Login.tsx";
import Signup from "@/pages/Signup.tsx";
import ThankYou from "@/pages/ThankYou.tsx";
import Account from "@/pages/Account.tsx";
import About from "@/pages/About.tsx";
import Blog from "@/pages/Blog.tsx";
import BlogPost from "@/pages/BlogPost.tsx";
import Orders from "@/pages/Orders.tsx";
import OrderDetail from "@/pages/OrderDetail.tsx";
import Terms from "@/pages/Terms.tsx";
import Faq from "@/pages/Faq.tsx";
import Contact from "@/pages/Contact.tsx";
import Wishlist from "@/pages/Wishlist.tsx";
import Blank from "@/pages/Blank.tsx";
import NotFound from "@/pages/NotFound.tsx";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/collection" element={<Collection />} />
          <Route path="/product" element={<Product />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/thank-you" element={<ThankYou />} />
          <Route path="/account" element={<Account />} />
          <Route path="/about" element={<About />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/blog/:slug" element={<BlogPost />} />
          <Route path="/orders" element={<Orders />} />
          <Route path="/orders/:id" element={<OrderDetail />} />
          <Route path="/terms" element={<Terms />} />
          <Route path="/faq" element={<Faq />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/wishlist" element={<Wishlist />} />
          <Route path="/blank" element={<Blank />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
