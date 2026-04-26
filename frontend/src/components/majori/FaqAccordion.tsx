import { useState, ReactNode } from "react";

export interface FaqItem {
  q: string;
  a: ReactNode;
}

const FaqAccordion = ({ items }: { items: FaqItem[] }) => {
  const [open, setOpen] = useState<number | null>(null);
  return (
    <div className="space-y-3">
      {items.map((it, i) => {
        const isOpen = open === i;
        return (
          <div key={i} className="bg-white border border-ink/10 rounded">
            <button
              type="button"
              onClick={() => setOpen(isOpen ? null : i)}
              className="w-full px-5 py-4 flex items-center justify-between gap-4 text-left"
              aria-expanded={isOpen}
            >
              <span className="font-medium">{it.q}</span>
              <svg
                className={`shrink-0 transition-transform ${isOpen ? "rotate-45" : ""}`}
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
              >
                <path d="M12 5v14M5 12h14" />
              </svg>
            </button>
            {isOpen && (
              <div className="px-5 pb-5 text-sm text-mute leading-relaxed">{it.a}</div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default FaqAccordion;
