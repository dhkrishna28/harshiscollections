import { useRef } from "react";

const reviews = [
  { name: "Emma Wilson", img: "https://i.pravatar.cc/80?img=47", text: "Absolutely love the quality and fit. The fabric feels luxurious and the styling is perfect for everyday wear." },
  { name: "Sophia Lee", img: "https://i.pravatar.cc/80?img=32", text: "Best fashion store I've ordered from. Fast shipping, beautiful packaging and the dress is even better in person." },
  { name: "Olivia Brown", img: "https://i.pravatar.cc/80?img=12", text: "Great customer service and timeless pieces. I keep coming back season after season for the perfect basics." },
  { name: "Ava Martinez", img: "https://i.pravatar.cc/80?img=20", text: "The minimalist designs are exactly what I was searching for. Quality stitching and perfectly cut for any occasion." },
  { name: "Mia Johnson", img: "https://i.pravatar.cc/80?img=5", text: "Elegant pieces, fair prices and consistently amazing experience. My new go-to wardrobe destination." },
];

const Reviews = () => {
  const ref = useRef<HTMLDivElement>(null);
  const scroll = (dir: number) => {
    const track = ref.current;
    if (!track) return;
    const card = track.querySelector(".review-card") as HTMLElement | null;
    if (!card) return;
    track.scrollBy({ left: dir * (card.offsetWidth + 24), behavior: "smooth" });
  };

  return (
    <section className="bg-white py-14 md:py-20">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-10">
          <p className="uppercase tracking-[0.3em] text-xs text-brand mb-2">Testimonials</p>
          <h2 className="font-display text-3xl md:text-4xl">Customer Reviews</h2>
        </div>
        <div className="relative">
          <button
            onClick={() => scroll(-1)}
            aria-label="Previous review"
            className="absolute -left-2 md:-left-5 top-1/2 -translate-y-1/2 z-10 w-10 h-10 bg-white border border-ink/20 hover:bg-ink hover:text-white rounded-full grid place-items-center shadow"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M15 18l-6-6 6-6" /></svg>
          </button>
          <button
            onClick={() => scroll(1)}
            aria-label="Next review"
            className="absolute -right-2 md:-right-5 top-1/2 -translate-y-1/2 z-10 w-10 h-10 bg-white border border-ink/20 hover:bg-ink hover:text-white rounded-full grid place-items-center shadow"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 6l6 6-6 6" /></svg>
          </button>

          <div ref={ref} className="reviews-track flex gap-6 overflow-x-auto no-scrollbar scroll-smooth">
            {reviews.map((r) => (
              <div key={r.name} className="review-card flex-none w-full md:w-[calc(33.333%-1rem)] bg-cream rounded-lg p-7">
                <div className="flex text-brand mb-3">★★★★★</div>
                <p className="text-ink/80 mb-5">"{r.text}"</p>
                <div className="flex items-center gap-3">
                  <img src={r.img} alt={r.name} className="w-11 h-11 rounded-full object-cover" />
                  <div>
                    <p className="font-semibold">{r.name}</p>
                    <p className="text-xs text-mute">Verified Buyer</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Reviews;
