import React from "react";


export default function Footer() {
return (
<footer className="mt-auto border-t border-neutral-800 bg-neutral-950" id="contact">
<div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 grid gap-6 md:grid-cols-3">
<div>
<h4 className="font-semibold mb-2">FoodieHub</h4>
<p className="text-sm text-neutral-400">Delicious made easy. Burgers, pizzas, drinks, desserts—pick your mood.</p>
</div>
<div id="about">
<h4 className="font-semibold mb-2">About</h4>
<p className="text-sm text-neutral-400">We obsess over taste and speed. Hand‑picked menus, updated weekly.</p>
</div>
<div>
<h4 className="font-semibold mb-2">Contact</h4>
<p className="text-sm text-neutral-400">Email: hello@foodiehub.example</p>
</div>
</div>
<div className="border-t border-neutral-800 py-4 text-center text-sm text-neutral-500">
<span>&copy; {new Date().getFullYear()} FoodieHub</span>
</div>
</footer>
);
}