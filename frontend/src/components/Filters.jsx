import React from "react";


export default function Filters({ category, setCategory, sortBy, setSortBy, popular, setPopular }) {
const Button = ({ value, label }) => (
<button
onClick={() => setCategory(value)}
className={`rounded-2xl px-4 py-2 ring-1 ring-neutral-700 hover:ring-emerald-500/60 hover:text-emerald-300 ${
category === value ? "bg-emerald-500/10 text-emerald-300 ring-emerald-500/40" : "bg-neutral-900"
}`}
>
{label}
</button>
);


return (
<div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
<div className="flex flex-wrap gap-2">
<Button value="all" label="All" />
<Button value="burger" label="Burgers" />
<Button value="pizza" label="Pizzas" />
<Button value="drink" label="Drinks" />
<Button value="dessert" label="Desserts" />
</div>


<div className="flex flex-wrap items-center gap-3">
<label className="text-sm text-neutral-400">Sort by price</label>
<select
className="rounded-xl bg-neutral-900 px-3 py-2 ring-1 ring-neutral-700 hover:ring-emerald-500/60"
value={sortBy}
onChange={(e) => setSortBy(e.target.value)}
>
<option value="price-asc">Lowest → Highest</option>
<option value="price-desc">Highest → Lowest</option>
</select>


<label className="text-sm text-neutral-400 ml-2">Most popular</label>
<select
className="rounded-xl bg-neutral-900 px-3 py-2 ring-1 ring-neutral-700 hover:ring-emerald-500/60"
value={popular}
onChange={(e) => setPopular(e.target.value)}
>
<option value="all">All</option>
<option value="top10">Top 10%</option>
<option value="top20">Top 20%</option>
</select>
</div>
</div>
);
}