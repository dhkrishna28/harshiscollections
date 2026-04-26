import { useEffect } from "react";
import CollectionFilters, { FilterState } from "./CollectionFilters";

interface Props {
  open: boolean;
  onClose: () => void;
  value: FilterState;
  onChange: (next: FilterState) => void;
  onClear?: () => void;
}

const FilterDrawer = ({ open, onClose, value, onChange, onClear }: Props) => {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  return (
    <>
      <div
        onClick={onClose}
        className={`md:hidden fixed inset-0 bg-black/50 z-40 transition ${
          open ? "opacity-100 visible" : "opacity-0 invisible"
        }`}
      />
      <aside
        className={`md:hidden fixed top-0 left-0 z-50 h-full w-80 max-w-[85vw] bg-cream overflow-y-auto p-6 transform transition-transform duration-300 ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <CollectionFilters
          isMobileDrawer
          onClose={onClose}
          value={value}
          onChange={onChange}
          onClear={onClear}
        />
      </aside>
    </>
  );
};

export default FilterDrawer;
