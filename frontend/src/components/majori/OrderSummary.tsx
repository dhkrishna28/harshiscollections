import { ReactNode, useState } from "react";
import { formatPrice } from "@/lib/cart";

interface Props {
  subtotal: number;
  shipping?: number | "Free";
  tax?: number | string;
  total: number;
  showDiscount?: boolean;
  cta?: ReactNode;
  footer?: ReactNode;
  title?: string;
}

const OrderSummary = ({
  subtotal,
  shipping = "Free",
  tax = "Calculated at checkout",
  total,
  showDiscount = true,
  cta,
  footer,
  title = "Order Summary",
}: Props) => {
  const [code, setCode] = useState("");

  return (
    <aside className="bg-white p-6 md:p-8 rounded-md h-max">
      {title && <h3 className="font-display text-2xl font-semibold mb-5">{title}</h3>}

      {showDiscount && (
        <div className="mb-5">
          <label className="text-sm font-medium mb-2 block">Discount Code</label>
          <div className="flex gap-2">
            <input
              type="text"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="Free15first"
              className="flex-1 px-3 py-2.5 border border-ink/15 rounded outline-none focus:border-ink text-sm"
            />
            <button className="bg-ink text-white px-4 text-sm rounded hover:bg-brand">Apply</button>
          </div>
        </div>
      )}

      <div className="space-y-3 text-sm border-t border-ink/10 pt-5">
        <div className="flex justify-between">
          <span className="text-mute">Subtotal</span>
          <span className="font-semibold">{formatPrice(subtotal)}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-mute">Shipping</span>
          <span className="font-semibold">{typeof shipping === "number" ? formatPrice(shipping) : shipping}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-mute">Tax</span>
          <span className="font-semibold">{typeof tax === "number" ? formatPrice(tax) : tax}</span>
        </div>
      </div>
      <div className="border-t border-ink/10 mt-5 pt-5 flex justify-between text-lg">
        <span className="font-semibold">Total</span>
        <span className="font-display font-semibold">{formatPrice(total)}</span>
      </div>

      {cta}
      {footer}
    </aside>
  );
};

export default OrderSummary;
