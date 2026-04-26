import { Link } from "react-router-dom";

export interface ListingProduct {
  id: string | number;
  name: string;
  price: string;
  oldPrice?: string;
  /** Numeric price used for filtering/sorting. Falls back to parsed `price` if omitted. */
  priceNumber?: number;
  badge?: { label: string; tone: "sale" | "new" | "hot" };
  img: string;
  href?: string;
  /** Filterable metadata */
  category?: string;
  colors?: string[];
  sizes?: string[];
  brand?: string;
}

const badgeToneClass: Record<NonNullable<ListingProduct["badge"]>["tone"], string> = {
  sale: "bg-accent-red text-white",
  new: "bg-brand text-white",
  hot: "bg-rose text-ink",
};

interface ProductCardProps {
  p: ListingProduct;
  onAddToCart?: (product: ListingProduct) => void;
}

const ProductCard = ({ p, onAddToCart }: ProductCardProps) => {
  const content = (
    <>
      <div className="relative bg-white overflow-hidden rounded-md aspect-[4/5]">
        {p.badge && (
          <span
            className={`absolute top-3 left-3 ${badgeToneClass[p.badge.tone]} text-[10px] uppercase tracking-wider px-2 py-1 rounded z-10`}
          >
            {p.badge.label}
          </span>
        )}
        <img
          src={p.img}
          alt={p.name}
          loading="lazy"
          className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
        />
        <div className="absolute inset-x-3 bottom-3 opacity-0 group-hover:opacity-100 transition">
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              onAddToCart?.(p);
            }}
            className="w-full bg-ink text-white text-xs uppercase tracking-wider py-2.5 hover:bg-brand"
          >
            Add to Cart
          </button>
        </div>
      </div>
      <div className="pt-3">
        <p className="text-sm font-medium group-hover:text-brand">{p.name}</p>
        <p className="text-sm mt-1">
          <span className="font-semibold">{p.price}</span>
          {p.oldPrice && (
            <span className="text-mute line-through text-sm ml-2">{p.oldPrice}</span>
          )}
        </p>
      </div>
    </>
  );

  if (p.href) {
    return (
      <Link to={p.href} className="group block">
        {content}
      </Link>
    );
  }

  return (
    <a href="#" className="group block">
      {content}
    </a>
  );
};

export default ProductCard;
