import { useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import PageLayout from "@/components/majori/PageLayout";
import Newsletter from "@/components/majori/Newsletter";
import CollectionFilters, {
  DEFAULT_FILTERS,
  FilterState,
  PRICE_MAX,
} from "@/components/majori/CollectionFilters";
import FilterDrawer from "@/components/majori/FilterDrawer";
import ProductCard, { ListingProduct } from "@/components/majori/ProductCard";
import { productService } from "@/services/productService";
import type { Product } from "@/types";

type SortKey = "featured" | "price-asc" | "price-desc" | "newest";

const API_ORIGIN =
  (import.meta.env.VITE_API_BASE_URL as string | undefined)?.replace("/api", "") || "";

const toListingProduct = (product: Product): ListingProduct => ({
  id: product.id,
  name: product.name,
  price: `₹${Number(product.price).toFixed(2)}`,
  oldPrice: product.compare_at_price ? `₹${Number(product.compare_at_price).toFixed(2)}` : undefined,
  priceNumber: Number(product.price),
  badge:
    product.compare_at_price && Number(product.compare_at_price) > Number(product.price)
      ? { label: "Sale", tone: "sale" }
      : product.is_featured
        ? { label: "New", tone: "new" }
        : undefined,
  img: product.images?.[0]?.image_path
    ? `${API_ORIGIN}${product.images[0].image_path}`
    : "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=600&auto=format&fit=crop&q=80",
  href: `/product/${product.slug}`,
  category: product.category?.name,
  colors: [],
  sizes: product.sizes,
  brand: product.brand,
});

const Collection = () => {
  const [searchParams] = useSearchParams();
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [view, setView] = useState<"grid" | "list">("grid");
  const [filters, setFilters] = useState<FilterState>(DEFAULT_FILTERS);
  const [sort, setSort] = useState<SortKey>("featured");
  const search = searchParams.get("search") || undefined;

  const { data, isLoading } = useQuery({
    queryKey: ["collection-products", search],
    queryFn: () => productService.list({ limit: 100, search }),
  });

  const products = (data?.data ?? []).map(toListingProduct);

  const filtered = useMemo(() => {
    const matches = products.filter((p) => {
      if (filters.categories.length && !filters.categories.includes(p.category ?? "")) return false;
      if (filters.brands.length && !filters.brands.includes(p.brand ?? "")) return false;
      if (filters.colors.length && !p.colors?.some((c) => filters.colors.includes(c))) return false;
      if (filters.sizes.length && !p.sizes?.some((s) => filters.sizes.includes(s))) return false;
      const pn = p.priceNumber ?? Number(p.price.replace(/[^0-9.]/g, "")) ?? 0;
      if (pn > filters.maxPrice) return false;
      return true;
    });

    const sorted = [...matches];
    const priceOf = (p: ListingProduct) =>
      p.priceNumber ?? Number(p.price.replace(/[^0-9.]/g, "")) ?? 0;
    if (sort === "price-asc") sorted.sort((a, b) => priceOf(a) - priceOf(b));
    if (sort === "price-desc") sorted.sort((a, b) => priceOf(b) - priceOf(a));
    if (sort === "newest") sorted.sort((a, b) => Number(b.id) - Number(a.id));
    return sorted;
  }, [filters, sort]);

  const clearFilters = () => setFilters(DEFAULT_FILTERS);

  const activeChips: { label: string; clear: () => void }[] = [
    ...filters.categories.map((c) => ({
      label: c,
      clear: () => setFilters((f) => ({ ...f, categories: f.categories.filter((x) => x !== c) })),
    })),
    ...filters.brands.map((b) => ({
      label: b,
      clear: () => setFilters((f) => ({ ...f, brands: f.brands.filter((x) => x !== b) })),
    })),
    ...filters.colors.map((c) => ({
      label: c,
      clear: () => setFilters((f) => ({ ...f, colors: f.colors.filter((x) => x !== c) })),
    })),
    ...filters.sizes.map((s) => ({
      label: `Size ${s}`,
      clear: () => setFilters((f) => ({ ...f, sizes: f.sizes.filter((x) => x !== s) })),
    })),
    ...(filters.maxPrice < PRICE_MAX
      ? [{ label: `Up to $${filters.maxPrice}`, clear: () => setFilters((f) => ({ ...f, maxPrice: PRICE_MAX })) }]
      : []),
  ];

  return (
    <PageLayout>
      <section className="bg-sand py-10">
        <div className="max-w-7xl mx-auto px-4">
          <h1 className="font-display text-3xl md:text-4xl font-semibold">Collection</h1>
          <nav className="text-sm text-mute mt-2">
            <Link to="/" className="hover:text-brand">Home</Link>
            <span className="text-mute"> / </span>
            <Link to="/collection" className="hover:text-brand">Collections</Link>
            <span className="text-mute"> / </span>
            <span className="text-ink">Collection</span>
          </nav>
        </div>
      </section>

      <section className="py-10 md:py-14">
        <div className="max-w-7xl mx-auto px-4 md:grid md:grid-cols-[260px_1fr] md:gap-10">
          <div className="md:hidden mb-4 flex items-center justify-between gap-3">
            <button
              type="button"
              onClick={() => setFiltersOpen(true)}
              className="flex items-center gap-2 border border-ink px-4 py-2.5 rounded text-sm font-medium hover:bg-ink hover:text-white transition"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                <line x1="4" y1="6" x2="20" y2="6" />
                <line x1="7" y1="12" x2="20" y2="12" />
                <line x1="10" y1="18" x2="20" y2="18" />
              </svg>
              Filters {activeChips.length > 0 && <span className="bg-ink text-white text-[10px] rounded-full w-5 h-5 grid place-items-center">{activeChips.length}</span>}
            </button>
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value as SortKey)}
              className="text-sm bg-white border border-ink/15 rounded px-3 py-2.5 flex-1 max-w-[200px]"
            >
              <option value="featured">Sort: Featured</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="newest">Newest</option>
            </select>
          </div>

          <aside className="hidden md:block">
            <CollectionFilters value={filters} onChange={setFilters} onClear={clearFilters} />
          </aside>

          <div>
            <div className="flex flex-wrap items-center justify-between gap-4 mb-6 pb-4 border-b border-ink/10">
              <p className="text-sm text-mute">
                Showing <span className="text-ink font-medium">{filtered.length}</span> of {products.length} products
              </p>
              <div className="flex items-center gap-3">
                <select
                  value={sort}
                  onChange={(e) => setSort(e.target.value as SortKey)}
                  className="text-sm bg-white border border-ink/15 rounded px-3 py-2 hidden md:block"
                >
                  <option value="featured">Sort: Featured</option>
                  <option value="price-asc">Price: Low to High</option>
                  <option value="price-desc">Price: High to Low</option>
                  <option value="newest">Newest</option>
                </select>
                <div className="hidden sm:flex border border-ink/15 rounded">
                  <button
                    type="button"
                    onClick={() => setView("grid")}
                    className={`px-3 py-2 ${view === "grid" ? "bg-ink text-white" : ""}`}
                    aria-label="Grid view"
                    aria-pressed={view === "grid"}
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                      <rect x="3" y="3" width="7" height="7" />
                      <rect x="14" y="3" width="7" height="7" />
                      <rect x="3" y="14" width="7" height="7" />
                      <rect x="14" y="14" width="7" height="7" />
                    </svg>
                  </button>
                  <button
                    type="button"
                    onClick={() => setView("list")}
                    className={`px-3 py-2 ${view === "list" ? "bg-ink text-white" : ""}`}
                    aria-label="List view"
                    aria-pressed={view === "list"}
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                      <rect x="3" y="4" width="18" height="3" />
                      <rect x="3" y="11" width="18" height="3" />
                      <rect x="3" y="18" width="18" height="3" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>

            {activeChips.length > 0 && (
              <div className="flex flex-wrap items-center gap-2 mb-6">
                {activeChips.map((chip, i) => (
                  <button
                    key={`${chip.label}-${i}`}
                    type="button"
                    onClick={chip.clear}
                    className="inline-flex items-center gap-1.5 bg-white border border-ink/15 text-xs px-3 py-1.5 rounded-full hover:border-ink"
                  >
                    {chip.label}
                    <span aria-hidden className="text-mute">×</span>
                  </button>
                ))}
                <button
                  type="button"
                  onClick={clearFilters}
                  className="text-xs text-mute hover:text-ink underline ml-1"
                >
                  Clear all
                </button>
              </div>
            )}

            {isLoading ? (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-5 md:gap-7">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="aspect-[4/5] rounded bg-white animate-pulse" />
                ))}
              </div>
            ) : filtered.length === 0 ? (
              <div className="text-center bg-white border border-ink/10 rounded p-12">
                <p className="font-display text-xl mb-2">No products match your filters</p>
                <p className="text-mute mb-6 text-sm">Try removing a filter or two.</p>
                <button
                  type="button"
                  onClick={clearFilters}
                  className="bg-ink text-white px-6 py-3 uppercase text-xs tracking-wider hover:bg-brand transition rounded"
                >
                  Clear Filters
                </button>
              </div>
            ) : view === "grid" ? (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-5 md:gap-7">
                {filtered.map((p) => (
                  <ProductCard key={p.id} p={p} />
                ))}
              </div>
            ) : (
              <ul className="space-y-4">
                {filtered.map((p) => (
                  <li key={p.id} className="flex gap-4 bg-white border border-ink/10 rounded p-4">
                    <img src={p.img} alt={p.name} loading="lazy" className="w-24 h-32 object-cover rounded" />
                    <div className="flex-1 flex flex-col justify-between">
                      <div>
                        <p className="font-medium">{p.name}</p>
                        <p className="text-xs text-mute mt-1">{p.category} · {p.brand}</p>
                      </div>
                      <p className="text-sm font-semibold">{p.price}{p.oldPrice && <span className="text-mute line-through ml-2 font-normal">{p.oldPrice}</span>}</p>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </section>

      <Newsletter />

      <FilterDrawer
        open={filtersOpen}
        onClose={() => setFiltersOpen(false)}
        value={filters}
        onChange={setFilters}
        onClear={clearFilters}
      />
    </PageLayout>
  );
};

export default Collection;
