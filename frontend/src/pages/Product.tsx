import { useState } from "react";
import { Link } from "react-router-dom";
import Header from "@/components/majori/Header";
import Footer from "@/components/majori/Footer";
import Newsletter from "@/components/majori/Newsletter";
import ServiceStrip from "@/components/majori/ServiceStrip";
import CartDrawer from "@/components/majori/CartDrawer";
import MenuDrawer from "@/components/majori/MenuDrawer";
import ProductGallery from "@/components/majori/ProductGallery";
import ProductInfo, {
  type ProductInfoData,
} from "@/components/majori/ProductInfo";
import ProductTabs from "@/components/majori/ProductTabs";
import ProductCard, {
  type ListingProduct,
} from "@/components/majori/ProductCard";

const images = [
  "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=800&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1496747611176-843222e1e57c?w=800&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1554568218-0f1715e72254?w=800&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?w=800&auto=format&fit=crop&q=80",
];

const productData: ProductInfoData = {
  brand: "Harshis Collections Atelier",
  name: "Malesuada Fames Ac Turpis",
  rating: 5,
  reviewCount: 24,
  price: "$89.00",
  oldPrice: "$120.00",
  savePct: 26,
  description:
    "Cotton blend midi dress with relaxed silhouette, hand-finished seams and signature scalloped hem. Designed in our New York studio.",
  colors: [
    { name: "Sand", className: "bg-sand" },
    { name: "Rose", className: "bg-rose" },
    { name: "Ink", className: "bg-ink" },
    { name: "Brand", className: "bg-brand" },
  ],
  sizes: ["XS", "S", "M", "L", "XL"],
};

const details = [
  "Material: 95% organic cotton, 5% elastane",
  "Length: Midi (104cm)",
  "Fit: Relaxed",
  "Care: Machine wash cold, line dry",
  "Made in Portugal",
];

const reviews = [
  {
    name: "Emma W.",
    rating: 5,
    text: "Beautiful dress, fits perfectly. The fabric is soft and flowy.",
  },
  {
    name: "Sophia L.",
    rating: 5,
    text: "Got many compliments. Worth every penny.",
  },
];

const related: ListingProduct[] = [
  {
    id: 1,
    name: "Floral Print Dress",
    price: "$59.00",
    oldPrice: "$79.00",
    badge: { label: "Sale", tone: "sale" },
    img: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=600&auto=format&fit=crop&q=80",
    href: "/product",
  },
  {
    id: 2,
    name: "Silk Blouse",
    price: "$89.00",
    badge: { label: "New", tone: "new" },
    img: "https://images.unsplash.com/photo-1518049362265-d5b2a6b00b37?w=600&auto=format&fit=crop&q=80",
    href: "/product",
  },
  {
    id: 3,
    name: "Linen Trousers",
    price: "$69.00",
    img: "https://images.unsplash.com/photo-1551803091-e20673f15770?w=600&auto=format&fit=crop&q=80",
    href: "/product",
  },
  {
    id: 4,
    name: "Wool Coat",
    price: "$199.00",
    badge: { label: "Hot", tone: "hot" },
    img: "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?w=600&auto=format&fit=crop&q=80",
    href: "/product",
  },
];

const Product = () => {
  const [cartOpen, setCartOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="bg-cream text-ink antialiased min-h-screen">
      <Header
        onOpenCart={() => setCartOpen(true)}
        onOpenMenu={() => setMenuOpen(true)}
      />

      <section className="bg-white border-b border-ink/5">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <h2 className="sr-only">Product</h2>
          <nav className="text-sm text-mute mt-2">
            <Link to="/" className="hover:text-brand">
              Home
            </Link>{" "}
            <span className="text-mute">/</span>{" "}
            <Link to="/collection" className="hover:text-brand">
              Shop
            </Link>{" "}
            <span className="text-mute">/</span>{" "}
            <span className="text-ink">{productData.name}</span>
          </nav>
        </div>
      </section>

      <section className="py-10 md:py-14">
        <div className="max-w-7xl mx-auto px-4 grid md:grid-cols-2 gap-10">
          <ProductGallery images={images} alt={productData.name} />
          <ProductInfo data={productData} />
        </div>

        <ProductTabs
          description={productData.description}
          details={details}
          reviews={reviews}
        />

        <div className="max-w-7xl mx-auto px-4 mt-20">
          <h2 className="font-display text-2xl md:text-3xl font-semibold mb-8 text-center">
            You May Also Like
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-5 md:gap-7">
            {related.map((p) => (
              <ProductCard key={p.id} p={p} />
            ))}
          </div>
        </div>
      </section>

      <ServiceStrip />
      <Newsletter />
      <Footer />

      <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} />
      <MenuDrawer open={menuOpen} onClose={() => setMenuOpen(false)} />
    </div>
  );
};

export default Product;
