import React from "react";


export default function Toast({ message }) {
return (
<div className="fixed right-4 top-4 z-[70] animate-[fadeIn_0.2s_ease-out]">
<div className="rounded-2xl bg-neutral-900 px-4 py-3 text-sm ring-1 ring-emerald-500/40">
<span className="mr-2">✅</span>{message}
</div>
<style>{`@keyframes fadeIn { from { opacity: 0; transform: translateY(-6px); } to { opacity: 1; transform: translateY(0); } }`}</style>
</div>
);
}