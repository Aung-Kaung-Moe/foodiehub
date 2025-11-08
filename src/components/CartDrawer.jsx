import React, { useMemo } from "react";

export default function CartDrawer({ open, onClose, items = [] }) {
  if (!open) return null;
  const total = useMemo(() => items.reduce((s, x) => s + (Number(x.price) || 0), 0), [items]);

  return (
    <div className="fixed inset-0 z-[65]">
      <div onClick={onClose} className="absolute inset-0 bg-black/60" />
      <aside className="absolute right-0 top-0 h-full w-full max-w-md bg-neutral-950 ring-1 ring-neutral-800 p-5 overflow-y-auto">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold">Your Cart</h3>
          <button onClick={onClose} className="rounded-xl px-3 py-2 ring-1 ring-neutral-700 hover:bg-neutral-900">×</button>
        </div>

        {items.length === 0 ? (
          <p className="text-neutral-400">No items yet.</p>
        ) : (
          <ul className="space-y-3 mb-4">
            {items.map((it, i) => (
              <li key={i} className="flex items-center gap-3 rounded-2xl bg-neutral-900 p-3 ring-1 ring-neutral-800">
                <img src={it.img} alt={it.name} className="h-12 w-12 rounded-xl object-cover" />
                <div className="flex-1">
                  <div className="font-medium">{it.name}</div>
                  <div className="text-sm text-neutral-400 capitalize">{it.category}</div>
                </div>
                <div className="font-semibold">${Number(it.price).toFixed(2)}</div>
              </li>
            ))}
          </ul>
        )}

        <div className="mt-2 rounded-2xl bg-neutral-900 p-4 ring-1 ring-neutral-800">
          <div className="flex items-center justify-between">
            <span className="text-neutral-400">Total</span>
            <span className="text-lg font-bold">${total.toFixed(2)}</span>
          </div>
          <div className="mt-4">
            <label className="text-sm text-neutral-400">Payment method</label>
            <select className="mt-1 w-full rounded-xl bg-neutral-950 px-3 py-2 ring-1 ring-neutral-700 focus:ring-emerald-500/60">
              <option value="cash">Cash</option>
              <option value="card">Visa/MasterCard</option>
              <option value="kbz">KBZ Pay</option>
            </select>
          </div>
          <button className="mt-4 w-full rounded-2xl bg-emerald-500/20 px-4 py-2 text-emerald-300 ring-1 ring-emerald-500/40 hover:bg-emerald-500/30">
            Checkout
          </button>
        </div>
      </aside>
    </div>
  );
}
