import { Link, useParams } from "react-router";
import { useQuery } from "@tanstack/react-query";
import { orderService, TransactionStatus } from "../../services/orderService";

const statusStyles: Record<TransactionStatus, string> = {
  success:  "bg-success-50 text-success-600 dark:bg-success-500/15 dark:text-success-500",
  pending:  "bg-warning-50 text-warning-600 dark:bg-warning-500/15 dark:text-warning-500",
  failed:   "bg-red-50 text-red-600 dark:bg-red-500/15 dark:text-red-500",
  refunded: "bg-gray-100 text-gray-600 dark:bg-gray-500/15 dark:text-gray-400",
};

function fmt(n?: number | null) {
  return `₹${Number(n ?? 0).toLocaleString("en-IN")}`;
}

export default function SingleTransaction() {
  const { id } = useParams<{ id: string }>();

  const { data: txn, isLoading, isError } = useQuery({
    queryKey: ["admin-transaction", id],
    queryFn: () => orderService.getTransaction(id!),
    enabled: !!id,
  });

  const order = txn?.order;
  const user = order?.user;
  const items = order?.items ?? [];

  if (isLoading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <p className="text-sm text-gray-500 dark:text-gray-400">Loading transaction…</p>
      </div>
    );
  }

  if (isError || !txn) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <p className="text-sm text-red-500">Failed to load transaction.</p>
      </div>
    );
  }

  return (
    <div className="p-4 pb-20 mx-auto max-w-(--breakpoint-2xl) md:p-6 md:pb-24">
      {/* Page Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
        <h2 className="text-xl font-semibold text-gray-800 dark:text-white/90">Transaction Detail</h2>
        <nav>
          <ol className="flex items-center gap-1.5">
            <li>
              <Link className="inline-flex items-center gap-1.5 text-sm text-gray-500 dark:text-gray-400" to="/">
                Home
                <svg className="stroke-current" width="17" height="16" viewBox="0 0 17 16" fill="none">
                  <path d="M6.0765 12.667L10.2432 8.50033L6.0765 4.33366" stroke="" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </Link>
            </li>
            <li>
              <Link className="inline-flex items-center gap-1.5 text-sm text-gray-500 dark:text-gray-400" to="/transactions">
                Transactions
                <svg className="stroke-current" width="17" height="16" viewBox="0 0 17 16" fill="none">
                  <path d="M6.0765 12.667L10.2432 8.50033L6.0765 4.33366" stroke="" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </Link>
            </li>
            <li className="text-sm text-gray-800 dark:text-white/90">#{txn.id}</li>
          </ol>
        </nav>
      </div>

      <div className="space-y-6">
        {/* Order Banner */}
        <div className="flex flex-col justify-between gap-6 rounded-2xl border border-gray-200 bg-white px-6 py-5 sm:flex-row sm:items-center dark:border-gray-800 dark:bg-white/[0.03]">
          <div className="flex flex-col gap-2.5 divide-gray-300 sm:flex-row sm:divide-x dark:divide-gray-700">
            <div className="flex items-center gap-2 sm:pr-3">
              <span className="text-base font-medium text-gray-700 dark:text-gray-400">
                Order: {order?.order_number ?? `#${txn.order_id}`}
              </span>
              <span className={`inline-flex items-center justify-center gap-1 rounded-full px-2.5 py-0.5 text-sm font-medium capitalize ${statusStyles[txn.status]}`}>
                {txn.status}
              </span>
            </div>
            <div className="text-sm text-gray-500 sm:pl-3 dark:text-gray-400">
              <span>Gateway: </span>
              <span className="font-medium text-gray-700 dark:text-gray-300 capitalize">{txn.gateway}</span>
            </div>
            {txn.paid_at && (
              <p className="text-sm text-gray-500 sm:pl-3 dark:text-gray-400">
                Paid: {new Date(txn.paid_at).toLocaleString("en-IN")}
              </p>
            )}
          </div>
          <div className="flex flex-col gap-1 text-right">
            <span className="text-xs text-gray-500 dark:text-gray-400">Txn ID</span>
            <span className="text-sm font-mono font-medium text-gray-700 dark:text-gray-300">{txn.transaction_id}</span>
          </div>
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
          {/* Left — Order Items */}
          <div className="lg:col-span-8 2xl:col-span-9">
            <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-white/[0.03]">
              <h2 className="mb-5 text-lg font-semibold text-gray-800 dark:text-white/90">Order Items</h2>
              <div className="overflow-hidden rounded-2xl border border-gray-100 dark:border-gray-800">
                <div className="custom-scrollbar overflow-x-auto">
                  <table className="min-w-full text-left text-sm text-gray-700 dark:border-gray-800">
                    <thead className="bg-gray-50 dark:bg-gray-900">
                      <tr className="border-b border-gray-100 whitespace-nowrap dark:border-gray-800">
                        <th className="px-5 py-4 text-sm font-medium text-gray-700 dark:text-gray-400">SKU</th>
                        <th className="px-5 py-4 text-sm font-medium text-gray-700 dark:text-gray-400">Qty</th>
                        <th className="px-5 py-4 text-sm font-medium text-gray-700 dark:text-gray-400">Unit Price</th>
                        <th className="px-5 py-4 text-sm font-medium text-gray-700 dark:text-gray-400">Total</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 bg-white dark:divide-gray-800 dark:bg-white/[0.03]">
                      {items.length === 0 && (
                        <tr>
                          <td colSpan={6} className="px-5 py-6 text-center text-sm text-gray-500 dark:text-gray-400">No items found.</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Order Summary */}
              <div className="flex flex-wrap justify-between sm:justify-end">
                <div className="mt-6 w-full space-y-1 text-right sm:w-[240px]">
                  <p className="mb-4 text-left text-sm font-medium text-gray-800 dark:text-white/90">Order Summary</p>
                  <ul className="space-y-2">
                    <li className="flex justify-between gap-5">
                      <span className="text-sm text-gray-500 dark:text-gray-400">Subtotal</span>
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-400">{fmt(order?.subtotal)}</span>
                    </li>
                    <li className="flex items-center justify-between">
                      <span className="text-sm text-gray-500 dark:text-gray-400">Shipping</span>
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-400">{fmt(order?.shipping_charge)}</span>
                    </li>
                    {(order?.discount ?? 0) > 0 && (
                      <li className="flex items-center justify-between">
                        <span className="text-sm text-gray-500 dark:text-gray-400">Discount</span>
                        <span className="text-sm font-medium text-green-600">-{fmt(order?.discount)}</span>
                      </li>
                    )}
                    <li className="flex items-center justify-between border-t border-gray-100 pt-2 dark:border-gray-800">
                      <span className="font-medium text-gray-700 dark:text-gray-400">Total</span>
                      <span className="text-lg font-semibold text-gray-800 dark:text-white/90">{fmt(order?.total)}</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Right — Customer + Shipping */}
          <div className="space-y-6 lg:col-span-4 2xl:col-span-3">
            {/* Customer Details */}
            <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-white/[0.03]">
              <h2 className="mb-5 text-lg font-semibold text-gray-800 dark:text-white/90">Customer</h2>
              <ul className="divide-y divide-gray-100 dark:divide-gray-800">
                {[
                  { label: "Name",    value: user ? `${user.first_name} ${user.last_name}` : order?.shipping_name ?? '—' },
                  { label: "Email",   value: user?.email ?? '—' },
                  { label: "Phone",   value: user?.phone ?? order?.shipping_phone ?? '—' },
                ].map(({ label, value }) => (
                  <li key={label} className="flex items-start gap-5 py-2.5">
                    <span className="w-1/3 text-sm text-gray-500 dark:text-gray-400">{label}</span>
                    <span className="w-2/3 text-sm text-gray-700 dark:text-gray-400">{value}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Shipping Address */}
            <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-white/[0.03]">
              <h2 className="mb-5 text-lg font-semibold text-gray-800 dark:text-white/90">Shipping Address</h2>
              <ul className="divide-y divide-gray-100 dark:divide-gray-800">
                {[
                  { label: "Name",    value: order?.shipping_name ?? '—' },
                  { label: "Phone",   value: order?.shipping_phone ?? '—' },
                  { label: "Address", value: order?.shipping_address ?? '—' },
                  { label: "City",    value: order?.shipping_city ?? '—' },
                  { label: "State",   value: order?.shipping_state ?? '—' },
                  { label: "Postal",  value: order?.shipping_postal ?? '—' },
                  { label: "Country", value: order?.shipping_country ?? '—' },
                ].map(({ label, value }) => (
                  <li key={label} className="flex items-start gap-5 py-2.5">
                    <span className="w-1/3 text-sm text-gray-500 dark:text-gray-400">{label}</span>
                    <span className="w-2/3 text-sm text-gray-700 dark:text-gray-400">{value}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

