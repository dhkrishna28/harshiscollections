export default function EcommerceStats() {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:gap-6 xl:grid-cols-4">
      {/* Unique Visitors */}
      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03]">
        <p className="text-gray-500 text-theme-sm dark:text-gray-400">
          Unique Visitors
        </p>
        <div className="flex items-end justify-between mt-3">
          <div>
            <h4 className="text-2xl font-bold text-gray-800 dark:text-white/90">
              24.7K
            </h4>
          </div>
          <div className="flex items-center gap-1">
            <span className="inline-flex items-center px-2.5 py-0.5 justify-center gap-1 rounded-full font-medium text-sm bg-success-50 text-success-600 dark:bg-success-500/15 dark:text-success-500">
              <span className="text-xs"> +20%</span>
            </span>
            <span className="text-gray-500 text-theme-xs dark:text-gray-400">
              Vs last month
            </span>
          </div>
        </div>
      </div>

      {/* Total Pageviews */}
      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03]">
        <p className="text-gray-500 text-theme-sm dark:text-gray-400">
          Total Pageviews
        </p>
        <div className="flex items-end justify-between mt-3">
          <div>
            <h4 className="text-2xl font-bold text-gray-800 dark:text-white/90">
              55.9K
            </h4>
          </div>
          <div className="flex items-center gap-1">
            <span className="inline-flex items-center px-2.5 py-0.5 justify-center gap-1 rounded-full font-medium text-sm bg-success-50 text-success-600 dark:bg-success-500/15 dark:text-success-500">
              <span className="text-xs"> +4%</span>
            </span>
            <span className="text-gray-500 text-theme-xs dark:text-gray-400">
              Vs last month
            </span>
          </div>
        </div>
      </div>

      {/* Bounce Rate */}
      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03]">
        <p className="text-gray-500 text-theme-sm dark:text-gray-400">
          Bounce Rate
        </p>
        <div className="flex items-end justify-between mt-3">
          <div>
            <h4 className="text-2xl font-bold text-gray-800 dark:text-white/90">
              54%
            </h4>
          </div>
          <div className="flex items-center gap-1">
            <span className="inline-flex items-center px-2.5 py-0.5 justify-center gap-1 rounded-full font-medium text-sm bg-error-50 text-error-600 dark:bg-error-500/15 dark:text-error-500">
              <span className="text-xs"> -1.59%</span>
            </span>
            <span className="text-gray-500 text-theme-xs dark:text-gray-400">
              Vs last month
            </span>
          </div>
        </div>
      </div>

      {/* Visit Duration */}
      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03]">
        <p className="text-gray-500 text-theme-sm dark:text-gray-400">
          Visit Duration
        </p>
        <div className="flex items-end justify-between mt-3">
          <div>
            <h4 className="text-2xl font-bold text-gray-800 dark:text-white/90">
              2m 56s
            </h4>
          </div>
          <div className="flex items-center gap-1">
            <span className="inline-flex items-center px-2.5 py-0.5 justify-center gap-1 rounded-full font-medium text-sm bg-success-50 text-success-600 dark:bg-success-500/15 dark:text-success-500">
              <span className="text-xs"> +7%</span>
            </span>
            <span className="text-gray-500 text-theme-xs dark:text-gray-400">
              Vs last month
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
