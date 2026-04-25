import { useState } from "react";

interface Review {
  name: string;
  rating: number;
  text: string;
}

interface Props {
  description: string;
  details: string[];
  reviews: Review[];
}

type TabId = "desc" | "details" | "reviews";

const ProductTabs = ({ description, details, reviews }: Props) => {
  const [tab, setTab] = useState<TabId>("desc");

  const tabs: { id: TabId; label: string }[] = [
    { id: "desc", label: "Description" },
    { id: "details", label: "Details" },
    { id: "reviews", label: `Reviews (${reviews.length})` },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 mt-16">
      <div className="border-b border-ink/10 flex gap-6 text-sm">
        {tabs.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`py-3 border-b-2 transition ${
              tab === t.id
                ? "border-ink text-ink"
                : "border-transparent text-mute hover:text-ink"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {tab === "desc" && (
        <div className="py-6 max-w-3xl">
          <p className="text-mute leading-relaxed">{description}</p>
        </div>
      )}

      {tab === "details" && (
        <div className="py-6 max-w-3xl">
          <ul className="text-sm space-y-2 text-ink/80">
            {details.map((d) => (
              <li key={d}>• {d}</li>
            ))}
          </ul>
        </div>
      )}

      {tab === "reviews" && (
        <div className="py-6 max-w-3xl space-y-6">
          {reviews.map((r, i) => (
            <div key={i} className="border-b border-ink/10 pb-4">
              <div className="flex items-center gap-3 mb-2">
                <div className="text-brand">{"★".repeat(r.rating)}</div>
                <p className="font-semibold text-sm">{r.name}</p>
              </div>
              <p className="text-mute text-sm">{r.text}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProductTabs;
