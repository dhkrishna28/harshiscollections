import { useState, useRef, useEffect, useMemo } from "react";
import { Link } from "react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { productService, AdminProduct } from "../../services/productService";

// Derive backend origin (scheme://host:port) from VITE_API_BASE_URL robustly
const API_ORIGIN = (() => {
  const base = (import.meta.env.VITE_API_BASE_URL as string) || '/api/admin';
  try {
    return new URL(base).origin;
  } catch {
    return base.replace('/api/admin', '').replace('/api', '');
  }
})();
// Prefer frontend origin for public assets (uploads); allow overriding via VITE_FRONTEND_BASE_URL
const FRONTEND_ORIGIN = (import.meta.env.VITE_FRONTEND_BASE_URL as string) || '/';

type SortKey = "name" | "category" | "brand" | "price";
type SortDir = "asc" | "desc";

const PAGE_SIZE = 10;

type SortIconProps = { column: SortKey; sortKey: SortKey; sortDir: SortDir };

const SortIcon = ({ column, sortKey, sortDir }: SortIconProps) => {
  const active = column === sortKey;
  return (
    <span className="flex flex-col gap-0.5">
      <svg
        className={active && sortDir === "asc" ? "text-brand-500" : "text-gray-300 dark:text-gray-400/50"}
        width="8" height="5" viewBox="0 0 8 5" fill="none"
      >
        <path d="M4.40962 0.585167C4.21057 0.300808 3.78943 0.300807 3.59038 0.585166L1.05071 4.21327C0.81874 4.54466 1.05582 5 1.46033 5H6.53967C6.94418 5 7.18126 4.54466 6.94929 4.21327L4.40962 0.585167Z" fill="currentColor" />
      </svg>
      <svg
        className={active && sortDir === "desc" ? "text-brand-500" : "text-gray-300 dark:text-gray-400/50"}
        width="8" height="5" viewBox="0 0 8 5" fill="none"
      >
        <path d="M4.40962 4.41483C4.21057 4.69919 3.78943 4.69919 3.59038 4.41483L1.05071 0.786732C0.81874 0.455343 1.05582 0 1.46033 0H6.53967C6.94418 0 7.18126 0.455342 6.94929 0.786731L4.40962 4.41483Z" fill="currentColor" />
      </svg>
    </span>
  );
};

const CheckboxCell = () => (
  <label className="cursor-pointer text-sm font-medium text-gray-700 select-none dark:text-gray-400">
    <input className="sr-only" type="checkbox" />
    <span className="flex h-4 w-4 items-center justify-center rounded-sm border-[1.25px] bg-transparent border-gray-300 dark:border-gray-700">
      <span className="opacity-0">
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
          <path d="M10 3L4.5 8.5L2 6" stroke="white" strokeWidth="1.6666" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </span>
    </span>
  </label>
);

const MoreDotsIcon = () => (
  <svg className="fill-current" width="24" height="24" viewBox="0 0 24 24" fill="none">
    <path fillRule="evenodd" clipRule="evenodd" d="M5.99902 10.245C6.96552 10.245 7.74902 11.0285 7.74902 11.995V12.005C7.74902 12.9715 6.96552 13.755 5.99902 13.755C5.03253 13.755 4.24902 12.9715 4.24902 12.005V11.995C4.24902 11.0285 5.03253 10.245 5.99902 10.245ZM17.999 10.245C18.9655 10.245 19.749 11.0285 19.749 11.995V12.005C19.749 12.9715 18.9655 13.755 17.999 13.755C17.0325 13.755 16.249 12.9715 16.249 12.005V11.995C16.249 11.0285 17.0325 10.245 17.999 10.245ZM13.749 11.995C13.749 11.0285 12.9655 10.245 11.999 10.245C11.0325 10.245 10.249 11.0285 10.249 11.995V12.005C10.249 12.9715 11.0325 13.755 11.999 13.755C12.9655 13.755 13.749 12.9715 13.749 12.005V11.995Z" fill="" />
  </svg>
);

