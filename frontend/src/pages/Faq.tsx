import { Link } from "react-router-dom";
import PageLayout from "@/components/majori/PageLayout";
import FaqAccordion, { FaqItem } from "@/components/majori/FaqAccordion";

const groups: { title: string; items: FaqItem[] }[] = [
  {
    title: "Shipping & Delivery",
    items: [
      { q: "How long does shipping take?", a: "Standard shipping is 3-5 business days within the US. International orders take 7-14 business days depending on destination." },
      { q: "Do you ship internationally?", a: "Yes, we ship to over 60 countries worldwide. Shipping rates and delivery times are calculated at checkout." },
      { q: "Is shipping free?", a: "Free standard shipping is offered on all orders above $100 within the US." },
      { q: "How can I track my order?", a: "Once your order ships, you will receive an email with a tracking link. You can also track from your account under Order History." },
    ],
  },
  {
    title: "Returns & Exchanges",
    items: [
      { q: "What is your return policy?", a: "We offer free returns within 30 days of delivery. Items must be unworn, unwashed and have the original tags attached." },
      { q: "How do I start a return?", a: "Go to your Order History, select the order and click \"Request Return\". A prepaid label will be emailed to you." },
      { q: "When will I get my refund?", a: "Refunds are processed within 5-7 business days after we receive your return." },
    ],
  },
  {
    title: "Sizing & Fit",
    items: [
      { q: "Where can I find the size guide?", a: "Each product page has a size guide link below the size selector. We also publish a master size chart in the footer." },
      { q: "What if my item does not fit?", a: "You can exchange for a different size within 30 days. We cover the shipping for the first exchange." },
    ],
  },
  {
    title: "Account & Orders",
    items: [
      { q: "Do I need an account to order?", a: "No, guest checkout is available. However, an account lets you track orders, save addresses and earn reward points." },
      { q: "Can I modify or cancel my order?", a: "Orders can be modified within 1 hour of placement. Contact support immediately if you need changes." },
      { q: "How do reward points work?", a: "You earn 1 point per $1 spent. 100 points = $5 off your next order." },
    ],
  },
  {
    title: "Payment & Security",
    items: [
      { q: "What payment methods do you accept?", a: "We accept Visa, Mastercard, American Express, PayPal, Apple Pay, Google Pay and Klarna." },
      { q: "Is my payment information secure?", a: "Yes. All transactions are encrypted with 256-bit SSL and processed via PCI-DSS compliant providers." },
    ],
  },
];

const Faq = () => (
  <PageLayout>
    <section className="bg-sand py-12 md:py-16">
      <div className="max-w-7xl mx-auto px-4 text-center">
        <h1 className="font-display text-3xl md:text-5xl">Frequently Asked Questions</h1>
        <p className="text-mute mt-2 text-sm">
          <Link to="/" className="hover:text-brand">
            Home
          </Link>{" "}
          / <span className="text-ink">FAQ</span>
        </p>
      </div>
    </section>

    <section className="max-w-4xl mx-auto px-4 py-14">
      <div className="text-center mb-10">
        <p className="text-mute">
          Find answers to common questions. Can't find what you're looking for?{" "}
          <Link to="/contact" className="text-brand hover:underline">
            Contact us
          </Link>
          .
        </p>
        <div className="mt-6 max-w-md mx-auto flex items-center gap-2">
          <input
            type="search"
            placeholder="Search questions..."
            className="flex-1 border border-ink/15 px-4 py-3 rounded focus:border-ink outline-none"
          />
          <button className="bg-ink text-white px-5 py-3 rounded hover:bg-brand transition">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
              <circle cx="11" cy="11" r="7" />
              <path d="M21 21l-4.3-4.3" />
            </svg>
          </button>
        </div>
      </div>

      {groups.map((g) => (
        <div key={g.title} className="mb-10">
          <h2 className="font-display text-2xl mb-5 pb-3 border-b border-ink/10">{g.title}</h2>
          <FaqAccordion items={g.items} />
        </div>
      ))}

      <div className="bg-ink text-white rounded p-8 md:p-10 text-center mt-12">
        <h3 className="font-display text-2xl">Still need help?</h3>
        <p className="text-white/70 mt-2">Our support team replies within a few hours.</p>
        <Link
          to="/contact"
          className="inline-block mt-5 bg-brand text-ink px-7 py-3 uppercase text-xs tracking-wider hover:bg-white transition rounded"
        >
          Contact Support
        </Link>
      </div>
    </section>
  </PageLayout>
);

export default Faq;
