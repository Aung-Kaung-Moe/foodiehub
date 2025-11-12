// frontend/src/pages/Cart.jsx
import React, { useEffect, useState } from "react";
import {
  apiCart,
  apiCartRemoveItem,
  apiCartSetTransport,
  apiCartCheckout,
} from "../lib/api";

const ok = (m) => window.alert(m);
const err = (m) => window.alert(m);

const transports = [
  { key: "bike", label: "Bike" },
  { key: "motorcycle", label: "Motorcycle" },
  { key: "car", label: "Car" },
];

export default function Cart() {
  const [loading, setLoading] = useState(true);
  const [cart, setCart] = useState(null);
  const [busy, setBusy] = useState(false);

  const load = async () => {
    try {
      const { cart } = await apiCart();
      setCart(cart);
    } catch (e) {
      err(e.message || "Failed to load cart");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const removeItem = async (id) => {
    setBusy(true);
    try {
      const { cart } = await apiCartRemoveItem(id);
      setCart(cart);
    } catch (e) {
      err(e.message || "Failed to remove item");
    } finally {
      setBusy(false);
    }
  };

  const setTransport = async (t) => {
    setBusy(true);
    try {
      const { cart } = await apiCartSetTransport(t);
      setCart(cart);
    } catch (e) {
      err(e.message || "Failed to set transport");
    } finally {
      setBusy(false);
    }
  };

  const checkout = async () => {
    setBusy(true);
    try {
      const res = await apiCartCheckout();
      ok(res.message || "ordered successfully");
      // reload fresh (empty) active cart
      await load();
    } catch (e) {
      err(e.message || "Checkout failed");
    } finally {
      setBusy(false);
    }
  };

  if (loading) {
    return (
      <section className="py-12">
        <div className="mx-auto max-w-3xl text-neutral-400">Loading…</div>
      </section>
    );
  }

  return (
    <section className="py-10">
      <div className="mx-auto max-w-3xl space-y-6">
        <h1 className="text-2xl font-bold">Your Cart</h1>

        <div className="rounded-3xl bg-neutral-900 p-5 ring-1 ring-neutral-800">
          {(!cart?.items || cart.items.length === 0) ? (
            <p className="text-neutral-400">No items yet.</p>
          ) : (
            <ul className="space-y-3">
              {cart.items.map((it) => (
                <li key={it.id} className="flex items-center gap-3 rounded-2xl bg-neutral-950 p-3 ring-1 ring-neutral-800">
                  <img src={it.image_url || "https://picsum.photos/seed/foodiehub/120/120"} alt={it.name} className="h-12 w-12 rounded-xl object-cover" />
                  <div className="flex-1">
                    <div className="font-medium">{it.name}</div>
                    <div className="text-xs text-neutral-400">Qty {it.quantity}</div>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold">${Number(it.price).toFixed(2)}</div>
                  </div>
                  <button
                    disabled={busy}
                    onClick={() => removeItem(it.id)}
                    className="ml-2 rounded-xl px-3 py-2 ring-1 ring-neutral-700 hover:bg-neutral-900 disabled:opacity-50"
                    title="Remove"
                  >
                    Remove
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Transport choice */}
        <div className="rounded-3xl bg-neutral-900 p-5 ring-1 ring-neutral-800">
          <h2 className="text-lg font-semibold mb-3">Vehicle transport</h2>
          <div className="flex flex-col sm:flex-row gap-2">
            {transports.map((t) => (
              <button
                key={t.key}
                disabled={busy}
                onClick={() => setTransport(t.key)}
                className={`rounded-xl px-4 py-2 ring-1 ${cart?.transport === t.key ? "bg-emerald-500/20 text-emerald-300 ring-emerald-500/40" : "ring-neutral-700 hover:bg-neutral-950"}`}
              >
                {t.label}
              </button>
            ))}
          </div>
          <p className="mt-2 text-sm text-neutral-400">
            Transport cost: ${Number(cart?.transport_cost ?? 0).toFixed(2)}
          </p>
        </div>

        {/* Summary & cash-only checkout */}
        <div className="rounded-3xl bg-neutral-900 p-5 ring-1 ring-neutral-800">
          <div className="flex items-center justify-between">
            <span className="text-neutral-400">Subtotal</span>
            <span className="font-semibold">${Number(cart?.subtotal ?? 0).toFixed(2)}</span>
          </div>
          <div className="flex items-center justify-between mt-1">
            <span className="text-neutral-400">Transport</span>
            <span className="font-semibold">${Number(cart?.transport_cost ?? 0).toFixed(2)}</span>
          </div>
          <div className="flex items-center justify-between mt-3 border-t border-neutral-800 pt-3">
            <span className="text-neutral-300">Total</span>
            <span className="text-lg font-bold">${Number(cart?.total ?? 0).toFixed(2)}</span>
          </div>

          <div className="mt-4 text-sm text-neutral-400">
            Payment method: <span className="text-neutral-200">Cash</span>
          </div>

          <button
            disabled={busy || !cart || !cart.items || cart.items.length === 0}
            onClick={checkout}
            className="mt-4 w-full rounded-2xl bg-emerald-500/20 px-4 py-2 text-emerald-300 ring-1 ring-emerald-500/40 hover:bg-emerald-500/30 disabled:opacity-50"
          >
            Submit order
          </button>
        </div>
      </div>
    </section>
  );
}
