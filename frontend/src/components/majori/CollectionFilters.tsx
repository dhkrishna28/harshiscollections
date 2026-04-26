import { useMemo } from "react";

export interface FilterState {
  categories: string[];
  colors: string[];
  sizes: string[];
  brands: string[];
  maxPrice: number;
}

export const PRICE_MIN = 0;
export const PRICE_MAX = 300;

export const DEFAULT_FILTERS: FilterState = {
  categories: [],
  colors: [],
  sizes: [],
  brands: [],
  maxPrice: PRICE_MAX,
};

export const FILTER_OPTIONS = {
  categories: ["Dresses", "Skirts", "Tops", "Outerwear", "Accessories"],
  colors: [
    { name: "Black", className: "bg-ink" },
    { name: "Rose", className: "bg-rose" },
    { name: "Brand", className: "bg-brand" },
    { name: "Sand", className: "bg-sand border border-ink/20" },
    { name: "White", className: "bg-white border border-ink/20" },
    { name: "Blue", className: "bg-blue-700" },
  ] as const,
  sizes: ["XS", "S", "M", "L", "XL"],
  brands: ["Majori Atelier", "Studio Linen", "Coastal Knit"],
} as const;

interface Props {
  value: FilterState;
  onChange: (next: FilterState) => void;
  isMobileDrawer?: boolean;
  onClose?: () => void;
  onClear?: () => void;
}

const toggle = <T,>(arr: T[], item: T): T[] =>
  arr.includes(item) ? arr.filter((x) => x !== item) : [...arr, item];

const CollectionFilters = ({
  value,
  onChange,
  isMobileDrawer,
  onClose,
  onClear,
}: Props) => {
  const categoryCounts = useMemo(
    () => Object.fromEntries(FILTER_OPTIONS.categories.map((c) => [c, 0])),
    [],
  );

  const update = (patch: Partial<FilterState>) => onChange({ ...value, ...patch });

  return (
    <div className="space-y-8">
      {isMobileDrawer && (
        <div className="flex items-center justify-between pb-4 border-b border-ink/10 -mt-2">
          <h3 className="font-display text-xl">Filters</h3>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close filters"
            className="p-2 -mr-2 hover:text-brand"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
        </div>
      )}

      <fieldset>
        <legend className="font-semibold mb-4 uppercase text-sm tracking-wider">Categories</legend>
        <ul className="space-y-2 text-sm">
          {FILTER_OPTIONS.categories.map((c) => {
            const checked = value.categories.includes(c);
            return (
              <li key={c}>
                <label className="flex items-center justify-between gap-2 cursor-pointer hover:text-brand">
                  <span className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      className="rounded accent-ink"
                      checked={checked}
                      onChange={() => update({ categories: toggle(value.categories, c) })}
                    />
                    {c}
                  </span>
                  <span className="text-mute text-xs">{categoryCounts[c]}</span>
                </label>
              </li>
            );
          })}
        </ul>
      </fieldset>

      <fieldset>
        <legend className="font-semibold mb-4 uppercase text-sm tracking-wider">Filter by Price</legend>
        <input
          type="range"
          min={PRICE_MIN}
          max={PRICE_MAX}
          value={value.maxPrice}
          onChange={(e) => update({ maxPrice: Number(e.target.value) })}
          className="w-full accent-ink"
          aria-label="Maximum price"
        />
        <div className="flex justify-between text-sm text-mute mt-2">
          <span>${PRICE_MIN}</span>
          <span>Up to ${value.maxPrice}</span>
        </div>
      </fieldset>

      <fieldset>
        <legend className="font-semibold mb-4 uppercase text-sm tracking-wider">Color</legend>
        <div className="flex flex-wrap gap-2">
          {FILTER_OPTIONS.colors.map((c) => {
            const active = value.colors.includes(c.name);
            return (
              <button
                key={c.name}
                type="button"
                aria-label={c.name}
                aria-pressed={active}
                onClick={() => update({ colors: toggle(value.colors, c.name) })}
                className={`w-7 h-7 rounded-full ${c.className} ${
                  active ? "ring-2 ring-offset-2 ring-ink" : ""
                }`}
              />
            );
          })}
        </div>
      </fieldset>

      <fieldset>
        <legend className="font-semibold mb-4 uppercase text-sm tracking-wider">Size</legend>
        <div className="flex flex-wrap gap-2">
          {FILTER_OPTIONS.sizes.map((s) => {
            const active = value.sizes.includes(s);
            return (
              <button
                key={s}
                type="button"
                aria-pressed={active}
                onClick={() => update({ sizes: toggle(value.sizes, s) })}
                className={`w-10 h-10 border text-sm transition ${
                  active
                    ? "bg-ink text-white border-ink"
                    : "border-ink/20 hover:border-ink"
                }`}
              >
                {s}
              </button>
            );
          })}
        </div>
      </fieldset>

      <fieldset>
        <legend className="font-semibold mb-4 uppercase text-sm tracking-wider">Brand</legend>
        <ul className="space-y-2 text-sm">
          {FILTER_OPTIONS.brands.map((b) => {
            const checked = value.brands.includes(b);
            return (
              <li key={b}>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    className="rounded accent-ink"
                    checked={checked}
                    onChange={() => update({ brands: toggle(value.brands, b) })}
                  />
                  {b}
                </label>
              </li>
            );
          })}
        </ul>
      </fieldset>

      {(isMobileDrawer || onClear) && (
        <div className="flex gap-3 pt-4 border-t border-ink/10">
          <button
            type="button"
            onClick={onClear}
            className="flex-1 border border-ink/20 py-3 text-sm uppercase tracking-wider rounded hover:bg-ink hover:text-white transition"
          >
            Clear
          </button>
          {isMobileDrawer && (
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-ink text-white py-3 text-sm uppercase tracking-wider rounded hover:bg-brand transition"
            >
              Apply
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default CollectionFilters;
