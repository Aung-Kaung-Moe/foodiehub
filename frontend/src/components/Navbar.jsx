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

          {/* Desktop nav */}
          <ul className="hidden items-center gap-6 md:flex">
            <li><NavItem to="/">Home</NavItem></li>
            <li><NavItem to="/about">About</NavItem></li>
            <li><NavItem to="/contact">Contact</NavItem></li>

            <li>
              {user ? (
                <ProfileMenu user={user} onLogout={onLogout} />
              ) : (
                <Link
                  className="rounded-2xl bg-emerald-500/20 px-4 py-2 text-emerald-300 ring-1 ring-emerald-500/40 hover:bg-emerald-500/30"
                  to="/login"
                >
                  Login
                </Link>
              )}
            </li>
          </ul>

          {/* Mobile hamburger */}
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

        {/* Mobile menu */}
        {open && (
          <div id="mobile-menu" className="md:hidden pb-4">
            <div className="flex flex-col gap-2 rounded-2xl bg-neutral-900 p-3 ring-1 ring-neutral-800">
              <NavItem to="/">Home</NavItem>
              <NavItem to="/about">About</NavItem>
              <NavItem to="/contact">Contact</NavItem>

              {user ? (
                <>
                  <NavItem to="/profile">Profile</NavItem>
                  <NavItem to="/orders">Orders</NavItem>
                  <button
                    onClick={() => { onLogout?.(); setOpen(false); }}
                    className="px-3 py-2 rounded-xl hover:bg-neutral-800 text-left text-red-300"
                  >
                    Logout
                  </button>
                </>
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