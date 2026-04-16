import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import type { Product } from '../../types';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';

const API_BASE = (import.meta.env.VITE_API_BASE_URL as string | undefined)?.replace('/api', '') || '';

export default function ProductCard({ product }: { product: Product }) {
  const { addItem } = useCart();
  const { isAuthenticated } = useAuth();
  const hasSizeInventory = (product.size_inventory?.length ?? 0) > 0;
  const isOutOfStock = product.stock_quantity === 0;


  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (!isAuthenticated) {
      toast.error('Please login to add items to cart.');
      return;
    }
    if (hasSizeInventory) {
      toast.error('Please choose a size on the product page.');
      return;
    }
    try {
      await addItem(product.id);
      toast.success('Added to cart!');
    } catch {
      toast.error('Could not add to cart.');
    }
  };

  const hasDiscount = !!product.compare_at_price && Number(product.compare_at_price) > Number(product.price);
	
  const imageUrl = product.images?.[0]?.image_path
    ? `${API_BASE}${product.images[0].image_path}`
    : '/placeholder.png';


  return (
    <Link to={`/products/${product.slug}`} className="group block bg-white rounded-xl border hover:shadow-md transition-shadow overflow-hidden">
      <div className="aspect-square overflow-hidden bg-gray-100">
        <img
          src={imageUrl}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
      </div>
      <div className="p-4">
        <p className="text-xs text-primary-600 font-medium mb-1 truncate">{product.category?.name}</p>
        <h3 className="font-semibold text-gray-900 text-sm leading-snug line-clamp-2 mb-2">{product.name}</h3>
        {product.brand && <p className="text-xs text-gray-400 mb-1.5">by {product.brand}</p>}
        <div className="flex items-center justify-between mt-2">
          <div className="flex items-baseline gap-1.5">
            <span className="font-bold text-gray-900">₹{product.price}</span>
            {hasDiscount && (
              <span className="text-xs text-gray-400 line-through">₹{product.compare_at_price}</span>
            )}
          </div>
          <button
            onClick={handleAddToCart}
            disabled={isOutOfStock}
            className="text-xs btn-primary py-1 px-3 disabled:opacity-50"
          >
            {isOutOfStock ? 'Out' : hasSizeInventory ? 'Select' : 'Add'}
          </button>
        </div>
      </div>
    </Link>
  );
}
