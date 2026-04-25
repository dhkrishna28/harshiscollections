import { useEffect, useState } from "react";

interface Props {
  open: boolean;
  onClose: () => void;
}

interface Section {
  label: string;
  items?: string[];
}

const sections: Section[] = [
  { label: "Home" },
  {
    label: "Shop",
    items: ["Shop Grid", "Shop List", "Product Single", "Cart", "Checkout"],
  },
  {
    label: "Pages",
    items: [
      "About Us",
      "Contact",
      "My Account",
      "Order History",
      "Wishlist",
      "Terms & Privacy",
    ],
  },
  { label: "Blog", items: ["Blog Grid", "Single Post"] },
  { label: "Contact" },
];

const Accordion = ({ s }: { s: Section }) => {
  const [open, setOpen] = useState(false);
  if (!s.items) {
    return (
      <a href="#" className="block py-3 text-ink font-medium">
        {s.label}
      </a>
    );
  }
  return (
    <div>
      <button
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center justify-between py-3 text-ink font-medium"
        aria-expanded={open}
      >
        <span>{s.label}</span>
        <span className="text-mute">▾</span>
      </button>
      {open && (
        <ul className="pl-4 text-sm text-ink/90">
          {s.items.map((it) => (
            <li key={it}>
              <a href="#" className="block py-2">
                {it}
              </a>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

const MenuDrawer = ({ open, onClose }: Props) => {
  useEffect(() => {
    document.body.classList.toggle("overflow-hidden", open);
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  return (
    <>
      <div
        onClick={onClose}
        className={`menu-backdrop fixed inset-0 bg-black/50 z-40 ${open ? "open" : ""}`}
      />
      <aside
        className={`menu-drawer fixed top-0 left-0 h-full w-full sm:w-[360px] bg-white z-50 shadow-2xl flex flex-col ${open ? "open" : ""}`}
      >
        <div className="flex items-center justify-between px-6 py-5 border-b border-ink/10">
          <h3 className="font-display text-xl">Menu</h3>
          <button
            onClick={onClose}
            aria-label="Close menu"
            className="p-1 hover:text-accent-red"
          >
            <svg
              width="22"
              height="22"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
            >
              <path d="M6 6l12 12M18 6L6 18" />
            </svg>
          </button>
        </div>
        <div className="flex-1 overflow-y-auto px-6 py-4 space-y-2">
          <nav className="space-y-1">
            {sections.map((s) => (
              <Accordion key={s.label} s={s} />
            ))}
          </nav>
          <div className="mt-4 border-t border-ink/10 pt-4">
            <a href="#" className="block py-3 text-ink font-medium">
              Login
            </a>
            <a href="#" className="block py-3 text-ink">
              Wishlist
            </a>
            <a href="#" className="block py-3 text-ink">
              View Cart
            </a>
          </div>
        </div>
      </aside>
    </>
  );
};

export default MenuDrawer;
