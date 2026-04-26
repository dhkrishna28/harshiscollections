interface Props {
  value: number;
  onChange: (v: number) => void;
}

const QuantityInput = ({ value, onChange }: Props) => (
  <div className="flex border border-ink/20 rounded">
    <button
      type="button"
      onClick={() => onChange(Math.max(1, value - 1))}
      className="w-10 h-12 hover:bg-cream"
      aria-label="Decrease quantity"
    >
      −
    </button>
    <input
      value={value}
      onChange={(e) => {
        const n = parseInt(e.target.value || "1", 10);
        onChange(isNaN(n) ? 1 : Math.max(1, n));
      }}
      className="w-12 h-12 text-center outline-none bg-transparent"
    />
    <button
      type="button"
      onClick={() => onChange(value + 1)}
      className="w-10 h-12 hover:bg-cream"
      aria-label="Increase quantity"
    >
      +
    </button>
  </div>
);

export default QuantityInput;
