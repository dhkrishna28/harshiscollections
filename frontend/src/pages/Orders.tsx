import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import PageLayout from "@/components/majori/PageLayout";
import AccountSidebar from "@/components/majori/AccountSidebar";
import { orderService } from "@/services/orderService";
import { formatPrice } from "@/lib/cart";

const FILTERS = ["All", "Pending", "Processing", "Shipped", "Delivered", "Cancelled", "Refunded"] as const;

const formatDate = (value: string) =>
  new Date(value).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

const statusTone: Record<string, string> = {
  delivered: "bg-green-100 text-green-700",
  shipped: "bg-blue-100 text-blue-700",
  processing: "bg-amber-100 text-amber-700",
  pending: "bg-sand text-ink",
  cancelled: "bg-red-100 text-red-700",
  refunded: "bg-gray-100 text-gray-700",
};

const Orders = () => {
  const [filter, setFilter] = useState<(typeof FILTERS)[number]>("All");
  const [search, setSearch] = useState("");

  const { data, isLoading } = useQuery({
    queryKey: ["orders", 1],
    queryFn: () => orderService.myOrders(1, 50),
  });

  const orders = data?.data ?? [];
  const visible = useMemo(
    () =>
      orders.filter((order) => {
        const matchesFilter = filter === "All" || order.status === filter.toLowerCase();
        const query = search.trim().toLowerCase();
        const matchesSearch =
          !query ||
          order.order_number.toLowerCase().includes(query) ||
          String(order.id).includes(query);

        return matchesFilter && matchesSearch;
      }),
    [filter, orders, search],
  );

  return (
    <PageLayout>
      <section className="bg-sand py-12 md:py-16">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h1 className="font-display text-3xl md:text-5xl">Order History</h1>
          <p className="text-mute mt-2 text-sm">
            <Link to="/" className="hover:text-brand">Home</Link> / <span className="text-ink">Order History</span>
          </p>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 py-14">
        <div className="flex flex-col md:flex-row gap-8">
          <AccountSidebar activePath="/orders" />
          <div className="flex-1">
            <div className="bg-white border border-ink/10 rounded">
              <div className="flex flex-wrap items-center justify-between gap-3 p-5 border-b border-ink/10">
                <div className="flex flex-wrap gap-2 text-sm">
                  {FILTERS.map((value) => (
                    <button
                      key={value}
                      type="button"
                      onClick={() => setFilter(value)}
                      className={`px-4 py-2 rounded-full transition ${
                        filter === value ? "bg-ink text-white" : "border border-ink/20 hover:bg-ink hover:text-white"
                      }`}
                    >
                      {value}
                    </button>
                  ))}
                </div>
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search order #"
                  className="border border-ink/15 px-4 py-2 rounded text-sm"
                />
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm min-w-[600px]">
                  <thead className="bg-cream">
                    <tr className="text-left text-xs uppercase tracking-wider text-mute">
                      <th className="py-3 px-4">Order #</th>
                      <th className="py-3 px-4">Date</th>
                      <th className="py-3 px-4">Total</th>
                      <th className="py-3 px-4">Payment</th>
                      <th className="py-3 px-4">Status</th>
                      <th className="py-3 px-4 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {isLoading ? (
                      <tr>
                        <td colSpan={6} className="py-10 text-center text-mute">Loading orders...</td>
                      </tr>
                    ) : visible.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="py-10 text-center text-mute">
                          No orders found.
                        </td>
                      </tr>
                    ) : (
                      visible.map((order) => (
                        <tr key={order.id} className="border-b border-ink/5">
                          <td className="py-4 px-4 font-medium">{order.order_number}</td>
                          <td className="py-4 px-4">{formatDate(order.created_at)}</td>
                          <td className="py-4 px-4 font-semibold">{formatPrice(Number(order.total))}</td>
                          <td className="py-4 px-4 capitalize">{order.payment_status}</td>
                          <td className="py-4 px-4">
                            <span className={`${statusTone[order.status] || "bg-cream text-ink"} px-3 py-1 rounded-full text-xs capitalize`}>
                              {order.status}
                            </span>
                          </td>
                          <td className="py-4 px-4 text-right">
                            <Link to={`/orders/${order.id}`} className="text-sm hover:text-brand border-b border-ink hover:border-brand">
                              View
                            </Link>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </section>
    </PageLayout>
  );
};

export default Orders;
