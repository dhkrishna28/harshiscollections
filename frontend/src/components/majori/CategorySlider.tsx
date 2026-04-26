import { useRef } from "react";

const categories = [
  { name: "Dresses", count: "42 products", img: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=400&auto=format&fit=crop&q=80" },
  { name: "Tops", count: "68 products", img: "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?w=400&auto=format&fit=crop&q=80" },
  { name: "Bags", count: "25 products", img: "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=400&auto=format&fit=crop&q=80" },
  { name: "Footwear", count: "37 products", img: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&auto=format&fit=crop&q=80" },
  { name: "Jewelry", count: "19 products", img: "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=400&auto=format&fit=crop&q=80" },
  { name: "Outerwear", count: "22 products", img: "https://images.unsplash.com/photo-1485231183945-fffde7cc051e?w=400&auto=format&fit=crop&q=80" },
  { name: "Accessories", count: "54 products", img: "https://images.unsplash.com/photo-1492707892479-7bc8d5a4ee93?w=400&auto=format&fit=crop&q=80" },
];

const CategorySlider = () => {
  const ref = useRef<HTMLDivElement>(null);
  const scroll = (dir: number) => ref.current?.scrollBy({ left: dir * 400, behavior: "smooth" });

  return (
    <section className="bg-white py-12 md:py-16">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-end justify-between mb-8">
          <div>
            <p className="uppercase tracking-[0.3em] text-xs text-brand mb-2">Browse by category</p>
            <h2 className="font-display text-3xl md:text-4xl">Shop by Style</h2>
          </div>
          <div className="flex gap-2">
            <button onClick={() => scroll(-1)} aria-label="Scroll left" className="w-10 h-10 border border-ink/20 hover:border-ink rounded-full grid place-items-center">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M15 18l-6-6 6-6" /></svg>
            </button>
            <button onClick={() => scroll(1)} aria-label="Scroll right" className="w-10 h-10 border border-ink/20 hover:border-ink rounded-full grid place-items-center">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 6l6 6-6 6" /></svg>
            </button>
          </div>
        </div>
        <div ref={ref} className="flex gap-6 overflow-x-auto no-scrollbar scroll-smooth px-2 py-2">
          {categories.map((c) => (
            <a key={c.name} href="#" className="flex-none w-40 text-center group">
              <div className="w-40 h-40 rounded-full overflow-hidden bg-sand mb-3 group-hover:ring-4 group-hover:ring-brand/30 transition">
                <img src={c.img} alt={c.name} className="w-full h-full object-cover" />
              </div>
              <p className="font-medium">{c.name}</p>
              <div className="relative h-5">
                <p className="text-xs text-mute absolute inset-0 flex items-center justify-center transition-all duration-200 group-hover:opacity-0">
                  {c.count}
                </p>
                <p className="text-sm text-brand font-semibold uppercase underline underline-offset-2 absolute inset-0 flex items-center justify-center opacity-0 transition-all duration-200 group-hover:opacity-100">
                  Shop now
                </p>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CategorySlider;
