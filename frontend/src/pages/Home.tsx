import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { productService } from '../services/productService';
import ProductCard from '../components/products/ProductCard';

export default function Home() {
  const { data } = useQuery({
    queryKey: ['featured-products'],
    queryFn: () => productService.list({ featured: true, limit: 8 }),
  });

  return (
    <>
  <Helmet><title>Home – Harshis Collections</title></Helmet>

      {/* Hero */}
      <section className="bg-gradient-to-r from-primary-600 to-primary-700 text-white py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-extrabold mb-4">Shop the Best Products</h1>
          <p className="text-lg md:text-xl text-primary-100 mb-8">Discover thousands of products at unbeatable prices.</p>
          <Link to="/products" className="btn-primary bg-white !text-primary-600 hover:bg-primary-50 text-base px-8 py-3">
            Shop Now
          </Link>
        </div>
      </section>

      {/* Featured Products */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h2 className="text-2xl font-bold text-gray-900 mb-8">Featured Products</h2>
        {data?.data?.length ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {data.data.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <p className="text-gray-500">No featured products yet.</p>
        )}
        <div className="text-center mt-10">
          <Link to="/products" className="btn-secondary">View All Products</Link>
        </div>
      </section>
    </>
  );
}
