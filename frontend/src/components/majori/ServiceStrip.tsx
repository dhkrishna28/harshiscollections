const items = [
  {
    title: "Worldwide Shipping",
    desc: "Order Above $100",
    icon: (
      <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" className="flex-none">
        <path d="M3 7h11v9H3z" />
        <path d="M14 10h4l3 3v3h-7" />
        <circle cx="7" cy="18" r="2" />
        <circle cx="17" cy="18" r="2" />
        <path d="M7 13l1.5 1.5L11 12" />
      </svg>
    ),
  },
  {
    title: "Money Back Guarantee",
    desc: "Guarantee Within 30 Days",
    icon: (
      <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" className="flex-none">
        <circle cx="14" cy="9" r="5" />
        <text x="11.5" y="12" fontSize="6" fill="currentColor" stroke="none">$</text>
        <path d="M3 19c2-2 5-3 9-3" />
      </svg>
    ),
  },
  {
    title: "Offers And Discounts",
    desc: "Easy Returns In 7 Days",
    icon: (
      <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" className="flex-none">
        <rect x="4" y="9" width="16" height="11" />
        <path d="M3 9h18l-2-3H5z" />
        <path d="M12 9v11" />
        <path d="M9 6c0-1.5 1.5-3 3-3s3 1.5 3 3" />
      </svg>
    ),
  },
  {
    title: "24/7 Support Services",
    desc: "Any Time Support",
    icon: (
      <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" className="flex-none">
        <path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A15 15 0 0 1 3 6a2 2 0 0 1 2-2z" />
        <circle cx="18" cy="6" r="3" />
        <text x="16" y="8" fontSize="5" fill="currentColor" stroke="none">?</text>
      </svg>
    ),
  },
];

const ServiceStrip = () => (
  <section className="bg-white py-8">
    <div className="max-w-7xl mx-auto px-4">
      <div className="border border-ink/10 rounded-md px-4 md:px-10 py-8 grid grid-cols-2 md:grid-cols-4 gap-8 items-center">
        {items.map((it) => (
          <div key={it.title} className="flex items-center gap-4">
            {it.icon}
            <div>
              <p className="font-semibold">{it.title}</p>
              <p className="text-xs text-mute">{it.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  </section>
);

export default ServiceStrip;
