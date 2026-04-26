import { useEffect } from "react";
import { Link } from "react-router-dom";
import { useCart } from "@/context/CartContext";

const API_ORIGIN =
  (import.meta.env.VITE_API_BASE_URL as string | undefined)?.replace(
    "/api",
    "",
  ) || "";

interface Props {
  open: boolean;
  onClose: () => void;
}

const CartDrawer = ({ open, onClose }: Props) => {
  const { cart, itemCount } = useCart();

  useEffect(() => {
    document.body.classList.toggle("overflow-hidden", open);
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  const items = cart?.items ?? [];
  const subtotal = items.reduce(
    (sum, item) => sum + Number(item.product.price) * item.quantity,
    0,
  );

  return (
    <>
      <div
        onClick={onClose}
        className={`drawer-backdrop fixed inset-0 bg-black/50 z-40 ${open ? "open" : ""}`}
      />
      <aside
        className={`cart-drawer fixed top-0 right-0 h-full w-full sm:w-[420px] bg-white z-50 shadow-2xl flex flex-col ${open ? "open" : ""}`}
      >
        <div className="flex items-center justify-between px-6 py-5 border-b border-ink/10">
          <h3 className="font-display text-xl">Shopping Cart ({itemCount})</h3>
          <button onClick={onClose} aria-label="Close" className="p-1 hover:text-accent-red">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
              <path d="M6 6l12 12M18 6L6 18" />
            </svg>
          </button>
        </div>
        <div className="flex-1 overflow-y-auto px-6 py-4 space-y-5">
          {items.length === 0 ? (
            <p className="text-sm text-mute">Your cart is currently empty.</p>
          ) : (
            items.map((item) => {
              const imageUrl = item.product.images?.[0]?.image_path
                ? `${API_ORIGIN}${item.product.images[0].image_path}`
                : "/placeholder.png";

              return (
                <div
                  key={item.id}
                  className="flex gap-4 border-b border-ink/10 pb-4"
                >
                  <img
                    src={imageUrl}
                    alt={item.product.name}
                    className="w-20 h-24 object-cover rounded"
                  />
                  <div className="flex-1">
                    <Link
                      to={`/product/${item.product.slug}`}
                      onClick={onClose}
                      className="font-medium hover:text-brand transition"
                    >
                      {item.product.name}
                    </Link>
                    {item.selected_size && (
                      <p className="text-sm text-mute mt-1">
                        Size: {item.selected_size}
                      </p>
                    )}
                    <p className="text-sm text-mute mt-1">Qty: {item.quantity}</p>
                    <p className="font-semibold mt-2">
                      ₹{(Number(item.product.price) * item.quantity).toFixed(2)}
                    </p>
                  </div>
                </div>
              );
            })
          )}
        </div>
        <div className="border-t border-ink/10 px-6 py-5 space-y-3">
          <div className="flex justify-between text-sm">
            <span className="text-mute">Subtotal</span>
            <span className="font-semibold">₹{subtotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-xs text-mute">
            <span>Shipping & taxes calculated at checkout</span>
          </div>
          <Link to="/cart" onClick={onClose} className="block text-center border border-ink py-3 uppercase text-xs tracking-wider hover:bg-ink hover:text-white transition rounded">
            View Cart
          </Link>
          <Link to="/checkout" onClick={onClose} className="block text-center bg-ink text-white py-3 uppercase text-xs tracking-wider hover:bg-brand transition rounded">
            Checkout
          </Link>
        </div>
      </aside>
    </>
  );
};

export default CartDrawer;
