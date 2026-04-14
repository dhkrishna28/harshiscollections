import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router";
import RichTextEditor from "../../components/form/RichTextEditor";
import { useMutation, useQuery } from "@tanstack/react-query";
import { productService } from "../../services/productService";
import { categoryService } from "../../services/categoryService";

const inputClassName =
  "h-11 w-full rounded-lg border appearance-none px-4 py-2.5 text-sm shadow-theme-xs placeholder:text-gray-400 focus:outline-none focus:ring-3 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 bg-transparent text-gray-800 border-gray-300 focus:border-brand-300 focus:ring-brand-500/20 dark:border-gray-700 dark:focus:border-brand-800";

const selectClassName =
  "h-11 w-full appearance-none rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 pr-11 text-sm shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-none focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800 text-gray-400 dark:text-gray-400";

const labelClassName = "mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400";

const ChevronDownIcon = () => (
  <svg
    className="absolute text-gray-700 dark:text-gray-400 right-3 top-1/2 -translate-y-1/2 pointer-events-none"
    width="20" height="20" viewBox="0 0 20 20" fill="none"
  >
    <path d="M4.79175 8.02075L10.0001 13.2291L15.2084 8.02075" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const ALPHA_SIZES = ["XS", "S", "M", "L", "XL", "2XL", "3XL", "4XL", "5XL", "6XL"];
const NUMERIC_SIZES = ["32", "34", "36", "38", "40", "42", "44"];

function generateSlug(value: string): string {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_]+/g, "-")
    .replace(/--+/g, "-")
    .replace(/^-|-$/g, "");
}

