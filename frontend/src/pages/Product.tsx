import { useMemo } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import toast from "react-hot-toast";
import PageLayout from "@/components/majori/PageLayout";
import Newsletter from "@/components/majori/Newsletter";
import ServiceStrip from "@/components/majori/ServiceStrip";
import ProductGallery from "@/components/majori/ProductGallery";
import ProductInfo, { type ProductInfoData } from "@/components/majori/ProductInfo";
import ProductTabs from "@/components/majori/ProductTabs";
import ProductCard, { type ListingProduct } from "@/components/majori/ProductCard";
import { useCart } from "@/context/CartContext";
import { productService } from "@/services/productService";

const API_ORIGIN =
  (import.meta.env.VITE_API_BASE_URL as string | undefined)?.replace("/api", "") || "";

const Product = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { addItem } = useCart();

  const { data, isLoading } = useQuery({
    queryKey: ["product-page", slug],
    queryFn: () => productService.getBySlug(slug!),
    enabled: !!slug,
  });

  const product = data?.data;
  const images = useMemo(
    () =>
      product?.images?.length
        ? product.images.map((image) => `${API_ORIGIN}${image.image_path}`)
        : ["https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=800&auto=format&fit=crop&q=80"],
    [product],
  );

  const productData: ProductInfoData | null = product
    ? {
        brand: product.brand || product.category?.name || "Harshis Collections",
        name: product.name,
        rating: 5,
        reviewCount: 24,
        price: `₹${Number(product.price).toFixed(2)}`,
        oldPrice: product.compare_at_price ? `₹${Number(product.compare_at_price).toFixed(2)}` : undefined,
        savePct:
          product.compare_at_price && Number(product.compare_at_price) > Number(product.price)
            ? Math.round(((Number(product.compare_at_price) - Number(product.price)) / Number(product.compare_at_price)) * 100)
            : undefined,
        description: product.short_description || product.description || "Product details coming soon.",
        colors: [
          { name: "Sand", className: "bg-sand" },
          { name: "Rose", className: "bg-rose" },
          { name: "Ink", className: "bg-ink" },
        ],
        sizes: product.sizes?.length ? product.sizes : ["One Size"],
      }
    : null;

  const details = [
    product?.material ? `Material: ${product.material}` : null,
    product?.style ? `Style: ${product.style}` : null,
    product?.neckline ? `Neckline: ${product.neckline}` : null,
    product?.craft_print_type ? `Craft: ${product.craft_print_type}` : null,
    product?.sku ? `SKU: ${product.sku}` : null,
  ].filter(Boolean) as string[];

  const related: ListingProduct[] = [];

  const handleAddToCart = async (quantity: number, selectedSize?: string | null) => {
    if (!product) return;

    try {
      await addItem(product, quantity, selectedSize);
      toast.success("Added to cart");
    } catch (error) {
      const message =
        (error as { response?: { data?: { message?: string } } })?.response?.data?.message ||
        "Could not add item to cart";
      toast.error(message);
    }
  };

  const handleBuyNow = async (quantity: number, selectedSize?: string | null) => {
    await handleAddToCart(quantity, selectedSize);
    navigate("/checkout");
  };

  if (isLoading || !product || !productData) {
    return <PageLayout><div className="py-24 text-center text-mute">Loading product…</div></PageLayout>;
  }

  return (
    <PageLayout>
      <section className="bg-white border-b border-ink/5">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <h2 className="sr-only">Product</h2>
          <nav className="text-sm text-mute mt-2">
            <Link to="/" className="hover:text-brand">
              Home
            </Link>{" "}
            <span className="text-mute">/</span>{" "}
            <Link to="/collection" className="hover:text-brand">
              Shop
            </Link>{" "}
            <span className="text-mute">/</span>{" "}
            <span className="text-ink">{product.name}</span>
          </nav>
        </div>
      </section>

      <section className="py-10 md:py-14">
        <div className="max-w-7xl mx-auto px-4 grid md:grid-cols-2 gap-10">
          <ProductGallery images={images} alt={product.name} />
          <ProductInfo data={productData} onAddToCart={handleAddToCart} onBuyNow={handleBuyNow} />
        </div>

        <ProductTabs description={product.description || productData.description} details={details} reviews={[]} />

        {related.length > 0 && <div className="max-w-7xl mx-auto px-4 mt-20">
          <h2 className="font-display text-2xl md:text-3xl font-semibold mb-8 text-center">
            You May Also Like
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-5 md:gap-7">
            {related.map((p) => (
              <ProductCard key={p.id} p={p} />
            ))}
          </div>
        </div>}
      </section>

      <ServiceStrip />
      <Newsletter />
    </PageLayout>
  );
};

export default Product;
