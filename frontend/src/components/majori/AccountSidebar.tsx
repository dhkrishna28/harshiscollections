import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";

const items = [
  { label: "Dashboard", to: "/account", icon: (<><rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" /><rect x="3" y="14" width="7" height="7" /><rect x="14" y="14" width="7" height="7" /></>) },
  { label: "Orders", to: "/orders", icon: (<><path d="M6 2l-2 4v15a1 1 0 001 1h14a1 1 0 001-1V6l-2-4z" /><line x1="3" y1="6" x2="21" y2="6" /><path d="M16 10a4 4 0 01-8 0" /></>) },
  { label: "Wishlist", to: "/account#wishlist", icon: (<path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.6l-1-1a5.5 5.5 0 1 0-7.8 7.8l1 1L12 21l7.8-7.6 1-1a5.5 5.5 0 0 0 0-7.8z" />) },
  { label: "Addresses", to: "/account#addresses", icon: (<><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" /><circle cx="12" cy="10" r="3" /></>) },
  { label: "Profile", to: "/account#profile", icon: (<><circle cx="12" cy="8" r="4" /><path d="M4 21c1.5-4 5-6 8-6s6.5 2 8 6" /></>) },
  { label: "Payment Methods", to: "/account#payment", icon: (<><rect x="2" y="5" width="20" height="14" rx="2" /><line x1="2" y1="10" x2="22" y2="10" /></>) },
  { label: "Help Center", to: "/faq", icon: (<><circle cx="12" cy="12" r="10" /><path d="M9.1 9a3 3 0 015.8 1c0 2-3 3-3 3" /><line x1="12" y1="17" x2="12" y2="17.01" /></>) },
];

const AccountSidebar = ({ activePath }: { activePath?: string }) => {
  const loc = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const active = activePath ?? loc.pathname;
  const initials = `${user?.first_name?.[0] || ""}${user?.last_name?.[0] || ""}` || "HC";
  return (
    <aside className="lg:w-72 shrink-0">
      <div className="bg-white border border-ink/10 rounded-lg overflow-hidden lg:sticky lg:top-24">
        <div className="bg-gradient-to-br from-ink to-ink/80 text-white p-6">
          <div className="flex items-center gap-3">
            <div className="w-14 h-14 rounded-full bg-brand grid place-items-center font-display text-xl text-ink">
              {initials.toUpperCase()}
            </div>
            <div>
              <p className="font-semibold">{user ? `${user.first_name} ${user.last_name}` : "Harshis Customer"}</p>
              <p className="text-xs text-white/60">{user?.email || "customer@example.com"}</p>
              <p className="text-xs mt-1">
                <span className="bg-brand/20 text-brand px-2 py-0.5 rounded-full">Gold Member</span>
              </p>
            </div>
          </div>
        </div>
        <nav className="flex flex-col p-3 text-sm">
          {items.map((it) => {
            const isActive = active === it.to.split("#")[0];
            return (
              <Link
                key={it.label}
                to={it.to}
                className={`flex items-center gap-3 px-3 py-2.5 rounded ${
                  isActive ? "bg-cream text-ink font-medium" : "hover:bg-cream"
                }`}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                  {it.icon}
                </svg>
                {it.label}
              </Link>
            );
          })}
          <hr className="my-2 border-ink/10" />
          <button type="button" onClick={() => { logout(); navigate("/login"); }} className="flex items-center gap-3 px-3 py-2.5 rounded hover:bg-cream text-accent">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
              <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4" />
              <polyline points="16 17 21 12 16 7" />
              <line x1="21" y1="12" x2="9" y2="12" />
            </svg>
            Logout
          </button>
        </nav>
      </div>
    </aside>
  );
};

export default AccountSidebar;
