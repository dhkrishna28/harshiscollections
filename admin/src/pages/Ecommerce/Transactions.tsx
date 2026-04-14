import { useState, useMemo, useRef, useEffect } from "react";
import { Link } from "react-router";
import { useQuery } from "@tanstack/react-query";
import { orderService, AdminTransaction, TransactionStatus } from "../../services/orderService";

const PAGE_SIZE = 10;

const statusStyles: Record<TransactionStatus, string> = {
  success:  "bg-success-50 text-success-700 dark:bg-success-500/15 dark:text-success-500",
  pending:  "bg-warning-50 text-warning-700 dark:bg-warning-500/15 dark:text-warning-500",
  failed:   "bg-red-50 text-red-700 dark:bg-red-500/15 dark:text-red-500",
  refunded: "bg-gray-100 text-gray-700 dark:bg-gray-500/15 dark:text-gray-400",
};

const SortIcon = () => (
  <span className="flex flex-col gap-0.5">
    <svg className="text-gray-800 dark:text-gray-400" width="8" height="5" viewBox="0 0 8 5" fill="none">
      <path d="M4.41 0.585C4.21 0.301 3.79 0.301 3.59 0.585L1.05 4.213C0.819 4.545 1.056 5 1.46 5H6.54C6.944 5 7.181 4.545 6.949 4.213L4.41 0.585Z" fill="currentColor" />
    </svg>
    <svg className="text-gray-300" width="8" height="5" viewBox="0 0 8 5" fill="none">
      <path d="M4.41 4.415C4.21 4.699 3.79 4.699 3.59 4.415L1.05 0.787C0.819 0.455 1.056 0 1.46 0H6.54C6.944 0 7.181 0.455 6.949 0.787L4.41 4.415Z" fill="currentColor" />
    </svg>
  </span>
);

