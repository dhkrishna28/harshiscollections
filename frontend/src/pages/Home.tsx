import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { productService } from "../services/productService";
import ProductCard from "../components/products/ProductCard";

export default function Home() {
  const { data } = useQuery({
    queryKey: ["featured-products"],
    queryFn: () => productService.list({ featured: true, limit: 8 }),
  });

  return (
    <>
      <Helmet>
        <title>Home – Harshis Collections</title>
      </Helmet>

      {/* Hero */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div>
            <h1 className="hero-title mb-4">Handcrafted Sarees & Ethnicwear</h1>
            <p className="hero-sub mb-6">
              Curated handloom sarees, suits and prints — ethically made by
              Indian artisans.
            </p>
            <div className="flex gap-3 flex-wrap">
              <Link to="/products?search=saree" className="category-chip">
                Sarees
              </Link>
              <Link to="/products?search=suit" className="category-chip">
                Suits
              </Link>
              <Link to="/products?search=handblock" className="category-chip">
                Handblock
              </Link>
              <Link to="/products" className="btn-primary">
                Shop Collection
              </Link>
            </div>
          </div>
          <div className="hidden md:flex justify-center">
            <div
              className="w-[420px] h-[420px] rounded-xl overflow-hidden bg-gray-100 flex items-end p-6"
              style={{
                backgroundImage:
                  "linear-gradient(180deg, rgba(255,255,255,0.0), rgba(255,255,255,0.6))",
              }}
            >
              <div>
                <h3 className="text-lg font-semibold">
                  Featured Handloom Picks
                </h3>
                <p className="text-sm text-gray-600 mt-2">
                  Timeless weaves in small batches — lovingly made.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">
          Featured Products
        </h2>
        {data?.data?.length ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {data.data.map((product) => (
              <div key={product.id} className="relative">
                <span className="product-badge">{product.category?.name}</span>
                <ProductCard product={product} />
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500">No featured products yet.</p>
        )}
        <div className="text-center mt-8">
          <Link to="/products" className="btn-secondary">
            View All Products
          </Link>
        </div>
      </section>
    </>
  );
}
