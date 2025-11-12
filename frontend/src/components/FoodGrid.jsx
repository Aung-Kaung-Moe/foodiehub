import React from "react";

export default function FoodGrid({ items = [], onPreview, onAdd }) {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {items.map((f, idx) => {
                if (!f || typeof f !== "object") return null;
                const priceNum = Number.isFinite(Number(f?.price)) ? Number(f.price) : null;
                const popularityNum = Number.isFinite(Number(f?.popularity)) ? Number(f.popularity) : null;
                return (
                    <article key={f.id ?? idx} className="group overflow-hidden rounded-3xl bg-neutral-900 ring-1 ring-neutral-800">
                        <button onClick={() => onPreview?.(f)} className="block w-full overflow-hidden text-left">
                            <img
                                src={f.img || "https://picsum.photos/seed/foodiehub/600/400"}
                                alt={f.name || "Food item"}
                                className="h-48 w-full object-cover transition-transform duration-300 group-hover:scale-105"
                                loading="lazy"
                            />
                        </button>
                        <div className="p-4 flex items-start justify-between gap-4">
                            <div>
                                <h3 className="font-semibold tracking-tight">{f.name || "Untitled item"}</h3>
                                <p className="text-xs text-neutral-400 capitalize">{f.category || "unknown"}</p>
                            </div>
                            <div className="text-right">
                                <div className="font-bold">{priceNum !== null ? `$${priceNum.toFixed(2)}` : "—"}</div>
                                <div className="text-xs text-neutral-400">{popularityNum !== null ? `Popularity ${popularityNum}` : "Popularity —"}</div>
                            </div>
                        </div>
                    </article>
                );
            })}
        </div>
    );
}