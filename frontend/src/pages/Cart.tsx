import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import toast from 'react-hot-toast';

export default function Cart() {
  const { cart, isLoading, removeItem, updateItem } = useCart();
  const apiBase = (import.meta.env.VITE_API_BASE_URL as string | undefined)?.replace('/api', '') || '';

  if (isLoading) return <div className="flex justify-center py-32"><div className="w-8 h-8 border-4 border-primary-600 border-t-transparent rounded-full animate-spin" /></div>;

  const items = cart?.items ?? [];
  const total = items.reduce((sum, item) => {
    return sum + item.product.price * item.quantity;
  }, 0);

  return (
    <>
  <Helmet><title>Shopping Cart – Harshis Collections</title></Helmet>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <h1 className="text-2xl font-bold text-gray-900 mb-8">Shopping Cart</h1>

        {items.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-gray-500 text-lg mb-6">Your cart is empty.</p>
            <Link to="/products" className="btn-primary">Browse Products</Link>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {items.map((item) => {
                const price = item.product.price;
                const imageUrl = item.product.images?.[0]?.image_path
                  ? `${apiBase}${item.product.images[0].image_path}`
                  : '/placeholder.png';
              return (
                <div key={item.id} className="flex items-center gap-4 bg-white border rounded-xl p-4">
                  <img
                    src={imageUrl}
                    alt={item.product.name}
                    className="w-20 h-20 object-cover rounded-lg"
                  />
                  <div className="flex-1 min-w-0">
                    <Link to={`/products/${item.product.slug}`} className="font-medium text-gray-900 hover:text-primary-600 truncate block">
                      {item.product.name}
                    </Link>
                    <p className="text-primary-600 font-semibold mt-1">₹{price}</p>
                  </div>
                  <input
                    type="number"
                    min={1}
                    value={item.quantity}
                    onChange={async (e) => {
                      const q = parseInt(e.target.value);
                      if (q >= 1) {
                        try { await updateItem(item.id, q); }
                        catch { toast.error('Could not update quantity.'); }
                      }
                    }}
                    className="input w-16 text-center"
                  />
                  <p className="w-20 text-right font-semibold text-gray-900">₹{(price * item.quantity).toFixed(2)}</p>
                  <button
                    onClick={async () => {
                      try { await removeItem(item.id); toast.success('Item removed.'); }
                      catch { toast.error('Could not remove item.'); }
                    }}
                    className="text-red-500 hover:text-red-700 p-1"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              );
            })}

            {/* Summary */}
            <div className="bg-gray-50 border rounded-xl p-6 mt-4">
              <div className="flex justify-between text-lg font-bold text-gray-900 mb-4">
                <span>Total</span>
                <span>₹{total.toFixed(2)}</span>
              </div>
              <Link to="/checkout" className="btn-primary w-full text-center block py-3">
                Proceed to Checkout
              </Link>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
