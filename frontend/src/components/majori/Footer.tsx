import { useState } from "react";

interface Section {
  title: string;
  links?: string[];
  custom?: React.ReactNode;
}

const sections: Section[] = [
  {
    title: "Shop",
    links: ["Women", "Men", "Accessories", "Sale"],
  },
  {
    title: "Customer Service",
    links: ["FAQ", "Shipping", "Returns", "Contact"],
  },
];

const FooterAccordion = ({ section }: { section: Section }) => {
  const [open, setOpen] = useState(false);
  return (
    <div>
      <button
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center justify-between py-2 text-white font-semibold md:cursor-default"
        aria-expanded={open}
      >
        {section.title} <span className="text-white/60 md:hidden">▾</span>
      </button>
      <ul
        className={`${open ? "block" : "hidden"} md:block pl-0 mt-3 space-y-2 text-sm text-white/85`}
      >
        {section.links?.map((l) => (
          <li key={l}>
            <a href="#" className="hover:text-brand">
              {l}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
};

const MoreSection = () => {
  const [open, setOpen] = useState(false);
  return (
    <div>
      <button
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center justify-between py-2 text-white font-semibold md:cursor-default"
        aria-expanded={open}
      >
        More <span className="text-white/60 md:hidden">▾</span>
      </button>
      <div
        className={`${open ? "block" : "hidden"} md:block mt-3 text-sm text-white/85`}
      >
        <p className="mb-3">
          Sign up for early access to new collections and member-only offers.
        </p>
        <form
          className="flex items-center gap-2"
          onSubmit={(e) => e.preventDefault()}
        >
          <input
            type="email"
            placeholder="Email address"
            className="flex-1 px-3 py-2 text-ink rounded-md"
          />
          <button className="bg-white text-ink px-3 py-2 rounded-md text-sm">
            Join
          </button>
        </form>
        <div className="mt-4">
          <p className="text-xs text-white/70 mb-2">We accept</p>
          <div className="flex items-center gap-3">
            {[0, 1, 2].map((i) => (
              <svg
                key={i}
                width="36"
                height="24"
                viewBox="0 0 36 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1"
                className="text-white/80"
              >
                <rect x="1" y="4" width="34" height="16" rx="2" />
              </svg>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

const Footer = () => (
  <footer className="bg-ink text-white/90 pt-14 pb-8">
    <div className="max-w-7xl mx-auto px-4">
      <div className="grid md:grid-cols-4 gap-10">
        <div>
          <p className="font-display text-2xl text-white mb-3">
            Harshis Collections<span className="text-brand">.</span>
          </p>
          <p className="text-sm text-white/80 max-w-sm">
            Curated modern fashion for the everyday icon. Thoughtful pieces,
            responsibly sourced.
          </p>
          <div className="flex gap-3 mt-5">
            {["f", "i", "t"].map((c) => (
              <a
                key={c}
                href="#"
                aria-label={c}
                className="w-9 h-9 border border-white/10 rounded-full grid place-items-center hover:bg-brand hover:border-brand"
              >
                {c}
              </a>
            ))}
          </div>
        </div>

        {sections.map((s) => (
          <FooterAccordion key={s.title} section={s} />
        ))}
        <MoreSection />
      </div>

      <div className="mt-8 border-t border-white/10 pt-6 flex flex-col md:flex-row md:items-center md:justify-between gap-3 text-xs text-white/70">
        <div>© 2026 Harshis Collections — All rights reserved.</div>
        <div className="flex items-center gap-4">
          <a href="#" className="hover:text-white">
            Privacy
          </a>
          <a href="#" className="hover:text-white">
            Terms
          </a>
          <a href="#" className="hover:text-white">
            Accessibility
          </a>
        </div>
      </div>
    </div>
  </footer>
);

export default Footer;
