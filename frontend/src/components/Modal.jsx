import React from "react";


export default function Modal({ open, onClose, children }) {
if (!open) return null;
return (
<div className="fixed inset-0 z-[60] flex items-center justify-center">
<div onClick={onClose} className="absolute inset-0 bg-black/60" />
<div className="relative z-[61] w-full max-w-lg rounded-3xl bg-neutral-950 p-5 ring-1 ring-neutral-800">
<button onClick={onClose} aria-label="Close" className="absolute right-3 top-3 rounded-full px-2 py-1 ring-1 ring-neutral-700 hover:bg-neutral-900">×</button>
{children}
</div>
</div>
);
}