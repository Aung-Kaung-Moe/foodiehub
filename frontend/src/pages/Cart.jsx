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
  { key: "bike", label: "Bike", price: 2 },
  { key: "motorcycle", label: "Motorcycle", price: 4 },
  { key: "car", label: "Car", price: 6 },
];

export default function Cart() {
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(null);

  const loadCart = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await apiCart();
      // backend returns { id, transport, items: [...] }
      setCart(data.cart || data);
    } catch (e) {
      console.error(e);
      setError("Unable to load cart.");
      setCart({ items: [] });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCart();
  }, []);

  const removeItem = async (itemId) => {
    if (!itemId) return;
    setBusy(true);
    try {
      await apiCartRemoveItem(itemId);
      await loadCart();
    } catch (e) {
      console.error(e);
      err("Failed to remove item");
      setBusy(false);
    }
  };

  const changeTransport = async (transportKey) => {
    if (!cart) return;
    setBusy(true);
    try {
      await apiCartSetTransport(transportKey);
      setCart((prev) => ({ ...prev, transport: transportKey }));
    } catch (e) {
      console.error(e);
      err("Failed to update transport");
    } finally {
      setBusy(false);
    }
  };

  const checkout = async () => {
    if (!cart || !cart.items || cart.items.length === 0) return;
    setBusy(true);
    try {
      await apiCartCheckout();
      ok("Order submitted successfully");
      await loadCart();
    } catch (e) {
      console.error(e);
      err("Checkout failed");
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

  const items = cart?.items || [];
  const subtotal = items.reduce(
    (sum, item) =>
      sum + Number(item.price || 0) * Number(item.quantity || 1),
    0
  );
  const selectedTransport =
    transports.find((t) => t.key === cart?.transport) || null;
  const deliveryFee = selectedTransport?.price || 0;
  const total = subtotal + deliveryFee;

  return (
    <section className="py-10">
      <div className="mx-auto max-w-3xl space-y-8">
        <h1 className="text-2xl font-semibold tracking-tight">Your cart</h1>

        {error && (
          <p className="text-sm text-red-400 mb-2">
            {error} Please try again or refresh the page.
          </p>
        )}

        {/* Cart items */}
        {items.length === 0 ? (
          <p className="text-neutral-400">Your cart is empty.</p>
        ) : (
          <div className="space-y-4 rounded-3xl bg-neutral-900 p-6 ring-1 ring-neutral-800">
            {items.map((item) => (
              <div
                key={item.id}
                className="flex items-center gap-4 border-b border-neutral-800 pb-4 last:border-none last:pb-0"
              >
                {item.image_url && (
                  <img
                    src={item.image_url}
                    alt={item.name}
                    className="h-16 w-16 rounded-2xl object-cover"
                  />
                )}
                <div className="flex-1">
                  <div className="font-medium">{item.name}</div>
                  <div className="text-sm text-neutral-400">
                    Qty {item.quantity} × ${Number(item.price).toFixed(2)}
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-semibold">
                    $
                    {(
                      Number(item.price || 0) * Number(item.quantity || 1)
                    ).toFixed(2)}
                  </div>
                  <button
                    type="button"
                    disabled={busy}
                    onClick={() => removeItem(item.id)}
                    className="mt-2 inline-flex items-center justify-center rounded-xl px-3 py-1 text-xs text-red-300 ring-1 ring-red-400/40 hover:bg-red-500/10 hover:text-red-200"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Transport selection + totals */}
        <div className="space-y-4 rounded-3xl bg-neutral-900 p-6 ring-1 ring-neutral-800">
          <h2 className="text-lg font-semibold">Delivery options</h2>
          <p className="text-sm text-neutral-400">
            Choose one vehicle. Bike is the cheapest, car is the most
            expensive. Delivery cost will be added to your total.
          </p>

          <div className="mt-3 space-y-2">
            {transports.map((t) => (
              <label
                key={t.key}
                className="flex cursor-pointer items-center justify-between rounded-2xl bg-neutral-950 px-4 py-2 ring-1 ring-neutral-800 hover:ring-emerald-500/40"
              >
                <div className="flex items-center gap-3">
                  <input
                    type="radio"
                    name="transport"
                    value={t.key}
                    checked={cart?.transport === t.key}
                    onChange={() => changeTransport(t.key)}
                    className="h-4 w-4"
                  />
                  <span>{t.label}</span>
                </div>
                <span className="text-sm text-neutral-300">
                  + ${t.price.toFixed(2)}
                </span>
              </label>
            ))}
          </div>

          <div className="mt-4 space-y-1 text-sm">
            <div className="flex justify-between">
              <span className="text-neutral-400">Items total</span>
              <span className="font-medium">${subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-neutral-400">Delivery</span>
              <span className="font-medium">${deliveryFee.toFixed(2)}</span>
            </div>
            <div className="flex justify-between border-t border-neutral-800 pt-2 text-base">
              <span className="font-semibold">Final total</span>
              <span className="font-semibold">${total.toFixed(2)}</span>
            </div>
          </div>

          <button
            disabled={busy || !items.length || !cart?.transport}
            onClick={checkout}
            className="mt-4 w-full rounded-2xl bg-emerald-500/20 px-4 py-2 text-sm font-semibold text-emerald-200 ring-1 ring-emerald-500/40 hover:bg-emerald-500/30 disabled:opacity-50"
          >
            Submit order
          </button>
        </div>
      </div>
    </section>
  );
}
