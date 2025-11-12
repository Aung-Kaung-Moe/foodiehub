import React, { useState } from "react";
import { Link, NavLink } from "react-router-dom";

export default function Navbar({ onOpenCart, user, onLogout }) {
  const [open, setOpen] = useState(false);

  const NavItem = ({ to, children }) => (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `hover:text-emerald-400 ${isActive ? "text-emerald-300" : ""}`
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
          <Link to="/" className="text-2xl font-black tracking-tight">
            <span className="text-emerald-400">Foodie</span>Hub
          </Link>

          <ul className="hidden items-center gap-6 md:flex">
            <li><NavItem to="/">Home</NavItem></li>
            <li><NavItem to="/about">About</NavItem></li>
            <li><NavItem to="/contact">Contact</NavItem></li>
            <li>
              {user ? (
                <button
                  onClick={onLogout}
                  className="rounded-2xl px-4 py-2 ring-1 ring-neutral-700 hover:bg-neutral-800"
                >
                  Logout
                </button>
              ) : (
                <Link
                  className="rounded-2xl bg-emerald-500/20 px-4 py-2 text-emerald-300 ring-1 ring-emerald-500/40 hover:bg-emerald-500/30"
                  to="/login"
                >
                  Login
                </Link>
              )}
            </li>
            <li>
              <button
                onClick={onOpenCart}
                aria-label="Cart"
                className="relative rounded-xl px-3 py-2 ring-1 ring-neutral-700 hover:bg-neutral-800"
              >
                <CartIcon />
              </button>
            </li>
          </ul>

          <button
            onClick={() => setOpen((v) => !v)}
            className="md:hidden rounded-xl ring-1 ring-neutral-700 px-3 py-2"
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label="Toggle menu"
          >
            Menu
          </button>
        </nav>

        {open && (
          <div id="mobile-menu" className="md:hidden pb-4">
            <div className="flex flex-col gap-2 rounded-2xl bg-neutral-900 p-3 ring-1 ring-neutral-800">
              <NavItem to="/">Home</NavItem>
              <NavItem to="/about">About</NavItem>
              <NavItem to="/contact">Contact</NavItem>
              {user ? (
                <button
                  onClick={() => { onLogout(); setOpen(false); }}
                  className="px-3 py-2 rounded-xl hover:bg-neutral-800 text-left"
                >
                  Logout
                </button>
              ) : (
                <NavItem to="/login">Login</NavItem>
              )}
              <button
                onClick={() => { onOpenCart(); setOpen(false); }}
                className="px-3 py-2 rounded-xl hover:bg-neutral-800 text-left"
              >
                Cart
              </button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}

function CartIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="h-5 w-5 fill-current">
      <path d="M7 4h-2l-1 2v2h2l3.6 7.59-1.35 2.44A1.99 1.99 0 0 0 8.99 20H19v-2H9.42a.25.25 0 0 1-.22-.37L10.1 15h6.45a2 2 0 0 0 1.79-1.11l3.24-6.48A1 1 0 0 0 20.7 6H6.21l-.94-2Z"/>
    </svg>
  );
}
