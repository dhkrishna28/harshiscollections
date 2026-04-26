import { useState } from "react";
import { Link } from "react-router-dom";
import PageLayout from "@/components/majori/PageLayout";
import PageHeader from "@/components/majori/PageHeader";
import {
  WishlistCard,
  WishlistRow,
  type WishlistProduct,
} from "@/components/majori/WishlistItem";
import { toast } from "@/hooks/use-toast";

const initial: WishlistProduct[] = [
  { id: "1", name: "Linen Wrap Dress", price: "$89.00", bg: "bg-rose/40" },
  { id: "2", name: "Silk Blouse", price: "$120.00", bg: "bg-sand/40" },
  { id: "3", name: "Wide-Leg Trousers", price: "$95.00", bg: "bg-brand/40" },
  { id: "4", name: "Cashmere Cardigan", price: "$180.00", bg: "bg-rose/40" },
];

const Wishlist = () => {
  const [items, setItems] = useState<WishlistProduct[]>(initial);

  const handleRemove = (id: string) =>
    setItems((prev) => prev.filter((i) => i.id !== id));

  const handleAddToCart = (id: string) => {
    const item = items.find((i) => i.id === id);
    if (item) toast({ title: "Added to cart", description: item.name });
  };

  const handleAddAll = () => {
    if (!items.length) return;
    toast({
      title: "Added all to cart",
      description: `${items.length} item(s) moved to your cart.`,
    });
  };

  return (
    <PageLayout>
      <PageHeader
        title="Wishlist"
        crumbs={[{ label: "Home", to: "/" }, { label: "Wishlist" }]}
      />

      <section className="max-w-7xl mx-auto px-4 py-14">
        <p className="text-mute mb-8">
          You have{" "}
          <span className="text-ink font-semibold">{items.length} items</span>{" "}
          in your wishlist.
        </p>

        {items.length === 0 ? (
          <div className="text-center bg-white border border-ink/10 rounded p-12">
            <p className="font-display text-2xl mb-2">Your wishlist is empty</p>
            <p className="text-mute mb-6">
              Browse our collection and save your favorites here.
            </p>
            <Link
              to="/collection"
              className="inline-block bg-ink text-white px-7 py-3 uppercase text-xs tracking-wider hover:bg-brand transition rounded"
            >
              Continue Shopping
            </Link>
          </div>
        ) : (
          <>
            <div className="hidden md:block bg-white border border-ink/10 rounded">
              <table className="w-full text-sm">
                <thead className="bg-cream">
                  <tr className="text-left text-xs uppercase tracking-wider text-mute">
                    <th className="px-6 py-4"></th>
                    <th className="px-6 py-4">Product</th>
                    <th className="px-6 py-4">Price</th>
                    <th className="px-6 py-4">Stock</th>
                    <th className="px-6 py-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((item) => (
                    <WishlistRow
                      key={item.id}
                      item={item}
                      onRemove={handleRemove}
                      onAddToCart={handleAddToCart}
                    />
                  ))}
                </tbody>
              </table>
            </div>

            <div className="md:hidden grid sm:grid-cols-2 gap-4">
              {items.map((item) => (
                <WishlistCard
                  key={item.id}
                  item={item}
                  onRemove={handleRemove}
                  onAddToCart={handleAddToCart}
                />
              ))}
            </div>

            <div className="mt-10 flex flex-wrap gap-4">
              <Link
                to="/collection"
                className="border border-ink px-7 py-3 uppercase text-xs tracking-wider hover:bg-ink hover:text-white transition rounded"
              >
                Continue Shopping
              </Link>
              <button
                onClick={handleAddAll}
                className="bg-ink text-white px-7 py-3 uppercase text-xs tracking-wider hover:bg-brand transition rounded"
              >
                Add All to Cart
              </button>
            </div>
          </>
        )}
      </section>
    </PageLayout>
  );
};

export default Wishlist;
