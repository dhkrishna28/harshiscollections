import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import PageLayout from "@/components/majori/PageLayout";
import AccountSidebar from "@/components/majori/AccountSidebar";
import { accountService } from "@/services/accountService";
import { orderService } from "@/services/orderService";
import { formatPrice } from "@/lib/cart";

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

const Account = () => {
  const { data: profileData, isLoading: profileLoading } = useQuery({
    queryKey: ["account-profile"],
    queryFn: () => accountService.getProfile(),
  });

  const { data: ordersData, isLoading: ordersLoading } = useQuery({
    queryKey: ["account-overview-orders"],
    queryFn: () => orderService.myOrders(1, 5),
  });

  const profile = profileData?.data;
  const orders = ordersData?.data ?? [];
  const totalSpent = orders.reduce((sum, order) => sum + Number(order.total), 0);
  const displayName = profile ? `${profile.first_name} ${profile.last_name}`.trim() : "Harshis Customer";

  return (
    <PageLayout>
      <section className="bg-gradient-to-br from-sand via-cream to-sand py-12 md:py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <p className="text-mute text-sm">
                <Link to="/" className="hover:text-brand">Home</Link> /{" "}
                <span className="text-ink">My Account</span>
              </p>
              <h1 className="font-display text-3xl md:text-5xl mt-2">
                {profileLoading ? "Loading your account..." : `Welcome back, ${displayName}`}
              </h1>
              <p className="text-mute mt-2">Your profile, recent orders, and saved details all in one place.</p>
            </div>
            <div className="flex gap-3">
              <Link to="/collection" className="border border-ink px-5 py-2.5 text-xs uppercase tracking-wider hover:bg-ink hover:text-white rounded transition">
                Continue Shopping
              </Link>
              <Link to="/orders" className="bg-ink text-white px-5 py-2.5 text-xs uppercase tracking-wider hover:bg-brand rounded transition">
                View Orders
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 py-14">
        <div className="flex flex-col lg:flex-row gap-8">
          <AccountSidebar activePath="/account" />

          <div className="flex-1 space-y-6">
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-white border border-ink/10 rounded-lg p-5">
                <p className="text-xs uppercase tracking-wider text-mute">Total Orders</p>
                <p className="font-display text-3xl mt-3">{ordersData?.total ?? 0}</p>
              </div>
              <div className="bg-white border border-ink/10 rounded-lg p-5">
                <p className="text-xs uppercase tracking-wider text-mute">Total Spent</p>
                <p className="font-display text-3xl mt-3">{formatPrice(totalSpent)}</p>
              </div>
              <div className="bg-white border border-ink/10 rounded-lg p-5">
                <p className="text-xs uppercase tracking-wider text-mute">Pending Orders</p>
                <p className="font-display text-3xl mt-3">
                  {orders.filter((order) => ["pending", "processing"].includes(order.status)).length}
                </p>
              </div>
              <div className="bg-gradient-to-br from-brand to-brand/70 text-ink border border-brand rounded-lg p-5">
                <p className="text-xs uppercase tracking-wider opacity-70">Primary Email</p>
                <p className="font-semibold text-lg mt-3 break-all">{profile?.email || "Loading..."}</p>
              </div>
            </div>

            <div className="grid lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 bg-white border border-ink/10 rounded-lg p-6">
                <div className="flex items-center justify-between mb-5">
                  <h2 className="font-display text-xl">Recent Orders</h2>
                  <Link to="/orders" className="text-sm text-brand hover:underline">View All</Link>
                </div>

                {ordersLoading ? (
                  <p className="text-sm text-mute">Loading orders...</p>
                ) : orders.length === 0 ? (
                  <div className="border border-dashed border-ink/15 rounded-lg p-8 text-center">
                    <p className="font-medium">No orders yet</p>
                    <p className="text-sm text-mute mt-2 mb-4">Your placed orders will show up here.</p>
                    <Link to="/collection" className="inline-block bg-ink text-white px-5 py-2.5 text-xs uppercase tracking-wider rounded hover:bg-brand transition">
                      Start Shopping
                    </Link>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="text-left text-xs uppercase tracking-wider text-mute border-b border-ink/10">
                          <th className="py-3 pr-4">Order</th>
                          <th className="py-3 pr-4">Date</th>
                          <th className="py-3 pr-4">Total</th>
                          <th className="py-3 pr-4">Status</th>
                          <th className="py-3 text-right">Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {orders.map((order) => (
                          <tr key={order.id} className="border-b border-ink/5">
                            <td className="py-3 pr-4 font-medium">{order.order_number}</td>
                            <td className="py-3 pr-4 text-mute">{formatDate(order.created_at)}</td>
                            <td className="py-3 pr-4">{formatPrice(Number(order.total))}</td>
                            <td className="py-3 pr-4">
                              <span className={`${statusTone[order.status] || "bg-cream text-ink"} px-2.5 py-1 rounded-full text-xs capitalize`}>
                                {order.status}
                              </span>
                            </td>
                            <td className="py-3 text-right">
                              <Link to={`/orders/${order.id}`} className="text-brand hover:underline">
                                View
                              </Link>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>

              <div className="bg-white border border-ink/10 rounded-lg p-6 space-y-6">
                <div id="profile">
                  <h2 className="font-display text-xl mb-4">Profile</h2>
                  <div className="space-y-2 text-sm">
                    <p><span className="text-mute">Name:</span> {displayName}</p>
                    <p><span className="text-mute">Email:</span> {profile?.email || "Loading..."}</p>
                    <p><span className="text-mute">Phone:</span> {profile?.phone || "Not added yet"}</p>
                  </div>
                </div>

                <div id="addresses">
                  <h2 className="font-display text-xl mb-4">Default Address</h2>
                  <p className="text-sm text-mute leading-relaxed">
                    {profile?.address_line1 || "No saved address yet."}
                    {profile?.address_line2 ? <><br />{profile.address_line2}</> : null}
                    {profile?.city || profile?.state || profile?.postal_code ? (
                      <>
                        <br />
                        {[profile.city, profile.state, profile.postal_code].filter(Boolean).join(", ")}
                      </>
                    ) : null}
                    {profile?.country ? <><br />{profile.country}</> : null}
                  </p>
                </div>

                <div>
                  <h2 className="font-display text-xl mb-4">Need help?</h2>
                  <p className="text-sm text-mute mb-4">For order updates, returns, or account support, our team is here to help.</p>
                  <Link to="/contact" className="inline-block border border-ink px-5 py-2.5 text-xs uppercase tracking-wider rounded hover:bg-ink hover:text-white transition">
                    Contact Support
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </PageLayout>
  );
};

export default Account;
