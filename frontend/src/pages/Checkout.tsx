import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import Newsletter from "@/components/majori/Newsletter";
import PageLayout from "@/components/majori/PageLayout";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import { useQuery } from "@tanstack/react-query";
import { accountService } from "@/services/accountService";
import { orderService, type PlaceOrderPayload } from "@/services/orderService";
import { formatPrice } from "@/lib/cart";

const inputCls =
  "w-full px-4 py-3 border border-ink/15 rounded outline-none focus:border-ink";

const Checkout = () => {
  const [shipping, setShipping] = useState<"standard" | "express">("standard");
  const [payment, setPayment] = useState<"cod" | "online">("cod");
  const { cart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const { data: profileData } = useQuery({
    queryKey: ["checkout-profile"],
    queryFn: () => accountService.getProfile(),
  });
  const profile = profileData?.data;
  const { register, handleSubmit } = useForm<PlaceOrderPayload>({
    defaultValues: {
      shipping_name: user ? `${user.first_name} ${user.last_name}` : "",
      shipping_phone: profile?.phone || "",
      shipping_address: profile?.address_line1 || "",
      shipping_city: profile?.city || "",
      shipping_state: profile?.state || "",
      shipping_postal: profile?.postal_code || "",
      shipping_country: "India",
      payment_method: "cod",
    },
  });

  const items = cart?.items ?? [];
  const subtotal = items.reduce((s, i) => s + Number(i.product.price) * i.quantity, 0);
  const shipFee = 0;
  const tax = 0;
  const total = subtotal + shipFee + tax;
  const API_ORIGIN =
    (import.meta.env.VITE_API_BASE_URL as string | undefined)?.replace("/api", "") || "";

  const onSubmit = async (data: PlaceOrderPayload) => {
    if (items.length === 0) {
      toast.error("Your cart is empty");
      return;
    }

    try {
      const res = await orderService.placeOrder({ ...data, payment_method: payment });
      toast.success("Order placed successfully");
      navigate(`/thank-you/${res.data.order_id}`);
    } catch (error: unknown) {
      const message =
        (error as { response?: { data?: { message?: string } } })?.response?.data?.message ||
        "Could not place order";
      toast.error(message);
    }
  };

  return (
    <PageLayout>
      <section className="py-10 md:py-14">
        <div className="max-w-7xl mx-auto px-4 grid lg:grid-cols-[1fr_420px] gap-10">
          {/* Form */}
          <div>
            <div className="mb-8">
              <p className="text-sm text-mute">
                Have an account?{" "}
                <Link to="/login" className="text-ink underline">
                  Log in
                </Link>
              </p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)}>
            <div className="bg-white p-6 md:p-8 rounded-md mb-6">
              <h3 className="font-display text-xl font-semibold mb-5">Contact</h3>
              <input type="email" placeholder="Email" defaultValue={user?.email || ""} readOnly className={`${inputCls} mb-3 bg-cream/40`} />
              <label className="flex items-center gap-2 text-sm text-mute">
                <input type="checkbox" className="rounded" /> Email me with news and offers
              </label>
            </div>

            <div className="bg-white p-6 md:p-8 rounded-md mb-6">
              <h3 className="font-display text-xl font-semibold mb-5">Delivery</h3>
              <select className={`${inputCls} mb-4`} {...register("shipping_country")}>
                <option>India</option>
              </select>
              <div className="grid grid-cols-2 gap-3 mb-3">
                <input placeholder="First name" defaultValue={user?.first_name || ""} className={`${inputCls} bg-cream/40`} readOnly />
                <input placeholder="Last name" defaultValue={user?.last_name || ""} className={`${inputCls} bg-cream/40`} readOnly />
              </div>
              <input placeholder="Full name" {...register("shipping_name")} className={`${inputCls} mb-3`} />
              <input placeholder="Address" {...register("shipping_address")} className={`${inputCls} mb-3`} />
              <input placeholder="Apartment, suite, etc. (optional)" defaultValue={profile?.address_line2 || ""} className={`${inputCls} mb-3 bg-cream/40`} readOnly />
              <div className="grid grid-cols-3 gap-3 mb-3">
                <input placeholder="City" {...register("shipping_city")} className={inputCls} />
                <input placeholder="State" {...register("shipping_state")} className={inputCls} />
                <input placeholder="ZIP" {...register("shipping_postal")} className={inputCls} />
              </div>
              <input placeholder="Phone" {...register("shipping_phone")} className={inputCls} />
            </div>

            <div className="bg-white p-6 md:p-8 rounded-md mb-6">
              <h3 className="font-display text-xl font-semibold mb-5">Shipping Method</h3>
              <div className="space-y-3">
                {[
                  { id: "standard", label: "Standard (5-7 business days)", price: "Free" },
                  { id: "express", label: "Express (1-2 business days)", price: "₹15.00" },
                ].map((opt) => (
                  <label
                    key={opt.id}
                    className={`flex items-center justify-between p-4 rounded cursor-pointer transition ${
                      shipping === opt.id ? "border-2 border-ink" : "border border-ink/15 hover:border-ink"
                    }`}
                  >
                    <span className="flex items-center gap-3">
                      <input
                        type="radio"
                        name="ship"
                        checked={shipping === opt.id}
                        onChange={() => setShipping(opt.id as "standard" | "express")}
                      />{" "}
                      {opt.label}
                    </span>
                    <span className="font-semibold">{opt.id === "express" ? "Shown at delivery" : opt.price}</span>
                  </label>
                ))}
              </div>
              <p className="text-xs text-mute mt-3">
                Shipping charges are currently calculated by the backend at order placement. The checkout total below matches the live API.
              </p>
            </div>

            <div className="bg-white p-6 md:p-8 rounded-md mb-6">
              <h3 className="font-display text-xl font-semibold mb-5">Payment</h3>
              <div className="space-y-3">
                <label
                  className={`flex items-center gap-3 p-4 rounded cursor-pointer ${
                    payment === "cod" ? "border-2 border-ink" : "border border-ink/15 hover:border-ink"
                  }`}
                >
                  <input type="radio" name="pay" checked={payment === "cod"} onChange={() => setPayment("cod")} />
                  <span className="flex-1">Cash on Delivery</span>
                  <span className="flex gap-1 text-xs">
                    <span className="px-2 py-1 bg-cream border border-ink/10 rounded">COD</span>
                  </span>
                </label>
                <label
                  className={`flex items-center gap-3 p-4 rounded cursor-pointer ${
                    payment === "online" ? "border-2 border-ink" : "border border-ink/15 hover:border-ink"
                  }`}
                >
                  <input
                    type="radio"
                    name="pay"
                    checked={payment === "online"}
                    onChange={() => setPayment("online")}
                  />{" "}
                  Online Payment
                </label>
              </div>
            </div>

            <button type="submit" disabled={items.length === 0} className="w-full bg-ink text-white py-4 uppercase tracking-wider hover:bg-brand transition rounded text-sm font-semibold disabled:opacity-60">
              Pay Now — {formatPrice(total)}
            </button>
            <Link to="/cart" className="block text-center text-sm text-mute mt-4 hover:text-ink">
              ← Return to cart
            </Link>
            </form>
          </div>

          {/* Summary */}
          <aside className="bg-white p-6 md:p-8 rounded-md h-max lg:sticky lg:top-24">
            <ul className="space-y-4 mb-6">
              {items.map((it) => (
                <li key={it.id} className="flex gap-3 items-center">
                  <div className="relative">
                    <img src={it.product.images?.[0]?.image_path ? `${API_ORIGIN}${it.product.images[0].image_path}` : "/placeholder.png"} alt={it.product.name} className="w-16 h-20 object-cover rounded" />
                    <span className="absolute -top-2 -right-2 bg-ink text-white text-xs w-5 h-5 grid place-items-center rounded-full">
                      {it.quantity}
                    </span>
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">{it.product.name}</p>
                    <p className="text-xs text-mute">{it.selected_size || "Default"}</p>
                  </div>
                  <p className="text-sm font-semibold">{formatPrice(Number(it.product.price) * it.quantity)}</p>
                </li>
              ))}
            </ul>

            <div className="flex gap-2 mb-5">
              <input
                placeholder="Discount code"
                className="flex-1 px-3 py-2.5 border border-ink/15 rounded outline-none focus:border-ink text-sm"
              />
              <button className="bg-ink text-white px-4 text-sm rounded hover:bg-brand">Apply</button>
            </div>
            <div className="bg-cream rounded p-3 text-sm text-mute mb-5">
              Try code <strong className="text-ink">Free15first</strong> for 15% off
            </div>

            <div className="space-y-2 text-sm border-t border-ink/10 pt-5">
              <div className="flex justify-between">
                <span className="text-mute">Subtotal</span>
                <span>{formatPrice(subtotal)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-mute">Shipping</span>
                <span>{shipFee === 0 ? "Calculated by backend" : formatPrice(shipFee)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-mute">Tax</span>
                <span>{formatPrice(tax)}</span>
              </div>
            </div>
            <div className="flex justify-between border-t border-ink/10 mt-4 pt-4 text-lg">
              <span className="font-semibold">Total</span>
              <span className="font-display font-semibold">{formatPrice(total)}</span>
            </div>
          </aside>
        </div>
      </section>

      <Newsletter />
    </PageLayout>
  );
};

export default Checkout;
