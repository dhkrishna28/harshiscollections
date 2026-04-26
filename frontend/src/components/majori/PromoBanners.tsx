const promos = [
  { eyebrow: "For Her", title: "Elegant Edit", img: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=600&auto=format&fit=crop&q=80" },
  { eyebrow: "For Him", title: "Modern Classics", img: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=600&auto=format&fit=crop&q=80" },
  { eyebrow: "Accessories", title: "Finishing Touches", img: "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=600&auto=format&fit=crop&q=80" },
];

const PromoBanners = () => (
  <section className="bg-cream py-10">
    <div className="max-w-7xl mx-auto px-4 grid md:grid-cols-3 gap-5">
      {promos.map((p) => (
        <a key={p.title} href="#" aria-label={`${p.eyebrow} — ${p.title}`} className="relative rounded-lg overflow-hidden h-56 group block focus:outline-none focus:ring-4 focus:ring-brand/30">
          <img src={p.img} alt={p.title} className="w-full h-full object-cover group-hover:scale-105 transition duration-700" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
          <div className="absolute bottom-5 left-5 text-white">
            <p className="text-xs uppercase tracking-widest opacity-80">{p.eyebrow}</p>
            <h3 className="font-display text-2xl">{p.title}</h3>
          </div>
        </a>
      ))}
    </div>
  </section>
);

export default PromoBanners;
