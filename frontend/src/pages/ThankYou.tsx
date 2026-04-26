import { useQuery } from "@tanstack/react-query";
import { Link, useParams } from "react-router-dom";
import PageLayout from "@/components/majori/PageLayout";
import { formatPrice } from "@/lib/cart";
import { orderService } from "@/services/orderService";

const API_ORIGIN =
  (import.meta.env.VITE_API_BASE_URL as string | undefined)?.replace("/api", "") || "";

const ThankYou = () => {
  const { orderId } = useParams();

  const { data, isLoading } = useQuery({
    queryKey: ["thank-you-order", orderId],
    queryFn: () => orderService.getOrderDetail(Number(orderId)),
    enabled: !!orderId,
  });

  const order = data?.data;

  return (
    <PageLayout>
      <section className="bg-sand py-12 md:py-16">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h1 className="font-display text-3xl md:text-5xl">Thank You!</h1>
          <p className="text-mute mt-2 text-sm">
            <Link to="/" className="hover:text-brand">Home</Link> / <span className="text-ink">Order Confirmed</span>
          </p>
        </div>
      </section>

      <section className="max-w-3xl mx-auto px-4 py-14">
        <div className="text-center mb-10">
          <div className="w-20 h-20 mx-auto bg-green-100 text-green-600 rounded-full grid place-items-center mb-5">
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M5 12l5 5L20 7" />
            </svg>
          </div>
          <h2 className="font-display text-3xl">Your order is confirmed</h2>
          <p className="text-mute mt-3">
            {isLoading ? "Loading order details..." : (
              <>
                Order <span className="font-semibold text-ink">{order?.order_number || `#${orderId}`}</span>
                {" "}· Your order details are now available in your account history.
              </>
            )}
          </p>
        </div>

        <div className="bg-white border border-ink/10 rounded p-6 md:p-8 space-y-6">
          <div className="grid sm:grid-cols-2 gap-6 pb-6 border-b border-ink/10">
            <div>
              <p className="text-xs uppercase tracking-wider text-mute mb-2">Shipping Address</p>
              <p className="text-sm leading-relaxed">
                {order?.shipping_name || "Loading..."}
                {order ? <><br />{order.shipping_address}</> : null}
                {order ? <><br />{[order.shipping_city, order.shipping_state, order.shipping_postal].filter(Boolean).join(", ")}</> : null}
                {order ? <><br />{order.shipping_country}</> : null}
              </p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-wider text-mute mb-2">Payment Method</p>
              <p className="text-sm capitalize">{order?.payment_method || "Loading..."}</p>
              <p className="text-xs uppercase tracking-wider text-mute mt-4 mb-2">Payment Status</p>
              <p className="text-sm capitalize">{order?.payment_status || "Pending"}</p>
            </div>
          </div>

          <div>
            <p className="text-xs uppercase tracking-wider text-mute mb-4">Order Items</p>
            <div className="space-y-4">
              {order?.items?.map((item) => {
                const image = item.product?.images?.[0]?.image_path
                  ? `${API_ORIGIN}${item.product.images[0].image_path}`
                  : "/placeholder.png";

                return (
                  <div key={item.id} className="flex gap-4 items-center">
                    <img src={image} alt={item.product_name} className="w-16 h-20 object-cover rounded shrink-0" />
                    <div className="flex-1">
                      <p className="font-medium text-sm">{item.product_name}</p>
                      <p className="text-xs text-mute">
                        {item.selected_size ? `Size ${item.selected_size} · ` : ""}Qty {item.quantity}
                      </p>
                    </div>
                    <p className="text-sm font-semibold">{formatPrice(Number(item.total_price))}</p>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="pt-6 border-t border-ink/10 space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-mute">Subtotal</span>
              <span>{formatPrice(Number(order?.subtotal || 0))}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-mute">Shipping</span>
              <span>{formatPrice(Number(order?.shipping_charge || 0))}</span>
            </div>
            <div className="flex justify-between text-lg font-display pt-3 border-t border-ink/10 mt-3">
              <span>Total</span>
              <span>{formatPrice(Number(order?.total || 0))}</span>
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 justify-center mt-8">
          <Link to="/orders" className="bg-ink text-white px-8 py-3 uppercase text-xs tracking-wider hover:bg-brand transition rounded text-center">
            View Order History
          </Link>
          <Link to="/collection" className="border border-ink px-8 py-3 uppercase text-xs tracking-wider hover:bg-ink hover:text-white transition rounded text-center">
            Continue Shopping
          </Link>
        </div>
      </section>
    </PageLayout>
  );
};

export default ThankYou;
