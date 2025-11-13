// frontend/src/components/Navbar.jsx
import React, { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import ProfileMenu from "./ProfileMenu";

export default function Navbar({ user, onLogout }) {
  const [open, setOpen] = useState(false);

  const NavItem = ({ to, children }) => (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `px-3 py-2 rounded-xl hover:bg-neutral-800 ${
          isActive ? "text-emerald-300" : "text-neutral-200"
        }`
      }
      onClick={() => setOpen(false)}
    >
      {children}
    </NavLink>
  );

  return (
    <header className="sticky top-0 z-50 backdrop-blur supports-[backdrop-filter]:bg-neutral-900/60">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <nav className="flex items-center justify-between py-4">
          {/* Logo */}
          <Link to="/" className="text-2xl font-black tracking-tight">
            <span className="text-emerald-400">Foodie</span>Hub
          </Link>

          {/* Desktop nav */}
          <ul className="hidden items-center gap-4 md:flex">
            <li>
              <NavItem to="/">Home</NavItem>
            </li>
            <li>
              <NavItem to="/about">About</NavItem>
            </li>
            <li>
              <NavItem to="/contact">Contact</NavItem>
            </li>
          </ul>

          {/* Right side: cart + profile/login */}
          <div className="hidden items-center gap-3 md:flex">
            {user && (
              <Link
                to="/cart"
                aria-label="Cart"
                className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-neutral-700 text-neutral-200 hover:border-emerald-400 hover:text-emerald-400"
              >
                <span className="text-lg">🛒</span>
              </Link>
            )}

            {user ? (
              <ProfileMenu user={user} onLogout={onLogout} />
            ) : (
              <NavItem to="/login">Login</NavItem>
            )}
          </div>

          {/* Mobile toggle */}
          <button
            type="button"
            className="inline-flex items-center justify-center rounded-full p-2 ring-1 ring-neutral-700 hover:ring-emerald-500 md:hidden"
            onClick={() => setOpen((v) => !v)}
            aria-label="Toggle navigation"
          >
            <span className="text-xl text-neutral-100">
              {open ? "×" : "☰"}
            </span>
          </button>
        </nav>

        {/* Mobile menu */}
        {open && (
          <div className="md:hidden pb-4">
            <div className="space-y-2 rounded-2xl bg-neutral-900 p-4 ring-1 ring-neutral-800">
              <NavItem to="/">Home</NavItem>
              <NavItem to="/about">About</NavItem>
              <NavItem to="/contact">Contact</NavItem>

              {user && (
                <NavItem to="/cart">
                  <span className="mr-1">🛒</span>Cart
                </NavItem>
              )}

              {user ? (
                <button
                  type="button"
                  onClick={() => {
                    onLogout?.();
                    setOpen(false);
                  }}
                  className="w-full px-3 py-2 rounded-xl hover:bg-neutral-800 text-left text-red-300"
                >
                  Logout
                </button>
              ) : (
                <NavItem to="/login">Login</NavItem>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
