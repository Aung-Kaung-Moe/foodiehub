import React from "react";


export default function About() {
return (
<section className="py-12">
<div className="mx-auto max-w-3xl">
<h1 className="text-4xl font-extrabold tracking-tight mb-4">About FoodieHub</h1>
<p className="text-neutral-300 mb-4">
We celebrate everyday comfort food done exceptionally well—wood‑fired pizzas, smash burgers, bright smoothies,
and desserts that actually taste like dessert. We tweak our menu frequently based on seasonal produce and what
people are loving right now.
</p>
<div className="grid gap-4 md:grid-cols-2">
<div className="rounded-2xl bg-neutral-900 p-4 ring-1 ring-neutral-800">
<h3 className="font-semibold mb-1">Our Sourcing</h3>
<p className="text-sm text-neutral-400">We prefer local markets in Yangon for greens and herbs, and roast our coffee in small batches.</p>
</div>
<div className="rounded-2xl bg-neutral-900 p-4 ring-1 ring-neutral-800">
<h3 className="font-semibold mb-1">Craft, not fuss</h3>
<p className="text-sm text-neutral-400">Simple techniques, solid ingredients, consistent heat. That’s the whole trick.</p>
</div>
</div>
<div className="mt-8 rounded-3xl overflow-hidden ring-1 ring-neutral-800">
<img src="https://images.unsplash.com/photo-1551218808-94e220e084d2?q=80&w=1600" alt="Kitchen" className="w-full h-64 object-cover"/>
</div>
</div>
</section>
);
}