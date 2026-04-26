export interface WishlistProduct {
  id: string;
  name: string;
  price: string;
  bg: string; // tailwind class for placeholder background
  inStock?: boolean;
}

interface Props {
  item: WishlistProduct;
  onRemove: (id: string) => void;
  onAddToCart: (id: string) => void;
}

export const WishlistRow = ({ item, onRemove, onAddToCart }: Props) => (
  <tr className="border-b border-ink/10">
    <td className="px-6 py-4">
      <button
        onClick={() => onRemove(item.id)}
        aria-label={`Remove ${item.name}`}
        className="text-mute hover:text-accent text-xl"
      >
        ×
      </button>
    </td>
    <td className="py-4">
      <div className="flex items-center gap-4">
        <a href="/product" className={`w-20 h-24 ${item.bg} rounded block`} />
        <a href="/product" className="font-medium hover:text-brand">
          {item.name}
        </a>
      </div>
    </td>
    <td className="py-4 font-semibold">{item.price}</td>
    <td className="px-6 py-4">
      <span className="text-green-700 text-sm">
        {item.inStock === false ? "Out of Stock" : "In Stock"}
      </span>
    </td>
    <td className="py-4 text-right">
      <button
        onClick={() => onAddToCart(item.id)}
        className="bg-ink text-white px-5 py-2 text-xs uppercase tracking-wider hover:bg-brand transition rounded"
      >
        Add to Cart
      </button>
    </td>
  </tr>
);

export const WishlistCard = ({ item, onRemove, onAddToCart }: Props) => (
  <div className="border border-ink/10 rounded p-4 bg-white">
    <div className={`aspect-[4/5] ${item.bg} rounded mb-3 relative`}>
      <button
        onClick={() => onRemove(item.id)}
        aria-label={`Remove ${item.name}`}
        className="absolute top-2 right-2 w-8 h-8 bg-white rounded-full grid place-items-center text-mute hover:text-accent"
      >
        ×
      </button>
    </div>
    <p className="font-medium">{item.name}</p>
    <p className="font-semibold mt-1">{item.price}</p>
    <button
      onClick={() => onAddToCart(item.id)}
      className="mt-3 w-full bg-ink text-white py-2 text-xs uppercase tracking-wider hover:bg-brand transition rounded"
    >
      Add to Cart
    </button>
  </div>
);
