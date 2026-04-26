import { useQuery } from "@tanstack/react-query";
import { Link, useParams } from "react-router-dom";
import PageLayout from "@/components/majori/PageLayout";
import AccountSidebar from "@/components/majori/AccountSidebar";
import { formatPrice } from "@/lib/cart";
import { orderService } from "@/services/orderService";

const API_ORIGIN =
  (import.meta.env.VITE_API_BASE_URL as string | undefined)?.replace("/api", "") || "";

const statusTone: Record<string, string> = {
  delivered: "bg-green-100 text-green-700",
  shipped: "bg-blue-100 text-blue-700",
  processing: "bg-amber-100 text-amber-700",
  pending: "bg-sand text-ink",
  cancelled: "bg-red-100 text-red-700",
  refunded: "bg-gray-100 text-gray-700",
};

const formatDate = (value: string) =>
  new Date(value).toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

const OrderDetail = () => {
  const { id } = useParams();

  const { data, isLoading, isError } = useQuery({
    queryKey: ["order", id],
    queryFn: () => orderService.getOrderDetail(Number(id)),
    enabled: !!id,
  });

  const order = data?.data;

  return (
    <PageLayout>
      <section className="bg-sand py-12 md:py-16">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h1 className="font-display text-3xl md:text-5xl">
            {order ? order.order_number : "Order Details"}
          </h1>
          <p className="text-mute mt-2 text-sm">
            <Link to="/" className="hover:text-brand">Home</Link> /{" "}
            <Link to="/orders" className="hover:text-brand">Orders</Link> /{" "}
            <span className="text-ink">{order?.order_number || "Loading..."}</span>
          </p>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 py-14">
        <div className="flex flex-col md:flex-row gap-8">
          <AccountSidebar activePath="/orders" />

          <div className="flex-1 space-y-6">
            {isLoading ? (
              <div className="bg-white border border-ink/10 rounded p-8 text-center text-mute">Loading order...</div>
            ) : isError || !order ? (
              <div className="bg-white border border-ink/10 rounded p-8 text-center">
                <p className="font-medium">We couldn't load this order.</p>
                <Link to="/orders" className="inline-block mt-4 text-brand hover:underline">Back to orders</Link>
              </div>
            ) : (
              <>
                <div className="bg-white border border-ink/10 rounded p-6 flex flex-wrap items-center justify-between gap-4">
                  <div>
                    <p className="text-xs uppercase tracking-wider text-mute">Status</p>
                    <p className="font-display text-2xl mt-1">
                      <span className={`${statusTone[order.status] || "bg-cream text-ink"} px-3 py-1 rounded-full text-sm capitalize align-middle`}>
                        {order.status}
                      </span>
                    </p>
                    <p className="text-sm text-mute mt-3">
                      Placed on {formatDate(order.created_at)} · {order.items?.length ?? 0} items
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs uppercase tracking-wider text-mute">Order Total</p>
                    <p className="font-display text-2xl mt-1">{formatPrice(Number(order.total))}</p>
                    <p className="text-sm text-mute mt-1 capitalize">
                      Payment {order.payment_status} via {order.payment_method || "N/A"}
                    </p>
                  </div>
                </div>

                <div className="bg-white border border-ink/10 rounded p-6">
                  <h2 className="font-display text-xl mb-5">Items</h2>
                  <div className="space-y-5">
                    {order.items?.map((item) => {
                      const image = item.product?.images?.[0]?.image_path
                        ? `${API_ORIGIN}${item.product.images[0].image_path}`
                        : "/placeholder.png";

                      return (
                        <div key={item.id} className="flex gap-4 items-center pb-5 border-b border-ink/5 last:border-b-0 last:pb-0">
                          <img src={image} alt={item.product_name} className="w-20 h-24 object-cover rounded shrink-0" />
                          <div className="flex-1">
                            <p className="font-medium">{item.product_name}</p>
                            <p className="text-xs text-mute">
                              {item.selected_size ? `Size ${item.selected_size} · ` : ""}Qty {item.quantity}
                            </p>
                            <Link to="/collection" className="text-xs text-brand hover:underline mt-1 inline-block">
                              Continue Shopping
                            </Link>
                          </div>
                          <p className="font-semibold">{formatPrice(Number(item.total_price))}</p>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div className="bg-white border border-ink/10 rounded p-6">
                    <h2 className="font-display text-xl mb-4">Shipping Address</h2>
                    <p className="text-sm leading-relaxed">
                      {order.shipping_name}
                      <br />
                      {order.shipping_address}
                      <br />
                      {[order.shipping_city, order.shipping_state, order.shipping_postal].filter(Boolean).join(", ")}
                      <br />
                      {order.shipping_country}
                    </p>
                  </div>
                  <div className="bg-white border border-ink/10 rounded p-6">
                    <h2 className="font-display text-xl mb-4">Order Summary</h2>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-mute">Subtotal</span>
                        <span>{formatPrice(Number(order.subtotal))}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-mute">Shipping</span>
                        <span>{formatPrice(Number(order.shipping_charge))}</span>
                      </div>
                      <div className="flex justify-between text-lg font-display pt-3 border-t border-ink/10 mt-3">
                        <span>Total</span>
                        <span>{formatPrice(Number(order.total))}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </section>
    </PageLayout>
  );
};

export default OrderDetail;
