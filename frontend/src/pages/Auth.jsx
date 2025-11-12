import React, { useState } from "react";


export default function Auth({ onLogin }) {
const [mode, setMode] = useState("login"); // login | register
const [form, setForm] = useState({ username: "", email: "", password: "", confirm: "" });


const submit = (e) => {
e.preventDefault();
if (mode === "login") {
if (!form.username && !form.email) return alert("Enter username or email");
if (!form.password) return alert("Enter password");
onLogin?.(form.username || form.email);
} else {
if (!(form.username || form.email)) return alert("Username or email required");
if (!form.password) return alert("Password required");
if (form.password !== form.confirm) return alert("Passwords do not match");
onLogin?.(form.username || form.email);
}
};


return (
<section className="py-12">
<div className="mx-auto max-w-md rounded-3xl bg-neutral-900 p-6 ring-1 ring-neutral-800">
<h1 className="text-2xl font-bold mb-4">{mode === "login" ? "Login" : "Register"}</h1>
<form onSubmit={submit} className="space-y-4">
<div>
<label className="text-sm text-neutral-400">Username or Gmail</label>
<input value={form.username}
onChange={(e) => setForm({ ...form, username: e.target.value })}
className="mt-1 w-full rounded-xl bg-neutral-950 px-3 py-2 ring-1 ring-neutral-700 focus:ring-emerald-500/60" placeholder="username or gmail" />
</div>
{mode === "register" && (
<div>
<label className="text-sm text-neutral-400">Email (optional)</label>
<input value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })}
className="mt-1 w-full rounded-xl bg-neutral-950 px-3 py-2 ring-1 ring-neutral-700 focus:ring-emerald-500/60" placeholder="you@example.com" />
</div>
)}
<div>
<label className="text-sm text-neutral-400">Password</label>
<input type="password" value={form.password}
onChange={(e) => setForm({ ...form, password: e.target.value })}
className="mt-1 w-full rounded-xl bg-neutral-950 px-3 py-2 ring-1 ring-neutral-700 focus:ring-emerald-500/60" placeholder="••••••••" />
</div>
{mode === "register" && (
<div>
<label className="text-sm text-neutral-400">Repeat password</label>
<input type="password" value={form.confirm}
onChange={(e) => setForm({ ...form, confirm: e.target.value })}
className="mt-1 w-full rounded-xl bg-neutral-950 px-3 py-2 ring-1 ring-neutral-700 focus:ring-emerald-500/60" placeholder="••••••••" />
</div>
)}
<button type="submit" className="w-full rounded-2xl bg-emerald-500/20 px-4 py-2 text-emerald-300 ring-1 ring-emerald-500/40 hover:bg-emerald-500/30">
{mode === "login" ? "Login" : "Register"}
</button>
</form>


<div className="mt-4 text-center text-sm text-neutral-400">
{mode === "login" ? (
<>No account? <button className="text-emerald-300 hover:underline" onClick={() => setMode("register")}>Register</button></>
) : (
<>Already have an account? <button className="text-emerald-300 hover:underline" onClick={() => setMode("login")}>Login</button></>
)}
</div>
</div>
</section>
);
}