function ActionMenu({ id }: { id: string }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div ref={ref} className="relative inline-block">
      <button
        className="text-gray-500 dark:text-gray-400"
        onClick={() => setOpen((v) => !v)}
        aria-label={`Actions for ${id}`}
      >
        <svg className="fill-current" width="24" height="24" viewBox="0 0 24 24" fill="none">
          <path fillRule="evenodd" clipRule="evenodd" d="M5.999 10.245C6.966 10.245 7.749 11.029 7.749 11.995V12.005C7.749 12.972 6.966 13.755 5.999 13.755C5.033 13.755 4.249 12.972 4.249 12.005V11.995C4.249 11.029 5.033 10.245 5.999 10.245ZM17.999 10.245C18.966 10.245 19.749 11.029 19.749 11.995V12.005C19.749 12.972 18.966 13.755 17.999 13.755C17.033 13.755 16.249 12.972 16.249 12.005V11.995C16.249 11.029 17.033 10.245 17.999 10.245ZM13.749 11.995C13.749 11.029 12.966 10.245 11.999 10.245C11.033 10.245 10.249 11.029 10.249 11.995V12.005C10.249 12.972 11.033 13.755 11.999 13.755C12.966 13.755 13.749 12.972 13.749 12.005V11.995Z" fill="" />
        </svg>
      </button>
      {open && (
        <div className="absolute right-0 top-full z-50 mt-1 w-40 rounded-2xl border border-gray-200 bg-white p-2 shadow-lg dark:border-gray-800 dark:bg-gray-900">
          <div className="space-y-1">
            <Link to={`/transactions/${id}`} className="flex w-full rounded-lg px-3 py-2 text-left text-xs font-medium text-gray-500 hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-gray-300">
              View More
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}

type SortKey = "customer" | "email" | "amount";
type SortDir = "asc" | "desc";

export default function Transactions() {
  const [search, setSearch] = useState("");
  const [dateRange, setDateRange] = useState("Last 30 Days");
  const [sortKey, setSortKey] = useState<SortKey>("customer");
  const [sortDir, setSortDir] = useState<SortDir>("asc");
  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState<Set<number>>(new Set());

  const { data, isLoading, isError } = useQuery({
    queryKey: ["admin-transactions", page],
    queryFn: () => orderService.listTransactions({ page, limit: PAGE_SIZE }),
  });

  const transactions: AdminTransaction[] = data?.transactions ?? [];
  const totalPages = data?.pagination.totalPages ?? 1;
  const total = data?.pagination.total ?? 0;
  const from = total === 0 ? 0 : (page - 1) * PAGE_SIZE + 1;
  const to = Math.min(page * PAGE_SIZE, total);

  const filtered = useMemo(() => {
    if (!search) return transactions;
    const q = search.toLowerCase();
    return transactions.filter(
      (t) =>
        String(t.id).includes(q) ||
        (`${t.order?.user?.first_name ?? ''} ${t.order?.user?.last_name ?? ''}`).toLowerCase().includes(q) ||
        (t.order?.user?.email ?? "").toLowerCase().includes(q) ||
        (t.transaction_id ?? '').toLowerCase().includes(q)
    );
  }, [transactions, search]);

  const sorted = useMemo(() => {
    return [...filtered].sort((a: AdminTransaction, b: AdminTransaction) => {
      if (sortKey === "amount") {
        const diff = Number(a.amount) - Number(b.amount);
        return sortDir === "asc" ? diff : -diff;
      }
      const av = sortKey === "email" ? (a.order?.user?.email ?? "") : (`${a.order?.user?.first_name ?? ''} ${a.order?.user?.last_name ?? ''}`).trim();
      const bv = sortKey === "email" ? (b.order?.user?.email ?? "") : (`${b.order?.user?.first_name ?? ''} ${b.order?.user?.last_name ?? ''}`).trim();
      return sortDir === "asc" ? av.localeCompare(bv) : bv.localeCompare(av);
    });
  }, [filtered, sortKey, sortDir]);

  const handleSort = (key: SortKey) => {
    if (sortKey === key) setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    else { setSortKey(key); setSortDir("asc"); }
  };

  const allOnPageSelected = sorted.length > 0 && sorted.every((t) => selected.has(t.id));

  const toggleAll = () => {
    if (allOnPageSelected) {
      setSelected((prev) => { const n = new Set(prev); sorted.forEach((t) => n.delete(t.id)); return n; });
    } else {
      setSelected((prev) => { const n = new Set(prev); sorted.forEach((t) => n.add(t.id)); return n; });
    }
  };

  const toggleRow = (id: number) => {
    setSelected((prev) => { const n = new Set(prev); n.has(id) ? n.delete(id) : n.add(id); return n; });
  };

  const exportCsv = () => {
    const rows = [
      ["ID", "Customer", "Email", "Amount", "Date", "Status"],
      ...sorted.map((t) => [
        t.id,
        `${t.order?.user?.first_name ?? ''} ${t.order?.user?.last_name ?? ''}`.trim() || '—',
        t.order?.user?.email ?? "—",
        t.amount,
        new Date(t.created_at).toLocaleDateString("en-IN"),
        t.status,
      ]),
    ];
    const csv = rows.map((r) => r.map((c) => `"${c}"`).join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a"); a.href = url; a.download = "transactions.csv"; a.click();
    URL.revokeObjectURL(url);
  };

  const Checkbox = ({ checked, onChange }: { checked: boolean; onChange: () => void }) => (
    <label className="flex cursor-pointer items-center text-sm font-medium text-gray-700 select-none dark:text-gray-400">
      <span className="relative">
        <input className="sr-only" type="checkbox" checked={checked} onChange={onChange} />
        <span className={`flex h-4 w-4 items-center justify-center rounded-sm border-[1.25px] ${checked ? "border-brand-500 bg-brand-500" : "border-gray-300 bg-transparent dark:border-gray-700"}`}>
          <span className={checked ? "opacity-100" : "opacity-0"}>
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
              <path d="M10 3L4.5 8.5L2 6" stroke="white" strokeWidth="1.6666" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </span>
        </span>
      </span>
    </label>
  );

  return (
    <div className="p-4 pb-20 mx-auto max-w-(--breakpoint-2xl) md:p-6 md:pb-24">
      {/* Page Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
        <h2 className="text-xl font-semibold text-gray-800 dark:text-white/90">Transactions</h2>
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
            <li className="text-sm text-gray-800 dark:text-white/90">Transactions</li>
          </ol>
        </nav>
      </div>

      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03]">
        {/* Table Header */}
        <div className="flex items-center justify-between border-b border-gray-200 px-5 py-4 dark:border-gray-800">
          <div>
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">Transactions</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">Your most recent transactions list</p>
          </div>
          <div className="flex gap-3.5">
            <div className="hidden flex-col gap-3 sm:flex sm:flex-row sm:items-center">
              {/* Search */}
              <div className="relative">
                <span className="absolute top-1/2 left-4 -translate-y-1/2 text-gray-500 dark:text-gray-400">
                  <svg className="fill-current" width="20" height="20" viewBox="0 0 20 20" fill="none">
                    <path fillRule="evenodd" clipRule="evenodd" d="M3.042 9.374C3.042 5.877 5.877 3.042 9.375 3.042C12.873 3.042 15.709 5.877 15.709 9.374C15.709 12.87 12.873 15.705 9.375 15.705C5.877 15.705 3.042 12.87 3.042 9.374ZM9.375 1.542C5.049 1.542 1.542 5.048 1.542 9.374C1.542 13.699 5.049 17.205 9.375 17.205C11.268 17.205 13.003 16.534 14.357 15.418L17.177 18.238C17.47 18.531 17.945 18.531 18.238 18.238C18.531 17.945 18.531 17.47 18.238 17.177L15.418 14.357C16.537 13.003 17.209 11.267 17.209 9.374C17.209 5.048 13.701 1.542 9.375 1.542Z" fill="" />
                  </svg>
                </span>
                <input
                  placeholder="Search..."
                  value={search}
                  onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                  className="shadow-theme-xs focus:border-brand-300 focus:ring-brand-500/10 dark:focus:border-brand-800 h-11 w-full rounded-lg border border-gray-300 bg-transparent py-2.5 pr-4 pl-11 text-sm text-gray-800 placeholder:text-gray-400 focus:ring-3 focus:outline-hidden xl:w-[300px] dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30"
                  type="text"
                />
              </div>

              {/* Date filter */}
              <div className="hidden lg:block relative">
                <select
                  value={dateRange}
                  onChange={(e) => setDateRange(e.target.value)}
                  className="shadow-theme-xs appearance-none focus:border-brand-300 focus:ring-brand-500/10 dark:focus:border-brand-800 h-11 w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 pr-11 text-sm text-gray-800 focus:ring-3 focus:outline-hidden dark:border-gray-700 dark:bg-gray-900 dark:text-white/90"
                >
                  <option>Last 7 Days</option>
                  <option>Last 10 Days</option>
                  <option>Last 15 Days</option>
                  <option>Last 30 Days</option>
                </select>
                <svg className="absolute text-gray-700 dark:text-gray-400 right-3 top-1/2 -translate-y-1/2 pointer-events-none" width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <path d="M4.79175 8.02075L10.0001 13.2291L15.2084 8.02075" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>

              {/* Export */}
              <button
                onClick={exportCsv}
                className="shadow-theme-xs flex h-11 items-center justify-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-3 text-gray-700 hover:bg-gray-100 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-white"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <path d="M16.666 13.333V15.417C16.666 16.107 16.106 16.667 15.416 16.667H4.582C3.892 16.667 3.332 16.107 3.332 15.417V13.333M10 3.333V13.333M6.145 7.187L9.999 3.335L13.853 7.187" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                Export CSV
              </button>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="custom-scrollbar overflow-x-auto">
          <table className="w-full table-auto">
            <thead>
              <tr className="border-b border-gray-200 dark:border-gray-800">
                <th className="p-4">
                  <div className="flex w-full items-center gap-3">
                    <Checkbox checked={allOnPageSelected} onChange={toggleAll} />
                    <p className="text-xs font-medium text-gray-500 dark:text-gray-400">Order ID</p>
                  </div>
                </th>
                <th className="p-4 text-left">
                  <button className="flex cursor-pointer items-center gap-3" onClick={() => handleSort("customer")}>
                    <p className="text-xs font-medium text-gray-500 dark:text-gray-400">Customer</p>
                    <SortIcon />
                  </button>
                </th>
                <th className="p-4 text-left">
                  <button className="flex cursor-pointer items-center gap-3" onClick={() => handleSort("email")}>
                    <p className="text-xs font-medium text-gray-500 dark:text-gray-400">Email</p>
                    <SortIcon />
                  </button>
                </th>
                <th className="p-4 text-left">
                  <button className="flex cursor-pointer items-center gap-3" onClick={() => handleSort("amount")}>
                    <p className="text-xs font-medium text-gray-500 dark:text-gray-400">Total Amount</p>
                    <SortIcon />
                  </button>
                </th>
                <th className="p-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400">Due Date</th>
                <th className="p-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400">Status</th>
                <th className="p-4 text-left"><span className="sr-only">Action</span></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
              {isLoading ? (
                <tr>
                  <td colSpan={7} className="py-10 text-center text-sm text-gray-500 dark:text-gray-400">
                    Loading transactions...
                  </td>
                </tr>
              ) : isError ? (
                <tr>
                  <td colSpan={7} className="py-10 text-center text-sm text-red-500">
                    Failed to load transactions.
                  </td>
                </tr>
              ) : sorted.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-10 text-center text-sm text-gray-500 dark:text-gray-400">
                    No transactions found.
                  </td>
                </tr>
              ) : (
                sorted.map((t) => (
                <tr key={t.id} className="transition hover:bg-gray-50 dark:hover:bg-gray-900">
                  <td className="p-4 whitespace-nowrap">
                    <div className="group flex items-center gap-3">
                      <Checkbox checked={selected.has(t.id)} onChange={() => toggleRow(t.id)} />
                      <Link to={`/transactions/${t.id}`} className="text-xs font-medium text-gray-700 group-hover:underline dark:text-gray-400">#{t.id}</Link>
                    </div>
                  </td>
                  <td className="p-4 whitespace-nowrap">
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-400">
                      {`${t.order?.user?.first_name ?? ''} ${t.order?.user?.last_name ?? ''}`.trim() || '—'}
                    </span>
                  </td>
                  <td className="p-4 whitespace-nowrap">
                    <p className="text-sm text-gray-500 dark:text-gray-400">{t.order?.user?.email ?? "—"}</p>
                  </td>
                  <td className="p-4 whitespace-nowrap">
                    <p className="text-sm text-gray-700 dark:text-gray-400">₹{Number(t.amount).toLocaleString("en-IN")}</p>
                  </td>
                  <td className="p-4 whitespace-nowrap">
                    <p className="text-sm text-gray-700 dark:text-gray-400">
                      {new Date(t.created_at).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })}
                    </p>
                  </td>
                  <td className="p-4 whitespace-nowrap">
                    <span className={`text-xs rounded-full px-2 py-0.5 font-medium capitalize ${statusStyles[t.status]}`}>
                      {t.status}
                    </span>
                  </td>
                  <td className="p-4 whitespace-nowrap">
                    <ActionMenu id={String(t.id)} />
                  </td>
                </tr>
              ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="border-t border-gray-200 px-5 py-4 dark:border-gray-800">
          <div className="flex items-center justify-between">
            <span className="hidden text-sm font-medium text-gray-500 dark:text-gray-400 sm:block">
              Showing <span className="text-gray-800 dark:text-white/90">{from}</span> to{" "}
              <span className="text-gray-800 dark:text-white/90">{to}</span> of{" "}
              <span className="text-gray-800 dark:text-white/90">{total}</span>
            </span>
            <div className="flex w-full items-center justify-between gap-2 rounded-lg bg-gray-50 p-4 sm:w-auto sm:justify-normal sm:rounded-none sm:bg-transparent sm:p-0 dark:bg-gray-900 dark:sm:bg-transparent">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="shadow-theme-xs flex items-center gap-2 rounded-lg border border-gray-300 bg-white p-2 text-gray-700 hover:bg-gray-50 sm:p-2.5 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <svg className="fill-current" width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <path fillRule="evenodd" clipRule="evenodd" d="M2.582 9.999C2.582 10.191 2.655 10.383 2.802 10.53L7.798 15.53C8.091 15.823 8.566 15.823 8.859 15.531C9.152 15.238 9.152 14.763 8.859 14.47L5.139 10.747H16.667C17.081 10.747 17.417 10.411 17.417 9.997C17.417 9.583 17.081 9.247 16.667 9.247H5.145L8.859 5.53C9.152 5.237 9.152 4.762 8.859 4.47C8.566 4.177 8.091 4.177 7.798 4.47L2.841 9.43C2.682 9.568 2.582 9.771 2.582 9.997V9.999Z" fill="" />
                </svg>
              </button>

              <span className="block text-sm font-medium text-gray-700 sm:hidden dark:text-gray-400">
                Page {page} of {totalPages}
              </span>

              <ul className="hidden items-center gap-0.5 sm:flex">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                  <li key={p}>
                    <button
                      onClick={() => setPage(p)}
                      className={`flex h-10 w-10 items-center justify-center rounded-lg text-sm font-medium ${
                        p === page
                          ? "bg-brand-500 text-white"
                          : "text-gray-700 hover:bg-brand-500 hover:text-white dark:text-gray-400 dark:hover:text-white"
                      }`}
                    >
                      {p}
                    </button>
                  </li>
                ))}
              </ul>

              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="shadow-theme-xs flex items-center gap-2 rounded-lg border border-gray-300 bg-white p-2 text-gray-700 hover:bg-gray-50 sm:p-2.5 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <svg className="fill-current" width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <path fillRule="evenodd" clipRule="evenodd" d="M17.417 9.999C17.417 10.191 17.344 10.383 17.197 10.53L12.2 15.53C11.908 15.823 11.433 15.823 11.14 15.531C10.847 15.238 10.847 14.763 11.139 14.47L14.859 10.747H3.332C2.918 10.747 2.582 10.411 2.582 9.997C2.582 9.583 2.918 9.247 3.332 9.247H14.854L11.139 5.53C10.847 5.237 10.847 4.762 11.14 4.47C11.433 4.177 11.907 4.177 12.2 4.47L17.158 9.43C17.316 9.568 17.417 9.771 17.417 9.997V9.999Z" fill="" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
