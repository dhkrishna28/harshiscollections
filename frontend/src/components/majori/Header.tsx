import { useEffect, useState } from "react";

interface HeaderProps {
  onOpenCart: () => void;
  onOpenMenu: () => void;
  cartCount?: number;
  wishlistCount?: number;
}

const ChevronDown = () => (
  <svg
    width="12"
    height="12"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  >
    <path d="M6 9l6 6 6-6" />
  </svg>
);

const SearchBar = () => (
  <div className="flex w-full items-center bg-sand rounded-sm px-5 py-3.5">
    <input
      type="search"
      placeholder="Search products…"
      className="flex-1 bg-transparent outline-none text-sm text-ink placeholder:text-mute"
    />
    <button aria-label="Search" className="text-ink">
      <svg
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
      >
        <path d="M21 21l-4.35-4.35" />
        <circle cx="11" cy="11" r="6" />
      </svg>
    </button>
  </div>
);

const dropdownItems = (items: string[]) => (
  <div className="nav-dropdown absolute left-0 top-full pt-2 z-50">
    <ul className="min-w-[200px] bg-white border border-black/10 shadow-lg py-2">
      {items.map((it) => (
        <li key={it}>
          <a
            href="#"
            className="block px-5 py-2.5 text-[13px] text-ink hover:bg-cream hover:text-brand transition"
          >
            {it}
          </a>
        </li>
      ))}
    </ul>
  </div>
);

const Header = ({
  onOpenCart,
  onOpenMenu,
  cartCount = 0,
  wishlistCount = 0,
}: HeaderProps) => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      id="siteHeader"
      className={`sticky top-0 z-40 bg-white border-b border-black/5 ${scrolled ? "scrolled shadow-md" : ""}`}
    >
      <div className="max-w-[1400px] mx-auto px-6">
        {/* Top row */}
        <div className="header-top relative flex items-center gap-4 py-5">
          <button
            onClick={onOpenMenu}
            className="md:hidden p-2 -ml-2 text-ink"
            aria-label="Open menu"
          >
            <svg
              width="22"
              height="22"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
            >
              <path d="M3 6h18M3 12h18M3 18h18" />
            </svg>
          </button>

          <div className="desktop-search hidden md:flex flex-1 max-w-[420px]">
            <SearchBar />
          </div>

          <a
            href="/"
            aria-label="Harshis Collections — Home"
            className="site-logo flex-1 md:flex-none md:absolute md:left-1/2 md:-translate-x-1/2 flex items-center justify-center font-display text-lg font-semibold"
          >
            Harshis Collections
          </a>

          <div className="header-icons flex items-center gap-6 md:gap-7 ml-auto md:flex-1 md:justify-end text-ink">
            <a
              href="#"
              aria-label="Account"
              className="hidden sm:block hover:text-brand transition"
            >
              <svg
                width="22"
                height="22"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.6"
              >
                <circle cx="12" cy="8" r="4" />
                <path d="M4 21a8 8 0 0 1 16 0" />
              </svg>
            </a>
            <a
              href="#"
              aria-label="Wishlist"
              className="relative hover:text-brand transition"
            >
              <svg
                width="22"
                height="22"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.6"
              >
                <path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.6l-1-1a5.5 5.5 0 0 0-7.8 7.8l1 1L12 21l7.8-7.8 1-1a5.5 5.5 0 0 0 0-7.6Z" />
              </svg>
              <span className="absolute -top-2 -right-2 text-[10px] bg-ink text-white rounded-full w-[18px] h-[18px] grid place-items-center font-medium">
                {wishlistCount}
              </span>
            </a>
            <button
              onClick={(e) => {
                e.preventDefault();
                onOpenCart();
              }}
              className="flex items-center gap-2 hover:text-brand transition"
            >
              <span className="relative">
                <svg
                  width="22"
                  height="22"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <circle cx="9" cy="20" r="1" />
                  <circle cx="19" cy="20" r="1" />
                  <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h7.72a2 2 0 0 0 2-1.61L23 6H6" />
                </svg>
                <span className="absolute -top-2 -right-2 text-[10px] bg-ink text-white rounded-full w-[18px] h-[18px] grid place-items-center font-medium">
                  {cartCount}
                </span>
              </span>
            </button>
          </div>
        </div>

        {/* Mobile search */}
        <div className="mobile-search flex flex-1 max-w-[420px] pb-2 md:hidden">
          <SearchBar />
        </div>

        {/* Nav row (desktop) */}
        <div className="border-t border-black/10">
          <div className="nav-row hidden md:flex items-center justify-between py-4">
            <button className="flex items-center gap-3 text-[13px] font-medium tracking-[0.15em] text-ink uppercase">
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.6"
              >
                <path d="M4 6h16M4 12h16M4 18h16" />
              </svg>
              <span>Browse Categories</span>
              <ChevronDown />
            </button>

            <nav className="flex items-center gap-9">
              <div className="relative nav-item">
                <a
                  href="#"
                  className="flex items-center gap-1 text-[13px] font-medium tracking-[0.15em] text-ink hover:text-brand transition py-2"
                >
                  HOME <ChevronDown />
                </a>
                {dropdownItems([
                  "Home Fashion",
                  "Home Minimal",
                  "Home Classic",
                  "Home Modern",
                ])}
              </div>

              <div className="relative nav-item">
                <a
                  href="#"
                  className="flex items-center gap-1 text-[13px] font-medium tracking-[0.15em] text-ink hover:text-brand transition py-2"
                >
                  SHOP <ChevronDown />
                </a>
                {dropdownItems([
                  "Shop Grid",
                  "Shop List",
                  "Product Single",
                  "Cart",
                  "Checkout",
                ])}
              </div>

              <div className="relative nav-item">
                <a
                  href="#"
                  className="text-[13px] font-medium tracking-[0.15em] text-ink hover:text-brand transition py-2"
                >
                  COLLECTIONS
                </a>
              </div>

              <div className="relative nav-item">
                <a
                  href="#"
                  className="flex items-center gap-1 text-[13px] font-medium tracking-[0.15em] text-ink hover:text-brand transition py-2"
                >
                  FASHION <ChevronDown />
                </a>
                {dropdownItems(["Women", "Men", "Accessories", "New Arrivals"])}
              </div>

              <div className="relative nav-item">
                <a
                  href="#"
                  className="text-[13px] font-medium tracking-[0.15em] text-ink hover:text-brand transition py-2"
                >
                  OUTERWEAR
                </a>
              </div>
              <div className="relative nav-item">
                <a
                  href="#"
                  className="text-[13px] font-medium tracking-[0.15em] text-ink hover:text-brand transition py-2"
                >
                  CONTACT
                </a>
              </div>
              <div className="relative nav-item">
                <a
                  href="#"
                  className="text-[13px] font-medium tracking-[0.15em] text-ink hover:text-brand transition py-2"
                >
                  BLOG
                </a>
              </div>
            </nav>

            <a
              href="#"
              className="flex items-center gap-2 text-[13px] font-medium tracking-[0.15em] text-ink uppercase hover:text-brand transition"
            >
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.6"
              >
                <path d="M12 2v20M2 12h20" />
              </svg>
              <span>Best Offers</span>
            </a>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
