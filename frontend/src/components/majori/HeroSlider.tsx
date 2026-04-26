import { useEffect, useState } from "react";

const slides = [
  {
    type: "gallery" as const,
    layout: "three-up",
    images: [
      "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?w=1200&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?w=1200&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=1200&auto=format&fit=crop&q=80",
    ],
    eyebrow: "New Collection",
    title: "Effortless Spring Style",
    desc: "Lightweight fabrics, soft hues and timeless silhouettes — designed for modern everyday elegance.",
    primary: "Shop Now",
    secondary: "Lookbook",
    light: true,
  },
  {
    type: "gallery" as const,
    layout: "two-up",
    images: [
      "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=1200&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=1200&auto=format&fit=crop&q=80",
    ],
    eyebrow: "Limited Edition",
    title: "Bold Hues, Soft Silhouettes",
    desc: "Discover statement pieces crafted to turn heads and define your unique style.",
    primary: "Discover",
    secondary: "Stories",
    light: true,
  },
  {
    type: "single" as const,
    image: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=1600&auto=format&fit=crop&q=80",
    eyebrow: "Capsule Edit",
    title: "Quiet Luxury Wear",
    desc: "Refined essentials in neutral tones — built to outlast every season.",
    primary: "Explore",
    light: false,
  },
];

const HeroSlider = () => {
  const [current, setCurrent] = useState(0);

  const goTo = (i: number) => setCurrent(((i % slides.length) + slides.length) % slides.length);
  const next = () => goTo(current + 1);
  const prev = () => goTo(current - 1);

  useEffect(() => {
    const id = setInterval(() => setCurrent((c) => (c + 1) % slides.length), 6000);
    return () => clearInterval(id);
  }, []);

  return (
    <section className="relative">
      <div className="slider">
        <div
          className="slides"
          style={{ transform: `translateX(-${current * 100}%)` }}
        >
          {slides.map((s, idx) => (
            <div className="slide" key={idx}>
              {s.type === "gallery" ? (
                <div className={`slide-gallery ${s.layout}`}>
                  {s.images.map((src, i) => (
                    <img key={i} className="gallery-img" src={src} loading="lazy" decoding="async" alt={`slide ${idx + 1} ${i + 1}`} />
                  ))}
                </div>
              ) : (
                <img className="slide-img" src={s.image} loading="lazy" decoding="async" alt={s.title} />
              )}
              <div className="slide-overlay">
                <div className="max-w-7xl mx-auto px-4 py-16 md:py-28 w-full">
                  <div className={`slide-content ${s.light ? "text-white" : "text-ink"}`}>
                    <p className={`uppercase tracking-[0.3em] text-sm mb-4 ${s.light ? "text-white/80" : "text-mute"}`}>
                      {s.eyebrow}
                    </p>
                    <h2 className="font-display text-3xl md:text-6xl leading-tight mb-4">{s.title}</h2>
                    <p className={`mb-6 max-w-lg ${s.light ? "text-white/90" : "text-ink/80"}`}>{s.desc}</p>
                    <div className="flex gap-3 justify-center md:justify-start">
                      {s.light ? (
                        <a href="#" className="bg-white text-ink px-6 py-3 text-sm uppercase tracking-wider hover:bg-brand hover:text-white transition">
                          {s.primary}
                        </a>
                      ) : (
                        <a href="#" className="bg-ink text-white px-6 py-3 text-sm uppercase tracking-wider hover:bg-brand transition">
                          {s.primary}
                        </a>
                      )}
                      {"secondary" in s && s.secondary && (
                        <a href="#" className="border border-white/30 text-white px-6 py-3 text-sm uppercase tracking-wider hover:bg-white hover:text-ink transition">
                          {s.secondary}
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <button
          onClick={prev}
          aria-label="Previous slide"
          className="absolute left-3 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white w-10 h-10 rounded-full grid place-items-center shadow z-10"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M15 18l-6-6 6-6" />
          </svg>
        </button>
        <button
          onClick={next}
          aria-label="Next slide"
          className="absolute right-3 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white w-10 h-10 rounded-full grid place-items-center shadow z-10"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M9 6l6 6-6 6" />
          </svg>
        </button>
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 z-10">
          {slides.map((_, i) => (
            <button
              key={i}
              onClick={() => goTo(i)}
              aria-label={`Go to slide ${i + 1}`}
              className={`h-2 rounded-full transition ${i === current ? "bg-ink w-6" : "bg-ink/30 w-2"}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default HeroSlider;
