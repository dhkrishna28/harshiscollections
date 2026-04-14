import { Helmet } from 'react-helmet-async';
import { useQuery } from '@tanstack/react-query';
import { useSearchParams } from 'react-router-dom';
import { productService } from '../services/productService';
import ProductCard from '../components/products/ProductCard';

export default function Products() {
  const [searchParams, setSearchParams] = useSearchParams();
  const page = parseInt(searchParams.get('page') || '1');
  const search = searchParams.get('search') || '';
  const category_id = searchParams.get('category_id') || undefined;

  const { data, isLoading } = useQuery({
    queryKey: ['products', page, search, category_id],
    queryFn: () => productService.list({ page, limit: 12, search: search || undefined, category_id: category_id ? parseInt(category_id) : undefined }),
  });

  const setPage = (p: number) => {
    const params = new URLSearchParams(searchParams);
    params.set('page', String(p));
    setSearchParams(params);
  };

  return (
    <>
  <Helmet><title>Products – Harshis Collections</title></Helmet>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">All Products</h1>

        {/* Search */}
        <div className="mb-6">
          <input
            type="text"
            placeholder="Search products..."
            defaultValue={search}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                const params = new URLSearchParams(searchParams);
                params.set('search', (e.target as HTMLInputElement).value);
                params.set('page', '1');
                setSearchParams(params);
              }
            }}
            className="input max-w-sm"
          />
        </div>

        {isLoading ? (
          <div className="flex justify-center py-20">
            <div className="w-8 h-8 border-4 border-primary-600 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : data?.data?.length ? (
          <>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {data.data.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
            {/* Pagination */}
            <div className="flex items-center justify-center gap-2 mt-10">
              <button onClick={() => setPage(page - 1)} disabled={page === 1} className="btn-secondary py-1.5 px-4 text-sm">
                Previous
              </button>
              <span className="text-sm text-gray-600">Page {page}</span>
              <button
                onClick={() => setPage(page + 1)}
                disabled={!data?.data?.length || data.data.length < 12}
                className="btn-secondary py-1.5 px-4 text-sm"
              >
                Next
              </button>
            </div>
          </>
        ) : (
          <p className="text-gray-500">No products found.</p>
        )}
      </div>
    </>
  );
}
