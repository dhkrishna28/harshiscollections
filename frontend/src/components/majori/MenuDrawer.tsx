import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";

interface Props {
  open: boolean;
  onClose: () => void;
}

interface Section {
  label: string;
  to?: string;
  items?: { label: string; to: string }[];
}

const sections: Section[] = [
  { label: "Home", to: "/" },
  { label: "Shop", items: [{ label: "Collection", to: "/collection" }, { label: "Cart", to: "/cart" }, { label: "Checkout", to: "/checkout" }] },
  { label: "Pages", items: [{ label: "About Us", to: "/about" }, { label: "Contact", to: "/contact" }, { label: "My Account", to: "/account" }, { label: "Order History", to: "/orders" }, { label: "FAQ", to: "/faq" }, { label: "Terms", to: "/terms" }] },
];

const Accordion = ({ s, onClose }: { s: Section; onClose: () => void }) => {
  const [open, setOpen] = useState(false);
  if (!s.items) {
    return (
      <Link to={s.to || "/"} onClick={onClose} className="block py-3 text-ink font-medium">{s.label}</Link>
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
            <li key={it.label}>
              <Link to={it.to} onClick={onClose} className="block py-2">{it.label}</Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

const MenuDrawer = ({ open, onClose }: Props) => {
  const { isAuthenticated } = useAuth();

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
          <button onClick={onClose} aria-label="Close menu" className="p-1 hover:text-accent-red">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
              <path d="M6 6l12 12M18 6L6 18" />
            </svg>
          </button>
        </div>
        <div className="flex-1 overflow-y-auto px-6 py-4 space-y-2">
          <nav className="space-y-1">
            {sections.map((s) => <Accordion key={s.label} s={s} onClose={onClose} />)}
          </nav>
          <div className="mt-4 border-t border-ink/10 pt-4">
            <Link to={isAuthenticated ? "/account" : "/login"} onClick={onClose} className="block py-3 text-ink font-medium">{isAuthenticated ? "My Account" : "Login"}</Link>
            <Link to="/cart" onClick={onClose} className="block py-3 text-ink">View Cart</Link>
          </div>
        </div>
      </aside>
    </>
  );
};

export default MenuDrawer;
