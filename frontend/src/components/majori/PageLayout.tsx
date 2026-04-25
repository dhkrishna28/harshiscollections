import { ReactNode, useState } from "react";
import Header from "@/components/majori/Header";
import Footer from "@/components/majori/Footer";
import CartDrawer from "@/components/majori/CartDrawer";
import MenuDrawer from "@/components/majori/MenuDrawer";

interface Props {
  children: ReactNode;
}

const PageLayout = ({ children }: Props) => {
  const [cartOpen, setCartOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="bg-cream text-ink antialiased min-h-screen flex flex-col">
      <Header
        onOpenCart={() => setCartOpen(true)}
        onOpenMenu={() => setMenuOpen(true)}
      />
      <main className="flex-1">{children}</main>
      <Footer />
      <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} />
      <MenuDrawer open={menuOpen} onClose={() => setMenuOpen(false)} />
    </div>
  );
};

export default PageLayout;
