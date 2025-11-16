// src/components/HeroSlider.jsx
import React, { useEffect, useRef, useState } from "react";

const slides = [
  {
    title: "Juicy Smash Burgers",
    subtitle: "Crispy edges, melty cheese.",
    img: "https://images.unsplash.com/photo-1550547660-d9450f859349?q=80&w=1600",
  },
  {
    title: "Wood-Fired Pizzas",
    subtitle: "Leopard-spotted crusts.",
    img: "https://images.unsplash.com/photo-1548365328-9f547fb095de?q=80&w=1600",
  },
  {
    title: "Refreshing Smoothies",
    subtitle: "Real fruit. No fluff.",
    img: "https://images.unsplash.com/photo-1490474418585-ba9bad8fd0ea?q=80&w=1600",
  },
  {
    title: "Iced Coffee Rituals",
    subtitle: "Silky & bold.",
    img: "https://images.unsplash.com/photo-1517705008128-361805f42e86?q=80&w=1600",
  },
  {
    title: "Decadent Desserts",
    subtitle: "End on a high note.",
    img: "https://images.unsplash.com/photo-1606313564200-e75d5e30476c?q=80&w=1600",
  },
];

export default function HeroSlider() {
  const [index, setIndex] = useState(0);
  const timer = useRef(null);

  const next = () => setIndex((i) => (i + 1) % slides.length);
  const prev = () => setIndex((i) => (i - 1 + slides.length) % slides.length);

  useEffect(() => {
    // reset auto timer whenever index changes
    if (timer.current) clearInterval(timer.current);

    timer.current = setInterval(() => {
      setIndex((i) => (i + 1) % slides.length);
    }, 3000);

    return () => clearInterval(timer.current);
  }, [index]);

  return (
    <div className="relative mx-auto h-[400px] w-4/5 overflow-hidden rounded-3xl ring-1 ring-neutral-800 shadow-2xl">
      {slides.map((s, i) => (
        <Slide key={i} s={s} active={i === index} />
      ))}

      {/* Modern glass buttons */}
      <button
        aria-label="Previous slide"
        onClick={prev}
        className="absolute left-3 top-1/2 -translate-y-1/2 rounded-full bg-white/20 backdrop-blur-md px-4 py-2 text-white text-lg font-bold shadow-lg hover:bg-white/30 transition"
      >
        ❮
      </button>
      <button
        aria-label="Next slide"
        onClick={next}
        className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full bg-white/20 backdrop-blur-md px-4 py-2 text-white text-lg font-bold shadow-lg hover:bg-white/30 transition"
      >
        ❯
      </button>

      {/* Modern dots */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
        {slides.map((_, i) => (
          <span
            key={i}
            onClick={() => setIndex(i)}
            className={`h-3 w-3 rounded-full cursor-pointer transition-all ${
              i === index
                ? "bg-emerald-400 scale-110 shadow-[0_0_8px_rgba(16,185,129,0.8)]"
                : "bg-neutral-500 hover:bg-neutral-400"
            }`}
          />
        ))}
      </div>
    </div>
  );
}

function Slide({ s, active }) {
  return (
    <div
      className={`absolute inset-0 transition-opacity duration-700 ${
        active ? "opacity-100" : "opacity-0"
      }`}
    >
      <img
        src={s.img}
        alt={s.title}
        className="h-full w-full object-cover scale-105"
        loading="eager"
      />

      {/* Enhanced modern gradient */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

      <div className="absolute bottom-10 left-10 drop-shadow-lg">
        <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight text-white">
          {s.title}
        </h2>
        <p className="mt-1 text-neutral-200 text-lg">{s.subtitle}</p>
      </div>
    </div>
  );
}
