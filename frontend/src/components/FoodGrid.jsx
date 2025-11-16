import React from "react";

// keep prices consistent everywhere (3.5 -> 4, 4.2 -> 4, 4.9 -> 5)
const normalizePrice = (p) => {
  const n = Number(p);
  if (!Number.isFinite(n)) return null;
  return Math.round(n);
};

export default function FoodGrid({ items = [], onPreview, onAdd }) {
  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {items.map((f, idx) => {
        if (!f || typeof f !== "object") return null;

        const normPrice = normalizePrice(f.price);
        const popularityNum = Number.isFinite(Number(f?.popularity))
          ? Number(f.popularity)
          : null;

        return (
          <article
            key={f.id ?? idx}
            className="group overflow-hidden rounded-3xl bg-neutral-900 ring-1 ring-neutral-800 shadow-lg"
          >
            <button
              onClick={() => onPreview?.(f)}
              className="block w-full overflow-hidden text-left"
            >
              <img
                src={f.img || "https://picsum.photos/seed/foodiehub/600/400"}
                alt={f.name || "Food item"}
                className="h-48 w-full object-cover transition-transform duration-300 group-hover:scale-105"
              />
            </button>
            <div className="flex items-center justify-between px-4 py-3">
              <div>
                <h3 className="font-semibold tracking-tight">
                  {f.name || "Untitled item"}
                </h3>
                <p className="text-xs capitalize text-neutral-400">
                  {f.category || "unknown"}
                </p>
              </div>
              <div className="text-right">
                <div className="font-bold text-emerald-300">
                  {normPrice !== null ? `$${normPrice.toFixed(2)}` : "—"}
                </div>
                <div className="text-xs text-neutral-400">
                  {popularityNum !== null
                    ? `Popularity ${popularityNum}`
                    : "Popularity —"}
                </div>
              </div>
            </div>
            {onAdd && (
              <div className="px-4 pb-4">
                <button
                  type="button"
                  onClick={() => onAdd(f)}
                  className="mt-1 w-full rounded-2xl bg-emerald-500/15 px-3 py-2 text-xs font-semibold text-emerald-200 ring-1 ring-emerald-500/40 hover:bg-emerald-500/25"
                >
                  Add to cart
                </button>
              </div>
            )}
          </article>
        );
      })}
    </div>
  );
}
