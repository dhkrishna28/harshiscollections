import { useState } from "react";
import Header from "@/components/majori/Header";
import HeroSlider from "@/components/majori/HeroSlider";
import CategorySlider from "@/components/majori/CategorySlider";
import PromoBanners from "@/components/majori/PromoBanners";
import PopularProducts from "@/components/majori/PopularProducts";
import ServiceStrip from "@/components/majori/ServiceStrip";
import DiscountBanner from "@/components/majori/DiscountBanner";
import Reviews from "@/components/majori/Reviews";
import Newsletter from "@/components/majori/Newsletter";
import Footer from "@/components/majori/Footer";
import CartDrawer from "@/components/majori/CartDrawer";
import MenuDrawer from "@/components/majori/MenuDrawer";

const Index = () => {
  const [cartOpen, setCartOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="bg-cream text-ink antialiased">
      <h1 className="sr-only">Harshis Collections — Modern Fashion Store</h1>
      <Header
        onOpenCart={() => setCartOpen(true)}
        onOpenMenu={() => setMenuOpen(true)}
      />
      <main>
        <HeroSlider />
        <CategorySlider />
        <PromoBanners />
        <PopularProducts />
        <ServiceStrip />
        <DiscountBanner />
        <Reviews />
        <Newsletter />
      </main>
      <Footer />
      <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} />
      <MenuDrawer open={menuOpen} onClose={() => setMenuOpen(false)} />
    </div>
  );
};

export default Index;
