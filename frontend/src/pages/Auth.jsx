// frontend/src/pages/Auth.jsx
import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { apiLogin, apiRegister } from "../lib/api";

export default function Auth({ onLogin }) {
  const { pathname } = useLocation();
  const mode = pathname.endsWith("/register") ? "register" : "login";
  const navigate = useNavigate();

  const [form, setForm] = useState({ username: "", email: "", password: "", confirm: "" });
  const [busy, setBusy] = useState(false);
  const [errMsg, setErrMsg] = useState("");

  const submit = async (e) => {
    e.preventDefault();
    setErrMsg("");
    try {
      setBusy(true);

      if (mode === "login") {
        const identifier = form.username || form.email;
        if (!identifier) return setErrMsg("Enter username or email");
        if (!form.password) return setErrMsg("Enter password");

        const data = await apiLogin({ identifier, password: form.password });
        if (!data?.user) throw new Error(data?.message || "Login failed");

        onLogin?.(data.user);     // parent sets user state
        navigate("/");            // go home
      } else {
        if (!form.username) return setErrMsg("Username required");
        if (!form.password) return setErrMsg("Password required");
        if (form.password !== form.confirm) return setErrMsg("Passwords do not match");

        const data = await apiRegister({
          username: form.username,
          email: form.email || null,
          password: form.password,
        });
        if (!data?.ok && !data?.user) throw new Error(data?.message || "Registration failed");

        navigate("/login");       // go to login after registering
      }
    } catch (err) {
      setErrMsg(err.message || "Request failed");
    } finally {
      setBusy(false);
    }
  };

  return (
    <section className="py-12">
      <div className="mx-auto max-w-md rounded-3xl bg-neutral-900 p-6 ring-1 ring-neutral-800">
        <h1 className="text-2xl font-bold mb-4">{mode === "login" ? "Login" : "Register"}</h1>

        {errMsg && (
          <div className="mb-4 rounded-xl bg-red-500/10 px-3 py-2 text-red-300 ring-1 ring-red-500/30">
            {errMsg}
          </div>
        )}

        <form onSubmit={submit} className="space-y-4">
          <div>
            <label className="text-sm text-neutral-400">Username or Gmail</label>
            <input
              value={form.username}
              onChange={(e) => setForm({ ...form, username: e.target.value })}
              className="mt-1 w-full rounded-xl bg-neutral-950 px-3 py-2 ring-1 ring-neutral-700 focus:ring-emerald-500/60"
              placeholder="username or gmail"
              autoComplete="username"
            />
          </div>

          {mode === "register" && (
            <div>
              <label className="text-sm text-neutral-400">Email (optional)</label>
              <input
                value={form.email ?? ""}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="mt-1 w-full rounded-xl bg-neutral-950 px-3 py-2 ring-1 ring-neutral-700 focus:ring-emerald-500/60"
                placeholder="you@example.com"
                autoComplete="email"
              />
            </div>
          )}

          <div>
            <label className="text-sm text-neutral-400">Password</label>
            <input
              type="password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              className="mt-1 w-full rounded-xl bg-neutral-950 px-3 py-2 ring-1 ring-neutral-700 focus:ring-emerald-500/60"
              placeholder="••••••••"
              autoComplete={mode === "login" ? "current-password" : "new-password"}
            />
          </div>

          {mode === "register" && (
            <div>
              <label className="text-sm text-neutral-400">Repeat password</label>
              <input
                type="password"
                value={form.confirm}
                onChange={(e) => setForm({ ...form, confirm: e.target.value })}
                className="mt-1 w-full rounded-xl bg-neutral-950 px-3 py-2 ring-1 ring-neutral-700 focus:ring-emerald-500/60"
                placeholder="••••••••"
                autoComplete="new-password"
              />
            </div>
          )}

          <button
            type="submit"
            disabled={busy}
            className="w-full rounded-2xl bg-emerald-500/20 px-4 py-2 text-emerald-300 ring-1 ring-emerald-500/40 hover:bg-emerald-500/30 disabled:opacity-60"
          >
            {busy ? "Please wait..." : mode === "login" ? "Login" : "Register"}
          </button>
        </form>

        <div className="mt-4 text-center text-sm text-neutral-400">
          {mode === "login" ? (
            <>No account? <Link className="text-emerald-300 hover:underline" to="/register">Register</Link></>
          ) : (
            <>Already have an account? <Link className="text-emerald-300 hover:underline" to="/login">Login</Link></>
          )}
        </div>
      </div>
    </section>
  );
}
