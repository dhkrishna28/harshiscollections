import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { productService } from '../services/productService';
import { useCart } from '../context/CartContext';

const API_ORIGIN =
  (import.meta.env.VITE_API_BASE_URL as string | undefined)?.replace('/api', '') || '';

const TABS = ['Description', 'Specifications', 'Wash Care', 'Shipping', 'Ideal For'] as const;
type Tab = (typeof TABS)[number];

export default function ProductDetail() {
  const { slug } = useParams<{ slug: string }>();
  const { addItem } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [activeImage, setActiveImage] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<Tab>('Description');
  const [adding, setAdding] = useState(false);

  const { data, isLoading, isError } = useQuery({
    queryKey: ['product', slug],
    queryFn: () => productService.getBySlug(slug!),
    enabled: !!slug,
  });

  const product = data?.data;

  const handleAddToCart = async () => {
    if (!product) return;
    setAdding(true);
    try {
      await addItem(product.id, quantity);
      toast.success('Added to cart!');
    } catch {
      toast.error('Could not add to cart.');
    } finally {
      setAdding(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center py-32">
        <div className="w-8 h-8 border-4 border-primary-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }
  if (isError || !product) {
    return <div className="text-center py-32 text-gray-500">Product not found.</div>;
  }

  const mainImage = activeImage ?? (product.images?.[0]?.image_path ? `${API_ORIGIN}${product.images[0].image_path}` : '/placeholder.png');

  const isOutOfStock =
    product.stock_quantity === 0 || product.availability_status === 'out_of_stock';

  const hasDiscount =
    !!product.compare_at_price && Number(product.compare_at_price) > Number(product.price);

  const discountPct = hasDiscount
    ? Math.round(
        ((Number(product.compare_at_price) - Number(product.price)) /
          Number(product.compare_at_price)) *
          100
      )
    : 0;

  // Only render populated attribute rows
  const attrs: [string, string][] = (
    [
      ['Brand', product.brand],
      ['Material', product.material],
      ['Craft / Print Type', product.craft_print_type],
      ['Style', product.style],
      ['Neckline', product.neckline],
      ['SKU', product.sku],
    ] as [string, string | undefined][]
  ).filter((row): row is [string, string] => !!row[1]);

  const tabContent: Record<Tab, string | undefined | null> = {
    Description: product.description,
    Specifications: product.specifications,
    'Wash Care': product.wash_care,
    Shipping: product.shipping_info,
    'Ideal For': product.ideal_for,
  };
  const visibleTabs = TABS.filter((t) => !!tabContent[t]);

  return (
    <>
  <Helmet><title>{product.name} – Harshis Collections</title></Helmet>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">

          {/* ── Image Gallery ──────────────────────────────────── */}
          <div>
            <div className="rounded-xl overflow-hidden bg-gray-100 aspect-square">
              <img src={mainImage} alt={product.name} className="w-full h-full object-cover" />
            </div>

            {(product.images?.length ?? 0) > 0 && (
              <div className="flex gap-3 mt-4 overflow-x-auto pb-1">
                {product.images!.map((img) => (
                  <button
                    key={img.id}
                    type="button"
                    onClick={() => setActiveImage(`${API_ORIGIN}${img.image_path}`)}
                    className={`shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition ${
                      activeImage === `${API_ORIGIN}${img.image_path}`
                        ? 'border-primary-500'
                        : 'border-transparent hover:border-gray-300'
                    }`}
                  >
                    <img src={`${API_ORIGIN}${img.image_path}`} alt={img.alt_text || product.name} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* ── Product Info ───────────────────────────────────── */}
          <div>
            {product.category && (
              <p className="text-sm text-primary-600 font-medium mb-1">{product.category.name}</p>
            )}
            <h1 className="text-2xl font-bold text-gray-900 mb-1">{product.name}</h1>
            {product.brand && (
              <p className="text-sm text-gray-500 mb-4">
                by <span className="font-medium text-gray-700">{product.brand}</span>
              </p>
            )}

            {/* Price */}
            <div className="flex items-center gap-3 mb-5">
              <span className="text-2xl font-bold text-gray-900">₹{product.price}</span>
              {hasDiscount && (
                <>
                  <span className="text-lg text-gray-400 line-through">₹{product.compare_at_price}</span>
                  <span className="text-sm font-semibold text-green-700 bg-green-100 px-2.5 py-0.5 rounded-full">
                    {discountPct}% off
                  </span>
                </>
              )}
            </div>

            {product.short_description && (
              <p className="text-gray-600 text-sm leading-relaxed mb-5">{product.short_description}</p>
            )}

            {/* Attribute grid */}
            {attrs.length > 0 && (
              <div className="bg-gray-50 rounded-lg px-4 py-3 mb-5 grid grid-cols-2 gap-x-4 gap-y-3 text-sm">
                {attrs.map(([label, value]) => (
                  <div key={label} className="flex flex-col gap-0.5">
                    <span className="text-xs text-gray-400 uppercase tracking-wide">{label}</span>
                    <span className="font-medium text-gray-800">{value}</span>
                  </div>
                ))}
              </div>
            )}

            {/* Size selector */}
            {product.sizes && product.sizes.length > 0 && (
              <div className="mb-5">
                <p className="text-sm font-medium text-gray-700 mb-2">
                  Size:{' '}
                  {selectedSize ? (
                    <span className="text-primary-600 font-semibold">{selectedSize}</span>
                  ) : (
                    <span className="text-gray-400 font-normal">Select a size</span>
                  )}
                </p>
                <div className="flex flex-wrap gap-2">
                  {product.sizes.map((size) => (
                    <button
                      key={size}
                      type="button"
                      onClick={() => setSelectedSize(selectedSize === size ? null : size)}
                      className={`px-3 py-1.5 rounded-lg border text-sm font-medium transition ${
                        selectedSize === size
                          ? 'bg-primary-600 text-white border-primary-600'
                          : 'bg-white text-gray-700 border-gray-300 hover:border-primary-400'
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity stepper */}
            <div className="flex items-center gap-4 mb-4">
              <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden">
                <button
                  type="button"
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="px-3 py-2 text-gray-600 hover:bg-gray-100 text-lg leading-none"
                >
                  −
                </button>
                <input
                  type="number"
                  min={1}
                  max={product.stock_quantity}
                  value={quantity}
                  onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                  className="w-12 text-center text-sm border-0 focus:ring-0 bg-transparent"
                />
                <button
                  type="button"
                  onClick={() => setQuantity((q) => Math.min(product.stock_quantity, q + 1))}
                  className="px-3 py-2 text-gray-600 hover:bg-gray-100 text-lg leading-none"
                >
                  +
                </button>
              </div>
              <span className={`text-sm ${isOutOfStock ? 'text-red-500 font-medium' : 'text-gray-500'}`}>
                {isOutOfStock ? 'Out of Stock' : `${product.stock_quantity} in stock`}
              </span>
            </div>

            <button
              onClick={handleAddToCart}
              disabled={adding || isOutOfStock}
              className="btn-primary w-full py-3 text-base"
            >
              {isOutOfStock ? 'Out of Stock' : adding ? 'Adding…' : 'Add to Cart'}
            </button>
          </div>
        </div>

        {/* ── Info Tabs ──────────────────────────────────────────── */}
        {visibleTabs.length > 0 && (
          <div className="mt-16 border-t pt-10">
            <div className="flex overflow-x-auto border-b mb-8">
              {visibleTabs.map((tab) => (
                <button
                  key={tab}
                  type="button"
                  onClick={() => setActiveTab(tab)}
                  className={`px-5 py-3 text-sm font-medium whitespace-nowrap border-b-2 -mb-px transition ${
                    activeTab === tab
                      ? 'border-primary-600 text-primary-600'
                      : 'border-transparent text-gray-500 hover:text-gray-800 hover:border-gray-300'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>

            {tabContent[activeTab] ? (
              <div
                className="prose prose-sm max-w-none text-gray-700 leading-relaxed"
                dangerouslySetInnerHTML={{ __html: tabContent[activeTab] as string }}
              />
            ) : (
              <p className="text-gray-400 text-sm">No content available.</p>
            )}
          </div>
        )}
      </div>
    </>
  );
}
