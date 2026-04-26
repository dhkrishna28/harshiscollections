import { useState } from "react";
import Rating from "./Rating";

interface Product {
  category: string;
  name: string;
  price: string;
  oldPrice?: string;
  badge?: { label: string; tone: "sale" | "new" | "hot" };
  img: string;
  rating: number;
}

const featured: Product[] = [
  { category: "Dresses", name: "Floral Midi Dress", price: "$89", oldPrice: "$120", badge: { label: "Sale", tone: "sale" }, rating: 4, img: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=600&auto=format&fit=crop&q=80" },
  { category: "Tops", name: "Linen Blouse", price: "$65", badge: { label: "New", tone: "new" }, rating: 4.5, img: "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?w=600&auto=format&fit=crop&q=80" },
  { category: "Bags", name: "Leather Tote", price: "$145", rating: 4.2, img: "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=600&auto=format&fit=crop&q=80" },
  { category: "Footwear", name: "White Sneakers", price: "$95", badge: { label: "Hot", tone: "hot" }, rating: 4.8, img: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&auto=format&fit=crop&q=80" },
];

const newArrivals: Product[] = [
  { category: "Outerwear", name: "Wool Coat", price: "$220", badge: { label: "New", tone: "new" }, rating: 4.3, img: "https://images.unsplash.com/photo-1485231183945-fffde7cc051e?w=600&auto=format&fit=crop&q=80" },
  { category: "Accessories", name: "Silk Scarf", price: "$48", badge: { label: "New", tone: "new" }, rating: 4.1, img: "https://images.unsplash.com/photo-1492707892479-7bc8d5a4ee93?w=600&auto=format&fit=crop&q=80" },
  { category: "Jewelry", name: "Gold Hoops", price: "$78", badge: { label: "New", tone: "new" }, rating: 4.7, img: "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=600&auto=format&fit=crop&q=80" },
  { category: "Dresses", name: "Pleated Skirt", price: "$92", badge: { label: "New", tone: "new" }, rating: 4, img: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=600&auto=format&fit=crop&q=80" },
];

const bestSellers: Product[] = [
  { category: "Dresses", name: "Summer Dress", price: "$110", badge: { label: "Hot", tone: "hot" }, rating: 4.6, img: "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?w=600&auto=format&fit=crop&q=80" },
  { category: "Footwear", name: "Classic Sneakers", price: "$95", badge: { label: "Hot", tone: "hot" }, rating: 4.4, img: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&auto=format&fit=crop&q=80" },
  { category: "Bags", name: "Crossbody Bag", price: "$126", oldPrice: "$180", badge: { label: "-30%", tone: "sale" }, rating: 4.2, img: "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=600&auto=format&fit=crop&q=80" },
  { category: "Tops", name: "Cotton Shirt", price: "$58", badge: { label: "Hot", tone: "hot" }, rating: 4, img: "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?w=600&auto=format&fit=crop&q=80" },
];

const badgeClass = (tone: string) =>
  tone === "sale" ? "bg-accent-red text-white"
  : tone === "new" ? "bg-brand text-white"
  : "bg-rose text-ink";

const ProductCard = ({ p }: { p: Product }) => (
  <div className="group">
    <div className="relative mb-3">
      <a href="#" className="block bg-sand rounded-lg overflow-hidden aspect-[4/5]">
        <img src={p.img} alt={p.name} className="w-full h-full object-cover group-hover:scale-105 transition duration-500" />
        {p.badge && (
          <span className={`absolute top-3 left-3 ${badgeClass(p.badge.tone)} text-[10px] uppercase px-2 py-1 rounded`}>
            {p.badge.label}
          </span>
        )}
      </a>
      <button className="absolute bottom-3 left-3 right-3 bg-ink text-white text-xs uppercase tracking-wider py-3 opacity-0 group-hover:opacity-100 transition">
        Add to Cart
      </button>
    </div>
    <a href="#" className="product-link block">
      <p className="text-xs text-mute uppercase">{p.category}</p>
      <p className="font-medium">{p.name}</p>
      <Rating rating={p.rating} />
      <p className="text-sm">
        {p.oldPrice && <span className="line-through text-mute mr-2">{p.oldPrice}</span>}
        <span className={p.oldPrice ? "text-accent-red font-semibold" : "font-semibold"}>{p.price}</span>
      </p>
    </a>
  </div>
);

const tabs = [
  { id: "featured", label: "Featured", products: featured },
  { id: "new", label: "New Arrivals", products: newArrivals },
  { id: "best", label: "Best Sellers", products: bestSellers },
];

const PopularProducts = () => {
  const [active, setActive] = useState("featured");
  const current = tabs.find((t) => t.id === active)!;

  return (
    <section className="py-14 md:py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-10">
          <p className="uppercase tracking-[0.3em] text-xs text-brand mb-2">Trending Now</p>
          <h2 className="font-display text-3xl md:text-4xl mb-6">Popular Products</h2>
          <div className="flex justify-center gap-8 text-sm uppercase tracking-wider">
            {tabs.map((t) => (
              <button
                key={t.id}
                onClick={() => setActive(t.id)}
                className={`pb-2 border-b-2 transition ${active === t.id ? "border-ink text-ink" : "border-transparent text-mute"}`}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {current.products.map((p) => (
            <ProductCard key={p.name} p={p} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default PopularProducts;
