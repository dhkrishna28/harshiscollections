import { type CartItem, formatPrice } from "@/lib/cart";

interface Props {
  item: CartItem;
  onQtyChange: (id: CartItem["id"], qty: number) => void;
  onRemove: (id: CartItem["id"]) => void;
}

const CartLineItem = ({ item, onQtyChange, onRemove }: Props) => (
  <tr className="border-b border-ink/10">
    <td className="py-5 pr-4">
      <div className="flex gap-4 items-center">
        <img
          src={item.img}
          alt={item.name}
          className="w-20 h-24 object-cover rounded"
        />
        <div>
          <p className="font-medium">{item.name}</p>
          <p className="text-sm text-mute">{item.variant}</p>
          <button
            onClick={() => onRemove(item.id)}
            className="text-xs text-mute hover:text-accent-red mt-1 underline"
          >
            Remove
          </button>
        </div>
      </div>
    </td>
    <td className="py-5 text-center">{formatPrice(item.price)}</td>
    <td className="py-5 text-center">
      <div className="inline-flex border border-ink/20 rounded">
        <button
          onClick={() => onQtyChange(item.id, Math.max(1, item.qty - 1))}
          className="w-8 h-9 hover:bg-cream"
          aria-label="Decrease"
        >
          −
        </button>
        <input
          value={item.qty}
          onChange={(e) => {
            const n = parseInt(e.target.value || "1", 10);
            onQtyChange(item.id, isNaN(n) ? 1 : Math.max(1, n));
          }}
          className="w-10 h-9 text-center outline-none bg-transparent"
        />
        <button
          onClick={() => onQtyChange(item.id, item.qty + 1)}
          className="w-8 h-9 hover:bg-cream"
          aria-label="Increase"
        >
          +
        </button>
      </div>
    </td>
    <td className="py-5 text-right font-semibold">
      {formatPrice(item.price * item.qty)}
    </td>
  </tr>
);

export default CartLineItem;