function ActionMenu({ productId }: { productId: number }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const queryClient = useQueryClient();

  const deleteMutation = useMutation({
    mutationFn: () => productService.remove(productId),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["admin-products"] }),
  });

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative inline-block" ref={ref}>
      <button
        className="text-gray-500 dark:text-gray-400"
        onClick={() => setOpen((v) => !v)}
        aria-label={`Actions for product ${productId}`}
      >
        <MoreDotsIcon />
      </button>
      {open && (
        <div className="absolute z-10 right-0 bottom-full mb-1 p-2 bg-white border border-gray-200 rounded-2xl shadow-lg dark:border-gray-800 dark:bg-gray-900 w-40">
          <div className="space-y-1" role="menu">
            <Link
              to={`/products/${productId}`}
              className="text-xs flex w-full rounded-lg px-3 py-2 text-left font-medium text-gray-500 hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-gray-300"
              onClick={() => setOpen(false)}
            >
              Edit
            </Link>
            <button
              className="text-xs flex w-full rounded-lg px-3 py-2 text-left font-medium text-red-500 hover:bg-red-50 hover:text-red-700 dark:text-red-400 dark:hover:bg-red-500/10 disabled:opacity-50"
              disabled={deleteMutation.isPending}
              onClick={() => { deleteMutation.mutate(); setOpen(false); }}
            >
              {deleteMutation.isPending ? "Deleting…" : "Delete"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default function ProductList() {
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [sortKey, setSortKey] = useState<SortKey>("name");
  const [sortDir, setSortDir] = useState<SortDir>("asc");
  const [page, setPage] = useState(1);
  const [filterOpen, setFilterOpen] = useState(false);
  const [filterCategory, setFilterCategory] = useState("");
  const [appliedCategory, setAppliedCategory] = useState("");
  const filterRef = useRef<HTMLDivElement>(null);

  // Debounce search
  useEffect(() => {
    const t = setTimeout(() => {
      setDebouncedSearch(search);
      setPage(1);
    }, 400);
    return () => clearTimeout(t);
  }, [search]);

  const { data, isLoading, isError } = useQuery({
    queryKey: ["admin-products", page, debouncedSearch, appliedCategory],
    queryFn: () =>
      productService.list({
        page,
        limit: PAGE_SIZE,
        search: debouncedSearch || undefined,
        category_id: appliedCategory ? Number(appliedCategory) : undefined,
      }),
  });

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (filterRef.current && !filterRef.current.contains(e.target as Node)) {
        setFilterOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortDir("asc");
    }
    setPage(1);
  };

  const products = data?.products ?? [];
  // Helper to resolve image URLs returned by backend. Backend stores image_path as
  // either a relative path like `/uploads/...` or (rarely) an absolute URL. Use
  // API_ORIGIN for relative paths.
  const resolveImageUrl = (imgPath?: string | null) => {
    if (!imgPath) return undefined;

    // already full URL
    if (imgPath.startsWith("http://") || imgPath.startsWith("https://")) {
      return imgPath;
    }

    // normalize path (remove double slash issue)
    const cleanPath = imgPath.startsWith("/") ? imgPath : `/${imgPath}`;

    // remove trailing slash from origin
    const cleanFrontendOrigin = FRONTEND_ORIGIN.replace(/\/$/, "");
    const cleanApiOrigin = API_ORIGIN.replace(/\/$/, "");

    if (cleanPath.startsWith("/uploads")) {
      return `${cleanFrontendOrigin}${cleanPath}`;
    }

    return `${cleanApiOrigin}${cleanPath}`;
  };
  const sorted = useMemo(() => {
    return [...products].sort((a: AdminProduct, b: AdminProduct) => {
      const aVal =
        sortKey === "price"
          ? a.price
          : sortKey === "category"
          ? a.category?.name ?? ""
          : sortKey === "brand"
          ? a.brand ?? ""
          : a.name;
      const bVal =
        sortKey === "price"
          ? b.price
          : sortKey === "category"
          ? b.category?.name ?? ""
          : sortKey === "brand"
          ? b.brand ?? ""
          : b.name;
      if (typeof aVal === "number" && typeof bVal === "number") {
        return sortDir === "asc" ? aVal - bVal : bVal - aVal;
      }
      return sortDir === "asc"
        ? String(aVal).localeCompare(String(bVal))
        : String(bVal).localeCompare(String(aVal));
    });
  }, [products, sortKey, sortDir]);

  const totalPages = data?.pagination.totalPages ?? 1;
  const total = data?.pagination.total ?? 0;
  const from = total === 0 ? 0 : (page - 1) * PAGE_SIZE + 1;
  const to = Math.min(page * PAGE_SIZE, total);
  const pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <div className="p-4 pb-20 mx-auto max-w-(--breakpoint-2xl) md:p-6 md:pb-24">
      {/* Page Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
        <h2 className="text-xl font-semibold text-gray-800 dark:text-white/90">Product List</h2>
        <nav>
          <ol className="flex items-center gap-1.5">
            <li>
              <Link className="inline-flex items-center gap-1.5 text-sm text-gray-500 dark:text-gray-400" to="/">
                Home
                <svg className="stroke-current" width="17" height="16" viewBox="0 0 17 16" fill="none">
                  <path d="M6.0765 12.667L10.2432 8.50033L6.0765 4.33366" stroke="" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </Link>
            </li>
            <li className="text-sm text-gray-800 dark:text-white/90">Product List</li>
          </ol>
        </nav>
      </div>

      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03]">
        {/* Table Header */}
        <div className="flex flex-col justify-between gap-5 border-b border-gray-200 px-5 py-4 sm:flex-row sm:items-center dark:border-gray-800">
          <div>
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">Products List</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">Track your store&apos;s progress to boost your sales.</p>
          </div>
          <div className="flex gap-3">
            <button className="inline-flex items-center justify-center gap-2 rounded-lg transition px-5 py-3.5 text-sm bg-white text-gray-700 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-400 dark:ring-gray-700 dark:hover:bg-white/[0.03] dark:hover:text-gray-300">
              Export
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path d="M16.667 13.3333V15.4166C16.667 16.1069 16.1074 16.6666 15.417 16.6666H4.58295C3.89259 16.6666 3.33295 16.1069 3.33295 15.4166V13.3333M10.0013 13.3333L10.0013 3.33325M6.14547 9.47942L9.99951 13.331L13.8538 9.47942" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
            <Link
              className="bg-brand-500 shadow-sm inline-flex items-center justify-center gap-2 rounded-lg px-4 py-3 text-sm font-medium text-white transition hover:bg-brand-600"
              to="/add-product"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path d="M5 10.0002H15.0006M10.0002 5V15.0006" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              Add Product
            </Link>
          </div>
        </div>

        {/* Search & Filter */}
        <div className="border-b border-gray-200 px-5 py-4 dark:border-gray-800">
          <div className="flex gap-3 sm:justify-between">
            <div className="relative flex-1 sm:flex-auto">
              <span className="absolute top-1/2 left-4 -translate-y-1/2 text-gray-500 dark:text-gray-400">
                <svg className="fill-current" width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <path fillRule="evenodd" clipRule="evenodd" d="M3.04199 9.37363C3.04199 5.87693 5.87735 3.04199 9.37533 3.04199C12.8733 3.04199 15.7087 5.87693 15.7087 9.37363C15.7087 12.8703 12.8733 15.7053 9.37533 15.7053C5.87735 15.7053 3.04199 12.8703 3.04199 9.37363ZM9.37533 1.54199C5.04926 1.54199 1.54199 5.04817 1.54199 9.37363C1.54199 13.6991 5.04926 17.2053 9.37533 17.2053C11.2676 17.2053 13.0032 16.5344 14.3572 15.4176L17.1773 18.238C17.4702 18.5309 17.945 18.5309 18.2379 18.238C18.5308 17.9451 18.5309 17.4703 18.238 17.1773L15.4182 14.3573C16.5367 13.0033 17.2087 11.2669 17.2087 9.37363C17.2087 5.04817 13.7014 1.54199 9.37533 1.54199Z" fill="" />
                </svg>
              </span>
              <input
                placeholder="Search by name, category or brand..."
                value={search}
                onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                className="shadow-sm focus:border-brand-300 focus:ring-brand-500/10 dark:focus:border-brand-800 h-11 w-full rounded-lg border border-gray-300 bg-transparent py-2.5 pr-4 pl-11 text-sm text-gray-800 placeholder:text-gray-400 focus:ring-3 focus:outline-none sm:w-[300px] sm:min-w-[300px] dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30"
                type="text"
              />
            </div>
            <div className="relative" ref={filterRef}>
              <button
                className="shadow-theme-xs flex h-11 w-full items-center justify-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 sm:w-auto sm:min-w-[100px] dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400"
                type="button"
                onClick={() => setFilterOpen((v) => !v)}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <path d="M14.6537 5.90414C14.6537 4.48433 13.5027 3.33331 12.0829 3.33331C10.6631 3.33331 9.51206 4.48433 9.51204 5.90415M14.6537 5.90414C14.6537 7.32398 13.5027 8.47498 12.0829 8.47498C10.663 8.47498 9.51204 7.32398 9.51204 5.90415M14.6537 5.90414L17.7087 5.90411M9.51204 5.90415L2.29199 5.90411M5.34694 14.0958C5.34694 12.676 6.49794 11.525 7.91777 11.525C9.33761 11.525 10.4886 12.676 10.4886 14.0958M5.34694 14.0958C5.34694 15.5156 6.49794 16.6666 7.91778 16.6666C9.33761 16.6666 10.4886 15.5156 10.4886 14.0958M5.34694 14.0958L2.29199 14.0958M10.4886 14.0958L17.7087 14.0958" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                Filter
              </button>
              {filterOpen && (
                <div className="absolute right-0 z-10 mt-2 w-56 rounded-lg border border-gray-200 bg-white p-4 shadow-lg dark:border-gray-700 dark:bg-gray-800">
                  <div className="mb-5">
                    <label className="mb-2 block text-xs font-medium text-gray-700 dark:text-gray-300">Category ID</label>
                    <input
                      className="shadow-theme-xs focus:border-brand-300 focus:ring-brand-500/10 dark:focus:border-brand-800 h-10 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 placeholder:text-gray-400 focus:ring-3 focus:outline-none dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30"
                      placeholder="e.g. 1"
                      type="number"
                      value={filterCategory}
                      onChange={(e) => setFilterCategory(e.target.value)}
                    />
                  </div>
                  <button
                    className="bg-brand-500 hover:bg-brand-600 h-10 w-full rounded-lg px-3 py-2 text-sm font-medium text-white"
                    onClick={() => {
                      setAppliedCategory(filterCategory);
                      setPage(1);
                      setFilterOpen(false);
                    }}
                  >
                    Apply
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200 dark:divide-gray-800 dark:border-gray-800">
                <th className="lg:w-14 px-5 py-4 text-left whitespace-nowrap">
                  <CheckboxCell />
                </th>
                <th
                  className="cursor-pointer px-5 whitespace-nowrap py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400"
                  onClick={() => handleSort("name")}
                >
                  <div className="flex items-center gap-3">
                    <p className="text-xs font-medium text-gray-500 dark:text-gray-400">Products</p>
                    <SortIcon column="name" sortKey={sortKey} sortDir={sortDir} />
                  </div>
                </th>
                <th
                  className="cursor-pointer px-5 py-4 whitespace-nowrap text-left text-xs font-medium text-gray-500 dark:text-gray-400"
                  onClick={() => handleSort("category")}
                >
                  <div className="flex items-center gap-3">
                    <p className="text-xs font-medium text-gray-500 dark:text-gray-400">Category</p>
                    <SortIcon column="category" sortKey={sortKey} sortDir={sortDir} />
                  </div>
                </th>
                <th
                  className="cursor-pointer px-5 py-4 whitespace-nowrap text-left text-xs font-medium text-gray-500 dark:text-gray-400"
                  onClick={() => handleSort("brand")}
                >
                  <div className="flex items-center gap-3">
                    <p className="text-xs font-medium text-gray-500 dark:text-gray-400">Brand</p>
                    <SortIcon column="brand" sortKey={sortKey} sortDir={sortDir} />
                  </div>
                </th>
                <th
                  className="cursor-pointer px-5 whitespace-nowrap py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400"
                  onClick={() => handleSort("price")}
                >
                  <div className="flex items-center gap-3">
                    <p className="text-xs font-medium text-gray-500 dark:text-gray-400">Price</p>
                    <SortIcon column="price" sortKey={sortKey} sortDir={sortDir} />
                  </div>
                </th>
                <th className="px-5 py-4 text-left whitespace-nowrap text-xs font-medium text-gray-500 dark:text-gray-400">Stock</th>
                <th className="px-5 py-4 text-left whitespace-nowrap text-xs font-medium text-gray-500 dark:text-gray-400">Created At</th>
                <th className="px-5 py-4 text-left whitespace-nowrap text-xs font-medium text-gray-500 dark:text-gray-400">
                  <span className="sr-only">Action</span>
                </th>
              </tr>
            </thead>
            <tbody className="divide-x divide-y divide-gray-200 dark:divide-gray-800">
              {isLoading ? (
                <tr>
                  <td colSpan={8} className="px-5 py-10 text-center text-sm text-gray-500 dark:text-gray-400">
                    Loading products...
                  </td>
                </tr>
              ) : isError ? (
                <tr>
                  <td colSpan={8} className="px-5 py-10 text-center text-sm text-red-500">
                    Failed to load products. Please try again.
                  </td>
                </tr>
              ) : sorted.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-5 py-10 text-center text-sm text-gray-500 dark:text-gray-400">
                    No products found.
                  </td>
                </tr>
              ) : (
                sorted.map((product) => {
                  // Prefer featured_image (set when product was created/updated). Fall back to images[0].image_path
                  const primaryImg = (product as any).featured_image ?? product.images?.[0]?.image_path;
                  return (
                  <tr key={product.id} className="transition hover:bg-gray-50 dark:hover:bg-gray-900">
                    <td className="lg:w-14 px-5 py-4 whitespace-nowrap">
                      <CheckboxCell />
                    </td>
                    <td className="px-5 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        <div className="h-12 w-12">
                          <img
                            className="h-12 w-12 rounded-md object-cover"
                            alt={product.name}
                            src={primaryImg ? resolveImageUrl(primaryImg) : "/images/product/product-01.jpg"}
                          />
                        </div>
                        <div>
                          <span className="text-sm font-medium text-gray-700 dark:text-gray-400">{product.name}</span>
                          {product.sku && (
                            <p className="text-xs text-gray-400 dark:text-gray-500">SKU: {product.sku}</p>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-4 whitespace-nowrap">
                      <p className="text-sm text-gray-500 dark:text-gray-400">{product.category?.name ?? "—"}</p>
                    </td>
                    <td className="px-5 py-4 whitespace-nowrap">
                      <p className="text-sm text-gray-700 dark:text-gray-400">{product.brand ?? "—"}</p>
                    </td>
                    <td className="px-5 py-4 whitespace-nowrap">
                      <p className="text-sm text-gray-700 dark:text-gray-400">₹{Number(product.price).toLocaleString("en-IN")}</p>
                    </td>
                    <td className="px-5 py-4 whitespace-nowrap">
                      {product.availability_status === "in_stock" ? (
                        <span className="text-xs rounded-full px-2 py-0.5 font-medium bg-green-50 dark:bg-green-500/15 text-green-700 dark:text-green-500">
                          In Stock
                        </span>
                      ) : (
                        <span className="text-xs rounded-full px-2 py-0.5 font-medium bg-red-50 dark:bg-red-500/15 text-red-700 dark:text-red-500">
                          Out of Stock
                        </span>
                      )}
                    </td>
                    <td className="px-5 py-4 whitespace-nowrap">
                      <p className="text-sm text-gray-700 dark:text-gray-400">
                        {new Date(product.created_at).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })}
                      </p>
                    </td>
                    <td className="px-5 py-4 whitespace-nowrap">
                      <ActionMenu productId={product.id} />
                    </td>
                  </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex items-center flex-col sm:flex-row justify-between border-t border-gray-200 px-5 py-4 dark:border-gray-800">
          <div className="pb-3 sm:pb-0">
            <span className="block text-sm font-medium text-gray-500 dark:text-gray-400">
              Showing <span className="text-gray-800 dark:text-white/90">{from}</span> to{" "}
              <span className="text-gray-800 dark:text-white/90">{to}</span> of{" "}
              <span className="text-gray-800 dark:text-white/90">{total}</span>
            </span>
          </div>
          <div className="flex w-full items-center justify-between gap-2 rounded-lg bg-gray-50 p-4 sm:w-auto sm:justify-normal sm:rounded-none sm:bg-transparent sm:p-0 dark:bg-gray-900 dark:sm:bg-transparent">
            <button
              disabled={page === 1}
              onClick={() => setPage((p) => p - 1)}
              className="shadow-sm flex items-center gap-2 rounded-lg border border-gray-300 bg-white p-2 text-gray-700 hover:bg-gray-50 hover:text-gray-800 disabled:cursor-not-allowed disabled:opacity-50 sm:p-2.5 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-gray-200"
            >
              <svg className="fill-current" width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path fillRule="evenodd" clipRule="evenodd" d="M2.58203 9.99868C2.58174 10.1909 2.6549 10.3833 2.80152 10.53L7.79818 15.5301C8.09097 15.8231 8.56584 15.8233 8.85883 15.5305C9.15183 15.2377 9.152 14.7629 8.85921 14.4699L5.13911 10.7472L16.6665 10.7472C17.0807 10.7472 17.4165 10.4114 17.4165 9.99715C17.4165 9.58294 17.0807 9.24715 16.6665 9.24715L5.14456 9.24715L8.85919 5.53016C9.15199 5.23717 9.15184 4.7623 8.85885 4.4695C8.56587 4.1767 8.09099 4.17685 7.79819 4.46984L2.84069 9.43049C2.68224 9.568 2.58203 9.77087 2.58203 9.99715C2.58203 9.99766 2.58203 9.99817 2.58203 9.99868Z" />
              </svg>
            </button>
            <span className="block text-sm font-medium text-gray-700 sm:hidden dark:text-gray-400">
              Page <span>{page}</span> of <span>{totalPages}</span>
            </span>
            <ul className="hidden items-center gap-0.5 sm:flex">
              {pageNumbers.map((p) => (
                <li key={p}>
                  <button
                    onClick={() => setPage(p)}
                    className={`flex h-10 w-10 items-center justify-center rounded-lg text-sm font-medium ${
                      p === page
                        ? "bg-brand-500 text-white"
                        : "text-gray-700 dark:text-gray-400 hover:bg-brand-500 hover:text-white dark:hover:text-white"
                    }`}
                  >
                    {p}
                  </button>
                </li>
              ))}
            </ul>
            <button
              disabled={page === totalPages}
              onClick={() => setPage((p) => p + 1)}
              className="shadow-sm flex items-center gap-2 rounded-lg border border-gray-300 bg-white p-2 text-gray-700 hover:bg-gray-50 hover:text-gray-800 disabled:cursor-not-allowed disabled:opacity-50 sm:p-2.5 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-gray-200"
            >
              <svg className="fill-current" width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path fillRule="evenodd" clipRule="evenodd" d="M17.4165 9.9986C17.4168 10.1909 17.3437 10.3832 17.197 10.53L12.2004 15.5301C11.9076 15.8231 11.4327 15.8233 11.1397 15.5305C10.8467 15.2377 10.8465 14.7629 11.1393 14.4699L14.8594 10.7472L3.33203 10.7472C2.91782 10.7472 2.58203 10.4114 2.58203 9.99715C2.58203 9.58294 2.91782 9.24715 3.33203 9.24715L14.854 9.24715L11.1393 5.53016C10.8465 5.23717 10.8467 4.7623 11.1397 4.4695C11.4327 4.1767 11.9075 4.17685 12.2003 4.46984L17.1578 9.43049C17.3163 9.568 17.4165 9.77087 17.4165 9.99715C17.4165 9.99763 17.4165 9.99812 17.4165 9.9986Z" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
