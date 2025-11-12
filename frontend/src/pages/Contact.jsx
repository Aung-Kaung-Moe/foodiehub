import React from "react";

export default function Contact() {
  return (
    <section className="py-12">
      <div className="mx-auto max-w-6xl grid gap-8 md:grid-cols-2">
        {/* Map */}
        <div className="rounded-3xl overflow-hidden ring-1 ring-neutral-800">
          <iframe
            title="FoodieHub Yangon"
            src="https://www.google.com/maps?q=Yangon%2C%20Myanmar&output=embed"
            className="h-[360px] w-full border-0"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          ></iframe>
          <div className="p-4 flex items-center gap-2">
            <Stars />
            <span className="text-sm text-neutral-400">4.0 • 1,248 reviews</span>
          </div>
        </div>

        {/* Form */}
        <form className="rounded-3xl bg-neutral-900 p-6 ring-1 ring-neutral-800 space-y-4">
          <h2 className="text-2xl font-bold">Contact Us</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="text-sm text-neutral-400">Customer Name</label>
              <input className="mt-1 w-full rounded-xl bg-neutral-950 px-3 py-2 ring-1 ring-neutral-700 focus:ring-emerald-500/60" placeholder="Your full name" />
            </div>
            <div>
              <label className="text-sm text-neutral-400">Phone Number</label>
              <input className="mt-1 w-full rounded-xl bg-neutral-950 px-3 py-2 ring-1 ring-neutral-700 focus:ring-emerald-500/60" placeholder="09 xxxx xxxx" />
            </div>
            <div className="sm:col-span-2">
              <label className="text-sm text-neutral-400">Address</label>
              <input className="mt-1 w-full rounded-xl bg-neutral-950 px-3 py-2 ring-1 ring-neutral-700 focus:ring-emerald-500/60" placeholder="Street, Township, City" />
            </div>
            <div className="sm:col-span-2">
              <label className="text-sm text-neutral-400">Feedback</label>
              <textarea rows={4} className="mt-1 w-full rounded-xl bg-neutral-950 px-3 py-2 ring-1 ring-neutral-700 focus:ring-emerald-500/60" placeholder="Tell us anything…" />
            </div>
          </div>
          <button type="submit" className="rounded-2xl bg-emerald-500/20 px-4 py-2 text-emerald-300 ring-1 ring-emerald-500/40 hover:bg-emerald-500/30">
            Submit
          </button>
        </form>
      </div>
    </section>
  );
}

function Stars() {
  return (
    <div className="flex items-center">
      {Array.from({ length: 5 }).map((_, i) => (
        <svg key={i} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill={i < 4 ? "#facc15" : "#3f3f46"} className="h-5 w-5">
          <path d="M12 .587l3.668 7.431 8.2 1.192-5.934 5.783 1.401 8.168L12 18.896l-7.335 3.865 1.401-8.168L.132 9.21l8.2-1.192z"/>
        </svg>
      ))}
    </div>
  );
}
