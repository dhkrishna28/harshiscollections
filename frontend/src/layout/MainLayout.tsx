import { useState } from "react";
import { Outlet } from "react-router-dom";
import Header from "../components/majori/Header";
import Footer from "../components/majori/Footer";
import CartDrawer from "../components/majori/CartDrawer";
import MenuDrawer from "../components/majori/MenuDrawer";
import { useCart } from "../context/CartContext";

export default function MainLayout() {
  const [cartOpen, setCartOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const { itemCount } = useCart();

  return (
    <div className="min-h-screen flex flex-col bg-cream text-ink antialiased">
      <Header
        onOpenCart={() => setCartOpen(true)}
        onOpenMenu={() => setMenuOpen(true)}
        cartCount={itemCount}
      />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
      <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} />
      <MenuDrawer open={menuOpen} onClose={() => setMenuOpen(false)} />
    </div>
  );
}
