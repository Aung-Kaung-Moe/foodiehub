import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";

export default function ProfileMenu({ user, onLogout }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const onClickOut = (e) => {
      if (!ref.current?.contains(e.target)) setOpen(false);
    };
    const onEsc = (e) => e.key === "Escape" && setOpen(false);
    document.addEventListener("mousedown", onClickOut);
    document.addEventListener("keydown", onEsc);
    return () => {
      document.removeEventListener("mousedown", onClickOut);
      document.removeEventListener("keydown", onEsc);
    };
  }, []);

  const initials = (() => {
    const name = user?.name || user?.username || user?.email || "";
    const parts = name.trim().split(/\s+/).filter(Boolean);
    if (!parts.length) return "U";
    if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  })();

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex h-9 w-9 items-center justify-center rounded-full bg-emerald-500/20 ring-1 ring-emerald-500/40 hover:bg-emerald-500/30"
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label="Open profile menu"
      >
        <span className="text-sm font-bold text-emerald-300 select-none">
          {initials}
        </span>
      </button>

      {open && (
        <div
          role="menu"
          aria-label="Profile"
          className="absolute right-0 mt-2 w-48 rounded-2xl bg-neutral-900 p-2 ring-1 ring-neutral-800 shadow-lg"
        >
          <div className="px-3 py-2 text-xs text-neutral-400 border-b border-neutral-800">
            Signed in as
            <div className="truncate text-neutral-200">
              {user?.name || user?.username || user?.email}
            </div>
          </div>
          <Link
            to="/profile"
            className="block rounded-xl px-3 py-2 hover:bg-neutral-800"
            role="menuitem"
            onClick={() => setOpen(false)}
          >
            Profile
          </Link>
          <Link
            to="/orders"
            className="block rounded-xl px-3 py-2 hover:bg-neutral-800"
            role="menuitem"
            onClick={() => setOpen(false)}
          >
            Orders
          </Link>
          <button
            onClick={() => { onLogout?.(); setOpen(false); }}
            className="block w-full text-left rounded-xl px-3 py-2 hover:bg-neutral-800 text-red-300"
            role="menuitem"
          >
            Logout
          </button>
        </div>
      )}
    </div>
  );
}
