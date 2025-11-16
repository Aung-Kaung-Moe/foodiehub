// frontend/src/pages/Orders.jsx
import React, { useEffect, useState } from "react";
import { apiOrders } from "../lib/api";

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadOrders = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await apiOrders();
      setOrders(data.orders || []);
    } catch (e) {
      console.error(e);
      setError(e.message || "Unable to load orders.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOrders();
  }, []);

  if (loading) {
    return (
      <section className="py-10">
        <div className="mx-auto max-w-3xl text-slate-300">Loading…</div>
      </section>
    );
  }

  return (
    <section className="py-10">
      <div className="mx-auto max-w-4xl space-y-6">
        <h1 className="text-2xl font-semibold tracking-tight">Your orders</h1>

        {error && (
          <p className="text-sm text-red-400 mb-2">
            {error} Please refresh or try again.
          </p>
        )}

        {(!orders || orders.length === 0) && !error && (
          <p className="text-slate-400">You have not placed any orders yet.</p>
        )}

        <div className="space-y-4">
          {orders.map((order) => {
            const created = new Date(order.created_at);
            const items = order.items || [];
            const itemCount = items.reduce(
              (sum, it) => sum + (Number(it.quantity) || 0),
              0
            );

            return (
              <div
                key={order.id}
                className="rounded-3xl bg-neutral-900/80 p-5 ring-1 ring-neutral-800"
              >
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-neutral-800 pb-3 mb-3">
                  <div>
                    <div className="text-sm text-neutral-400">
                      Order #{order.id}
                    </div>
                    <div className="text-xs text-neutral-500">
                      {created.toLocaleString()}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-neutral-400">
                      Items:{" "}
                      <span className="text-neutral-200">{itemCount}</span>
                    </div>
                    <div className="text-sm text-neutral-400">
                      Delivery:{" "}
                      <span className="text-neutral-200">
                        {order.transport || "Not set"}
                      </span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-xs uppercase text-emerald-300/80">
                      {order.status || "placed"}
                    </div>
                    <div className="text-lg font-semibold text-emerald-300">
                      ${Number(order.total || 0).toFixed(2)}
                    </div>
                  </div>
                </div>

                {items.length > 0 && (
                  <div className="space-y-2 text-sm">
                    {items.map((it) => (
                      <div
                        key={it.id}
                        className="flex items-center justify-between gap-3"
                      >
                        <div className="flex items-center gap-3">
                          {it.image_url && (
                            <img
                              src={it.image_url}
                              alt={it.name}
                              className="h-10 w-10 rounded-xl object-cover"
                            />
                          )}
                          <div>
                            <div className="font-medium text-neutral-100">
                              {it.name}
                            </div>
                            <div className="text-xs text-neutral-400">
                              Qty {it.quantity} × $
                              {Number(it.price || 0).toFixed(2)}
                            </div>
                          </div>
                        </div>
                        <div className="font-semibold text-neutral-100">
                          $
                          {(
                            Number(it.price || 0) *
                            Number(it.quantity || 1)
                          ).toFixed(2)}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
