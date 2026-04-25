import { useState } from "react";
import { Link } from "react-router-dom";
import Header from "@/components/majori/Header";
import Footer from "@/components/majori/Footer";
import Newsletter from "@/components/majori/Newsletter";
import CartDrawer from "@/components/majori/CartDrawer";
import MenuDrawer from "@/components/majori/MenuDrawer";
import PageHeader from "@/components/majori/PageHeader";
import CartLineItem from "@/components/majori/CartLineItem";
import OrderSummary from "@/components/majori/OrderSummary";
import { sampleCart, type CartItem } from "@/lib/cart";

const Cart = () => {
  const [cartOpen, setCartOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [items, setItems] = useState<CartItem[]>(sampleCart);

  const subtotal = items.reduce((s, i) => s + i.price * i.qty, 0);

  const setQty = (id: CartItem["id"], qty: number) =>
    setItems((prev) => prev.map((i) => (i.id === id ? { ...i, qty } : i)));
  const remove = (id: CartItem["id"]) =>
    setItems((prev) => prev.filter((i) => i.id !== id));

  return (
    <div className="bg-cream text-ink antialiased min-h-screen">
      <Header
        onOpenCart={() => setCartOpen(true)}
        onOpenMenu={() => setMenuOpen(true)}
      />

      <PageHeader
        title="Cart"
        crumbs={[{ label: "Home", to: "/" }, { label: "Cart" }]}
      />

      <section className="py-10 md:py-14">
        <div className="max-w-7xl mx-auto px-4 grid md:grid-cols-[1fr_360px] gap-10">
          <div>
            <div className="overflow-x-auto bg-white rounded-md p-2 md:p-6">
              <table className="w-full text-sm min-w-[600px]">
                <thead>
                  <tr className="text-left text-mute uppercase text-xs tracking-wider border-b border-ink/10">
                    <th className="py-3">Product</th>
                    <th className="py-3 text-center">Price</th>
                    <th className="py-3 text-center">Quantity</th>
                    <th className="py-3 text-right">Total</th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((it) => (
                    <CartLineItem
                      key={it.id}
                      item={it}
                      onQtyChange={setQty}
                      onRemove={remove}
                    />
                  ))}
                </tbody>
              </table>
            </div>

            <div className="flex flex-wrap gap-3 justify-between items-center mt-6">
              <Link
                to="/collection"
                className="border border-ink px-6 py-3 text-sm uppercase tracking-wider hover:bg-ink hover:text-white transition rounded"
              >
                ← Continue Shopping
              </Link>
              <button className="bg-cream border border-ink/15 px-6 py-3 text-sm uppercase tracking-wider hover:bg-ink hover:text-white transition rounded">
                Update Cart
              </button>
            </div>
          </div>

          <OrderSummary
            subtotal={subtotal}
            total={subtotal}
            cta={
              <Link
                to="/checkout"
                className="block text-center bg-ink text-white py-3 mt-6 uppercase tracking-wider text-sm hover:bg-brand transition rounded"
              >
                Checkout
              </Link>
            }
            footer={
              <p className="text-xs text-mute text-center mt-3">
                Secure SSL encrypted payment
              </p>
            }
          />
        </div>
      </section>

      <Newsletter />
      <Footer />

      <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} />
      <MenuDrawer open={menuOpen} onClose={() => setMenuOpen(false)} />
    </div>
  );
};

export default Cart;
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";
import toast from "react-hot-toast";

export default function Cart() {
  const { cart, isLoading, removeItem, updateItem } = useCart();
  const apiBase =
    (import.meta.env.VITE_API_BASE_URL as string | undefined)?.replace(
      "/api",
      "",
    ) || "";

  if (isLoading)
    return (
      <div className="flex justify-center py-32">
        <div className="w-8 h-8 border-4 border-primary-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );

  const items = cart?.items ?? [];
  const total = items.reduce((sum, item) => {
    return sum + item.product.price * item.quantity;
  }, 0);

  return (
    <>
      <Helmet>
        <title>Shopping Cart – Harshis Collections</title>
      </Helmet>
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-2xl font-serif font-bold text-gray-900 mb-8">
          Shopping Cart
        </h1>

        {items.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-gray-500 text-lg mb-6">Your cart is empty.</p>
            <Link to="/products" className="btn-primary">
              Browse Products
            </Link>
          </div>
        ) : (
          <div className="flex flex-col gap-6">
            {items.map((item) => {
              const price = item.product.price;
              const imageUrl = item.product.images?.[0]?.image_path
                ? `${apiBase}${item.product.images[0].image_path}`
                : "/placeholder.png";
              return (
                <div
                  key={item.id}
                  className="flex items-center gap-6 bg-white border rounded-xl p-4"
                >
                  <img
                    src={imageUrl}
                    alt={item.product.name}
                    className="w-28 h-28 object-cover rounded-lg"
                  />
                  <div className="flex-1 min-w-0">
                    <Link
                      to={`/products/${item.product.slug}`}
                      className="font-medium text-gray-900 hover:text-primary-600 truncate block"
                    >
                      {item.product.name}
                    </Link>
                    {item.selected_size && (
                      <p className="text-xs text-gray-500 mt-1">
                        Size: {item.selected_size}
                      </p>
                    )}
                    <p className="text-primary-600 font-semibold mt-1">
                      ₹{price}
                    </p>
                  </div>
                  <div className="flex items-center gap-4">
                    <input
                      type="number"
                      min={1}
                      value={item.quantity}
                      onChange={async (e) => {
                        const q = parseInt(e.target.value);
                        if (q >= 1) {
                          try {
                            await updateItem(item.id, q);
                          } catch {
                            toast.error("Could not update quantity.");
                          }
                        }
                      }}
                      className="input w-20 text-center"
                    />
                    <p className="w-28 text-right font-semibold text-gray-900">
                      ₹{(price * item.quantity).toFixed(2)}
                    </p>
                    <button
                      onClick={async () => {
                        try {
                          await removeItem(item.id);
                          toast.success("Item removed.");
                        } catch {
                          toast.error("Could not remove item.");
                        }
                      }}
                      className="text-red-500 hover:text-red-700 p-1"
                    >
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M6 18L18 6M6 6l12 12"
                        />
                      </svg>
                    </button>
                  </div>
                </div>
              );
            })}

            {/* Summary */}
            <div className="bg-gray-50 border rounded-xl p-6 mt-4">
              <div className="flex justify-between text-lg font-bold text-gray-900 mb-4">
                <span>Total</span>
                <span>₹{total.toFixed(2)}</span>
              </div>
              <Link
                to="/checkout"
                className="btn-primary w-full text-center block py-3"
              >
                Proceed to Checkout
              </Link>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
