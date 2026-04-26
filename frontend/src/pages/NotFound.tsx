import { Link, useLocation } from "react-router-dom";
import { useEffect } from "react";
import PageLayout from "@/components/majori/PageLayout";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <PageLayout>
      <section className="min-h-[70vh] grid place-items-center px-4 py-20">
        <div className="text-center max-w-xl">
          <p className="font-display text-[140px] md:text-[200px] leading-none text-brand/80">404</p>
          <h1 className="font-display text-3xl md:text-4xl mt-4">Page Not Found</h1>
          <p className="text-mute mt-4">
            The page you're looking for has wandered off. Let's get you back to something beautiful.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center mt-8">
            <Link
              to="/"
              className="bg-ink text-white px-8 py-3 uppercase text-xs tracking-wider hover:bg-brand transition rounded"
            >
              Back to Home
            </Link>
            <Link
              to="/collection"
              className="border border-ink px-8 py-3 uppercase text-xs tracking-wider hover:bg-ink hover:text-white transition rounded"
            >
              Continue Shopping
            </Link>
          </div>
          <div className="mt-12 flex items-center gap-3 max-w-md mx-auto">
            <input
              type="search"
              placeholder="Search products..."
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
      </section>
    </PageLayout>
  );
};

export default NotFound;
