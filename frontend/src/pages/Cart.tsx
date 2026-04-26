import { Link } from "react-router-dom";
import { useCart } from "@/context/CartContext";
import toast from "react-hot-toast";
import PageLayout from "@/components/majori/PageLayout";
import Newsletter from "@/components/majori/Newsletter";
import PageHeader from "@/components/majori/PageHeader";
import OrderSummary from "@/components/majori/OrderSummary";
import { formatPrice } from "@/lib/cart";

const Cart = () => {
  const { cart, updateItem, removeItem } = useCart();
  const items = cart?.items ?? [];

  const subtotal = items.reduce((s, i) => s + Number(i.product.price) * i.quantity, 0);

  const API_ORIGIN =
    (import.meta.env.VITE_API_BASE_URL as string | undefined)?.replace("/api", "") || "";

  return (
    <PageLayout>
      <PageHeader title="Cart" crumbs={[{ label: "Home", to: "/" }, { label: "Cart" }]} />

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
                    <tr key={it.id} className="border-b border-ink/10">
                      <td className="py-5 pr-4">
                        <div className="flex gap-4 items-center">
                          <img
                            src={it.product.images?.[0]?.image_path ? `${API_ORIGIN}${it.product.images[0].image_path}` : "/placeholder.png"}
                            alt={it.product.name}
                            className="w-20 h-24 object-cover rounded"
                          />
                          <div>
                            <Link to={`/product/${it.product.slug}`} className="font-medium hover:text-brand">
                              {it.product.name}
                            </Link>
                            <p className="text-sm text-mute">{it.selected_size || "Default"}</p>
                            <button
                              onClick={async () => {
                                try {
                                  await removeItem(it.id);
                                  toast.success("Item removed");
                                } catch {
                                  toast.error("Could not remove item");
                                }
                              }}
                              className="text-xs text-mute hover:text-accent-red mt-1 underline"
                            >
                              Remove
                            </button>
                          </div>
                        </div>
                      </td>
                      <td className="py-5 text-center">{formatPrice(Number(it.product.price))}</td>
                      <td className="py-5 text-center">
                        <div className="inline-flex border border-ink/20 rounded">
                          <button
                            onClick={() => updateItem(it.id, Math.max(1, it.quantity - 1))}
                            className="w-8 h-9 hover:bg-cream"
                            aria-label="Decrease"
                          >
                            −
                          </button>
                          <input
                            value={it.quantity}
                            onChange={(e) => {
                              const n = parseInt(e.target.value || "1", 10);
                              updateItem(it.id, Number.isNaN(n) ? 1 : Math.max(1, n));
                            }}
                            className="w-10 h-9 text-center outline-none bg-transparent"
                          />
                          <button
                            onClick={() => updateItem(it.id, it.quantity + 1)}
                            className="w-8 h-9 hover:bg-cream"
                            aria-label="Increase"
                          >
                            +
                          </button>
                        </div>
                      </td>
                      <td className="py-5 text-right font-semibold">
                        {formatPrice(Number(it.product.price) * it.quantity)}
                      </td>
                    </tr>
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
            footer={<p className="text-xs text-mute text-center mt-3">Secure SSL encrypted payment</p>}
          />
        </div>
      </section>

      <Newsletter />
    </PageLayout>
  );
};

export default Cart;
