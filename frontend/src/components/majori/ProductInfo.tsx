import { useState } from "react";
import QuantityInput from "./QuantityInput";

export interface ProductInfoData {
  brand: string;
  name: string;
  rating: number;
  reviewCount: number;
  price: string;
  oldPrice?: string;
  savePct?: number;
  description: string;
  colors: { name: string; className: string }[];
  sizes: string[];
}

const ProductInfo = ({ data }: { data: ProductInfoData }) => {
  const [color, setColor] = useState(data.colors[0]?.name);
  const [size, setSize] = useState("M");
  const [qty, setQty] = useState(1);

  return (
    <div>
      <p className="text-xs uppercase tracking-widest text-brand mb-2">
        {data.brand}
      </p>
      <h1 className="font-display text-3xl md:text-4xl font-semibold mb-3">
        {data.name}
      </h1>
      <div className="flex items-center gap-3 mb-5">
        <div className="text-brand">{"★".repeat(Math.round(data.rating))}</div>
        <span className="text-sm text-mute">({data.reviewCount} reviews)</span>
      </div>
      <div className="flex items-baseline gap-3 mb-6">
        <span className="text-3xl font-semibold">{data.price}</span>
        {data.oldPrice && (
          <span className="text-mute line-through">{data.oldPrice}</span>
        )}
        {data.savePct && (
          <span className="bg-accent-red/10 text-accent-red text-xs px-2 py-1 rounded">
            Save {data.savePct}%
          </span>
        )}
      </div>
      <p className="text-mute mb-6 leading-relaxed">{data.description}</p>

      <div className="mb-5">
        <p className="text-sm font-semibold mb-3">
          Color: <span className="text-mute font-normal">{color}</span>
        </p>
        <div className="flex gap-2">
          {data.colors.map((c) => (
            <button
              key={c.name}
              onClick={() => setColor(c.name)}
              aria-label={c.name}
              className={`w-9 h-9 rounded-full ${c.className} ${
                color === c.name ? "ring-2 ring-offset-2 ring-ink" : ""
              }`}
            />
          ))}
        </div>
      </div>

      <div className="mb-6">
        <div className="flex items-center justify-between mb-3">
          <p className="text-sm font-semibold">
            Size: <span className="text-mute font-normal">{size}</span>
          </p>
          <a href="#" className="text-xs underline text-mute">
            Size guide
          </a>
        </div>
        <div className="flex gap-2">
          {data.sizes.map((s) => (
            <button
              key={s}
              onClick={() => setSize(s)}
              className={`w-12 h-12 border text-sm transition ${
                size === s
                  ? "border-ink bg-ink text-white"
                  : "border-ink/20 hover:border-ink"
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-3 mb-6">
        <QuantityInput value={qty} onChange={setQty} />
        <button className="flex-1 min-w-[200px] bg-ink text-white px-7 h-12 uppercase tracking-wider text-sm hover:bg-brand transition rounded">
          Add to Cart
        </button>
        <button
          className="w-12 h-12 border border-ink/20 hover:border-ink grid place-items-center"
          aria-label="Wishlist"
        >
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.6"
          >
            <path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.6l-1-1a5.5 5.5 0 1 0-7.8 7.8l1 1L12 21l7.8-7.6 1-1a5.5 5.5 0 0 0 0-7.8z" />
          </svg>
        </button>
      </div>

      <button className="block w-full text-center bg-brand text-white px-7 py-3 uppercase tracking-wider text-sm hover:bg-ink transition rounded mb-8">
        Buy It Now
      </button>

      <ul className="text-sm space-y-2 text-ink/80 border-t border-ink/10 pt-5">
        <li>✓ Free shipping on orders over $100</li>
        <li>✓ 30-day return policy</li>
        <li>✓ Secure checkout — visa, mastercard, paypal</li>
      </ul>
    </div>
  );
};

export default ProductInfo;