export default function AddProduct() {
  const navigate = useNavigate();
  const [stockQty, setStockQty] = useState(1);
  const [selectedSizes, setSelectedSizes] = useState<string[]>([]);
  const [productName, setProductName] = useState("");
  const [slug, setSlug] = useState("");
  const [slugLocked, setSlugLocked] = useState(false);
  const [description, setDescription] = useState("");
  const [specifications, setSpecifications] = useState("");
  const [washCare, setWashCare] = useState("");
  const [shippingInfo, setShippingInfo] = useState("");
  const [idealFor, setIdealFor] = useState("");

  // Controlled form fields
  const [categoryId, setCategoryId] = useState("");
  const [brand, setBrand] = useState("");
  const [sku, setSku] = useState("");
  const [material, setMaterial] = useState("");
  const [craftPrintType, setCraftPrintType] = useState("");
  const [style, setStyle] = useState("");
  const [neckline, setNeckline] = useState("");
  const [price, setPrice] = useState("");
  const [compareAtPrice, setCompareAtPrice] = useState("");
  const [availabilityStatus, setAvailabilityStatus] = useState("");
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [submitError, setSubmitError] = useState("");
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const createMutation = useMutation({
    mutationFn: ({ data, files }: { data: Parameters<typeof productService.create>[0]; files: File[] }) =>
      productService.create(data, files),
    onSuccess: () => {
      setSubmitSuccess(true);
      setTimeout(() => navigate("/products"), 1500);
    },
    onError: (err: unknown) => {
      const msg =
        (err as { response?: { data?: { message?: string } } })?.response?.data?.message ??
        "Failed to save product. Please try again.";
      setSubmitError(msg);
    },
  });

  const { data: categories = [] } = useQuery({
    queryKey: ["admin-categories"],
    queryFn: () => categoryService.list(),
  });

  const handleSubmit = (status: "draft" | "published") => {
    setSubmitError("");
    if (!productName.trim()) { setSubmitError("Product name is required."); return; }
    if (!categoryId) { setSubmitError("Please select a category."); return; }
    if (!price) { setSubmitError("Price is required."); return; }

    createMutation.mutate({
      data: {
        name: productName,
        slug,
        sku: sku || undefined,
        category_id: Number(categoryId),
        brand: brand || undefined,
        material: material || undefined,
        craft_print_type: craftPrintType || undefined,
        style: style || undefined,
        neckline: neckline || undefined,
        description: description || undefined,
        specifications: specifications || undefined,
        wash_care: washCare || undefined,
        shipping_info: shippingInfo || undefined,
        ideal_for: idealFor || undefined,
        sizes: selectedSizes.length > 0 ? selectedSizes : undefined,
        price: Number(price),
        compare_at_price: compareAtPrice ? Number(compareAtPrice) : null,
        availability_status: availabilityStatus || "in_stock",
        stock_quantity: stockQty,
        status,
      },
      files: imageFiles,
    });
  };

  const handleNameChange = (value: string) => {
    setProductName(value);
    if (!slugLocked) setSlug(generateSlug(value));
  };

  const toggleSize = (size: string) => {
    setSelectedSizes((prev) =>
      prev.includes(size) ? prev.filter((s) => s !== size) : [...prev, size]
    );
  };

  // Generate object URLs for selected images for preview and clean up on change/unmount
  useEffect(() => {
    const urls = imageFiles.map((f) => URL.createObjectURL(f));
    setImagePreviews(urls);
    return () => {
      urls.forEach((u) => URL.revokeObjectURL(u));
    };
  }, [imageFiles]);

  return (
    <div className="p-4 pb-20 mx-auto max-w-(--breakpoint-2xl) md:p-6 md:pb-24">
      {/* Page Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
        <h2 className="text-xl font-semibold text-gray-800 dark:text-white/90">Add Product</h2>
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
            <li className="text-sm text-gray-800 dark:text-white/90">Add Product</li>
          </ol>
        </nav>
      </div>

      <div className="space-y-6">
        {/* ── Product Details ─────────────────────────────────── */}
        <div className="rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03]">
          <div className="border-b border-gray-200 px-6 py-4 dark:border-gray-800">
            <h2 className="text-lg font-medium text-gray-800 dark:text-white">Product Details</h2>
          </div>
          <div className="p-4 sm:p-6">
            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">

              {/* Product Name */}
              <div className="col-span-full">
                <label className={labelClassName}>Product Name</label>
                <input
                  placeholder="e.g. Red Ajrakh Hand Block Printed Kurti"
                  className={inputClassName}
                  type="text"
                  value={productName}
                  onChange={(e) => handleNameChange(e.target.value)}
                />
              </div>

              {/* Slug */}
              <div className="col-span-full">
                <label className={labelClassName}>
                  URL Slug
                  <span className="ml-1.5 text-xs font-normal text-gray-400 dark:text-gray-500">
                    (used in product URL)
                  </span>
                </label>
                <div className="flex gap-2 items-center">
                  <div className="relative flex-1">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-gray-400 dark:text-gray-500 select-none pointer-events-none">
                      /products/
                    </span>
                    <input
                      placeholder="auto-generated-from-name"
                      className={`${inputClassName} pl-[88px]`}
                      type="text"
                      value={slug}
                      onChange={(e) => {
                        setSlug(generateSlug(e.target.value));
                        setSlugLocked(true);
                      }}
                    />
                  </div>
                  <button
                    type="button"
                    title={slugLocked ? "Click to auto-generate again" : "Slug is auto-generated"}
                    onClick={() => {
                      if (slugLocked) {
                        setSlugLocked(false);
                        setSlug(generateSlug(productName));
                      }
                    }}
                    className={`shrink-0 inline-flex items-center justify-center h-11 w-11 rounded-lg border transition ${
                      slugLocked
                        ? "border-brand-400 bg-brand-50 text-brand-600 dark:bg-brand-900/20 dark:text-brand-400 dark:border-brand-700"
                        : "border-gray-300 bg-gray-50 text-gray-400 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-500"
                    }`}
                  >
                    {slugLocked ? (
                      /* lock-closed */
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                        <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                      </svg>
                    ) : (
                      /* lock-open / auto */
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                        <path d="M7 11V7a5 5 0 0 1 9.9-1" />
                      </svg>
                    )}
                  </button>
                </div>
                {slugLocked && (
                  <p className="mt-1.5 text-xs text-amber-600 dark:text-amber-400">
                    Slug is manually set. Click the lock icon to reset to auto-generated.
                  </p>
                )}
              </div>

              {/* Category */}
              <div>
                <label className={labelClassName}>Category</label>
                <div className="relative">
                  <select
                    className={selectClassName}
                    value={categoryId}
                    onChange={(e) => setCategoryId(e.target.value)}
                  >
                    <option value="" disabled className="text-gray-700 dark:bg-gray-900 dark:text-gray-400">Select a category</option>
                    {categories.filter((c) => c.is_active).map((c) => (
                      <option key={c.id} value={String(c.id)} className="text-gray-700 dark:bg-gray-900 dark:text-gray-400">{c.name}</option>
                    ))}
                  </select>
                  <ChevronDownIcon />
                </div>
              </div>

              {/* Brand */}
              <div>
                <label className={labelClassName}>Brand</label>
                <input
                  placeholder="e.g. Harshis Collectionss"
                  className={inputClassName}
                  type="text"
                  value={brand}
                  onChange={(e) => setBrand(e.target.value)}
                />
              </div>

              {/* SKU */}
              <div>
                <label className={labelClassName}>
                  SKU
                  <span className="ml-1.5 text-xs font-normal text-gray-400 dark:text-gray-500">
                    (Stock Keeping Unit – must be unique)
                  </span>
                </label>
                <input
                  placeholder="e.g. LT-KRT-RED-M"
                  className={inputClassName}
                  type="text"
                  value={sku}
                  onChange={(e) => setSku(e.target.value)}
                />
              </div>

              {/* Material */}
              <div>
                <label className={labelClassName}>Material</label>
                <div className="relative">
                  <select
                    className={selectClassName}
                    value={material}
                    onChange={(e) => setMaterial(e.target.value)}
                  >
                    <option value="" disabled className="text-gray-700 dark:bg-gray-900 dark:text-gray-400">Select material</option>
                    {["Pure Cotton", "Silk", "Chiffon", "Georgette", "Linen", "Rayon", "Viscose", "Polyester"].map((m) => (
                      <option key={m} value={m} className="text-gray-700 dark:bg-gray-900 dark:text-gray-400">{m}</option>
                    ))}
                  </select>
                  <ChevronDownIcon />
                </div>
              </div>

              {/* Craft / Print Type */}
              <div>
                <label className={labelClassName}>Craft / Print Type</label>
                <input
                  placeholder="e.g. Ajrakh Hand Block Print"
                  className={inputClassName}
                  type="text"
                  value={craftPrintType}
                  onChange={(e) => setCraftPrintType(e.target.value)}
                />
              </div>

              {/* Style */}
              <div>
                <label className={labelClassName}>Style</label>
                <input
                  placeholder="e.g. Straight Cut with pocket"
                  className={inputClassName}
                  type="text"
                  value={style}
                  onChange={(e) => setStyle(e.target.value)}
                />
              </div>

              {/* Neckline */}
              <div>
                <label className={labelClassName}>Neckline</label>
                <div className="relative">
                  <select
                    className={selectClassName}
                    value={neckline}
                    onChange={(e) => setNeckline(e.target.value)}
                  >
                    <option value="" disabled className="text-gray-700 dark:bg-gray-900 dark:text-gray-400">Select neckline</option>
                    {["Round Neck", "V Neck", "Collar Neck", "Boat Neck", "Square Neck", "Halter Neck", "Off Shoulder"].map((n) => (
                      <option key={n} value={n} className="text-gray-700 dark:bg-gray-900 dark:text-gray-400">{n}</option>
                    ))}
                  </select>
                  <ChevronDownIcon />
                </div>
              </div>

              {/* Product Description */}
              <div className="col-span-full">
                <label className={labelClassName}>Product Description</label>
                <RichTextEditor value={description} onChange={setDescription} />
              </div>

              {/* Available Sizes */}
              <div className="col-span-full">
                <label className={labelClassName}>Available Sizes</label>
                <div className="space-y-3 mt-1">
                  <div>
                    <p className="mb-1.5 text-xs text-gray-500 dark:text-gray-400">Standard Sizes</p>
                    <div className="flex flex-wrap gap-2">
                      {ALPHA_SIZES.map((size) => (
                        <button
                          key={size}
                          type="button"
                          onClick={() => toggleSize(size)}
                          className={`px-4 py-2 rounded-lg border text-sm font-medium transition ${
                            selectedSizes.includes(size)
                              ? "bg-brand-500 text-white border-brand-500"
                              : "bg-white text-gray-700 border-gray-300 hover:border-brand-400 dark:bg-gray-900 dark:text-gray-400 dark:border-gray-700 dark:hover:border-brand-500"
                          }`}
                        >
                          {size}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <p className="mb-1.5 text-xs text-gray-500 dark:text-gray-400">Numeric Sizes</p>
                    <div className="flex flex-wrap gap-2">
                      {NUMERIC_SIZES.map((size) => (
                        <button
                          key={size}
                          type="button"
                          onClick={() => toggleSize(size)}
                          className={`px-4 py-2 rounded-lg border text-sm font-medium transition ${
                            selectedSizes.includes(size)
                              ? "bg-brand-500 text-white border-brand-500"
                              : "bg-white text-gray-700 border-gray-300 hover:border-brand-400 dark:bg-gray-900 dark:text-gray-400 dark:border-gray-700 dark:hover:border-brand-500"
                          }`}
                        >
                          {size}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ── Specifications ──────────────────────────────────── */}
        <div className="rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03]">
          <div className="border-b border-gray-200 px-6 py-4 dark:border-gray-800">
            <h2 className="text-lg font-medium text-gray-800 dark:text-white">Specifications</h2>
          </div>
          <div className="p-4 sm:p-6">
            <RichTextEditor value={specifications} onChange={setSpecifications} placeholder="e.g. Sleeve Length: 15 inches, Garment Length: 46 inches, Color: Red & Indigo, Fabric Weight: 120 GSM..." />
          </div>
        </div>

        {/* ── Pricing & Availability ──────────────────────────── */}
        <div className="rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03]">
          <div className="border-b border-gray-200 px-6 py-4 dark:border-gray-800">
            <h2 className="text-lg font-medium text-gray-800 dark:text-white">Pricing &amp; Availability</h2>
          </div>
          <div className="p-4 sm:p-6 space-y-5">
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
              {/* Price */}
              <div>
                <label className={labelClassName}>Price (₹)</label>
                <input
                  placeholder="e.g. 2100"
                  className={inputClassName}
                  type="number"
                  min={0}
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                />
              </div>

              {/* Compare-at Price */}
              <div>
                <label className={labelClassName}>Compare-at Price (₹)</label>
                <input
                  placeholder="e.g. 2500"
                  className={inputClassName}
                  type="number"
                  min={0}
                  value={compareAtPrice}
                  onChange={(e) => setCompareAtPrice(e.target.value)}
                />
              </div>

              {/* Availability Status */}
              <div>
                <label className={labelClassName}>Availability Status</label>
                <div className="relative">
                  <select
                    className={selectClassName}
                    value={availabilityStatus}
                    onChange={(e) => setAvailabilityStatus(e.target.value)}
                  >
                    <option value="" disabled className="text-gray-700 dark:bg-gray-900 dark:text-gray-400">Select availability</option>
                    <option value="in_stock" className="text-gray-700 dark:bg-gray-900 dark:text-gray-400">In Stock</option>
                    <option value="out_of_stock" className="text-gray-700 dark:bg-gray-900 dark:text-gray-400">Out of Stock</option>
                  </select>
                  <ChevronDownIcon />
                </div>
              </div>
            </div>

            {/* Stock Quantity */}
            <div className="max-w-[200px]">
              <label className="mb-1 inline-block text-sm font-semibold text-gray-700 dark:text-gray-400">Stock Quantity</label>
              <div className="flex h-11 divide-x divide-gray-300 overflow-hidden rounded-lg border border-gray-300 dark:divide-gray-800 dark:border-gray-700">
                <button
                  type="button"
                  onClick={() => setStockQty((q) => Math.max(0, q - 1))}
                  className="inline-flex h-11 w-11 items-center justify-center bg-white text-gray-700 hover:bg-gray-100 dark:bg-gray-900 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-white"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="25" height="24" viewBox="0 0 25 24" fill="none">
                    <path d="M6.66699 12H18.6677" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </button>
                <div className="flex-1">
                  <input
                    className="h-full w-full border-0 bg-white text-center text-sm text-gray-700 outline-none focus:ring-0 dark:bg-gray-900 dark:text-gray-400"
                    type="text"
                    value={stockQty}
                    onChange={(e) => setStockQty(Number(e.target.value) || 0)}
                  />
                </div>
                <button
                  type="button"
                  onClick={() => setStockQty((q) => q + 1)}
                  className="inline-flex h-11 w-11 items-center justify-center bg-white text-gray-700 hover:bg-gray-100 dark:bg-gray-900 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-white"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="25" height="24" viewBox="0 0 25 24" fill="none">
                    <path d="M6.66699 12.0002H18.6677M12.6672 6V18.0007" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* ── Product Images ───────────────────────────────────── */}
        <div className="rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03]">
          <div className="border-b border-gray-200 px-6 py-4 dark:border-gray-800">
            <h2 className="text-lg font-medium text-gray-800 dark:text-white">Product Images</h2>
          </div>
          <div className="p-4 sm:p-6">
            <label
              htmlFor="product-image"
              className="shadow-theme-xs group hover:border-brand-500 block cursor-pointer rounded-lg border-2 border-dashed border-gray-300 transition dark:hover:border-brand-400 dark:border-gray-800"
            >
              <div className="flex justify-center p-10">
                <div className="flex max-w-[260px] flex-col items-center gap-4">
                  <div className="inline-flex h-13 w-13 items-center justify-center rounded-full border border-gray-200 text-gray-700 transition dark:border-gray-800 dark:text-gray-400">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                      <path
                        d="M20.0004 16V18.5C20.0004 19.3284 19.3288 20 18.5004 20H5.49951C4.67108 20 3.99951 19.3284 3.99951 18.5V16M12.0015 4L12.0015 16M7.37454 8.6246L11.9994 4.00269L16.6245 8.6246"
                        stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"
                      />
                    </svg>
                  </div>
                  <p className="text-center text-sm text-gray-500 dark:text-gray-400">
                    <span className="font-medium text-gray-800 dark:text-white/90">Click to upload</span> or drag and drop
                    SVG, PNG, JPG or GIF (MAX. 800x400px)
                  </p>
                </div>
              </div>
              <input
                id="product-image"
                className="hidden"
                type="file"
                multiple
                accept="image/*"
                onChange={(e) => {
                  const files = Array.from(e.target.files ?? []);
                  try { console.debug('[AddProduct] selected files:', files.length, files.map((f) => f.name)); } catch (err) { /* ignore */ }
                  setImageFiles((prev) => {
                    const combined = [...prev, ...files];
                    const seen = new Set();
                    return combined.filter((f) => {
                      const key = `${f.name}_${f.size}`;
                      if (seen.has(key)) return false;
                      seen.add(key);
                      return true;
                    });
                  });
                  // allow selecting the same file(s) again by clearing the input
                  try { (e.target as HTMLInputElement).value = ''; } catch (e) { /* ignore */ }
                }}
              />
            </label>
            {/* Preview of selected images */}
            {imagePreviews.length > 0 && (
              <div className="mt-4">
                <p className="mb-2 text-sm text-gray-600 dark:text-gray-400">{imagePreviews.length} file(s) selected</p>
                <div className="flex flex-wrap gap-3">
                  {imagePreviews.map((url, idx) => (
                    <div key={url} className="relative">
                      <img src={url} alt={`preview-${idx}`} className="h-24 w-24 rounded-lg object-cover border border-gray-200 dark:border-gray-700" />
                      <button
                        type="button"
                        onClick={() => setImageFiles((prev) => prev.filter((_, i) => i !== idx))}
                        className="absolute -top-2 -right-2 h-6 w-6 items-center justify-center rounded-full bg-red-500 text-white shadow flex"
                        title="Remove image"
                      >
                        <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                          <path d="M1 1L11 11M11 1L1 11" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                        </svg>
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* ── Wash Care Instructions ──────────────────────────── */}
        <div className="rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03]">
          <div className="border-b border-gray-200 px-6 py-4 dark:border-gray-800">
            <h2 className="text-lg font-medium text-gray-800 dark:text-white">Wash Care Instructions</h2>
          </div>
          <div className="p-4 sm:p-6">
            <RichTextEditor value={washCare} onChange={setWashCare} />
          </div>
        </div>

        {/* ── Shipping Instructions ────────────────────────────── */}
        <div className="rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03]">
          <div className="border-b border-gray-200 px-6 py-4 dark:border-gray-800">
            <h2 className="text-lg font-medium text-gray-800 dark:text-white">Shipping Instructions</h2>
          </div>
          <div className="p-4 sm:p-6">
            <RichTextEditor value={shippingInfo} onChange={setShippingInfo} />
          </div>
        </div>

        {/* ── Ideal For ───────────────────────────────────────── */}
        <div className="rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03]">
          <div className="border-b border-gray-200 px-6 py-4 dark:border-gray-800">
            <h2 className="text-lg font-medium text-gray-800 dark:text-white">Ideal For</h2>
          </div>
          <div className="p-4 sm:p-6">
            <RichTextEditor value={idealFor} onChange={setIdealFor} placeholder="e.g. Ideal for festive occasions, casual outings, office wear. Perfect gift for bridesmaids or family functions..." />
          </div>
        </div>

        {/* ── Action Buttons ───────────────────────────────────── */}
        <div className="space-y-3">
          {submitError && (
            <div className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600 dark:bg-red-500/10 dark:text-red-400">
              {submitError}
            </div>
          )}
          {submitSuccess && (
            <div className="rounded-lg bg-green-50 px-4 py-3 text-sm text-green-700 dark:bg-green-500/10 dark:text-green-400">
              Product saved successfully! Redirecting...
            </div>
          )}
          <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
            <button
              type="button"
              disabled={createMutation.isPending}
              onClick={() => handleSubmit("draft")}
              className="inline-flex items-center justify-center gap-2 rounded-lg transition px-5 py-3.5 text-sm bg-white text-gray-700 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-400 dark:ring-gray-700 dark:hover:bg-white/[0.03] dark:hover:text-gray-300 disabled:opacity-60"
            >
              Save as Draft
            </button>
            <button
              type="button"
              disabled={createMutation.isPending}
              onClick={() => handleSubmit("published")}
              className="inline-flex items-center justify-center gap-2 rounded-lg transition px-5 py-3.5 text-sm bg-brand-500 text-white shadow-theme-xs hover:bg-brand-600 disabled:opacity-60"
            >
              {createMutation.isPending ? "Saving..." : "Publish Product"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
