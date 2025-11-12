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
    // auto-advance every 3 seconds
    timer.current = setInterval(() => {
      setIndex((i) => (i + 1) % slides.length);
    }, 3000);
    return () => clearInterval(timer.current);
  }, []);

  return (
    <div className="relative mx-auto h-[400px] w-4/5 overflow-hidden rounded-3xl ring-1 ring-neutral-800 shadow-2xl">
      {slides.map((s, i) => (
        <Slide key={i} s={s} active={i === index} />
      ))}

      {/* Controls */}
      <button
        aria-label="Previous slide"
        onClick={prev}
        className="absolute left-3 top-1/2 -translate-y-1/2 rounded-full bg-neutral-900/60 backdrop-blur px-3 py-2 ring-1 ring-neutral-700 hover:bg-neutral-800"
      >
        &lt;
      </button>
      <button
        aria-label="Next slide"
        onClick={next}
        className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full bg-neutral-900/60 backdrop-blur px-3 py-2 ring-1 ring-neutral-700 hover:bg-neutral-800"
      >
        &gt;
      </button>

      {/* Dots */}
      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-2">
        {slides.map((_, i) => (
          <span
            key={i}
            onClick={() => setIndex(i)}
            className={`h-2 w-2 rounded-full cursor-pointer ${
              i === index ? "bg-emerald-400" : "bg-neutral-600"
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
        className="h-full w-full object-cover"
        loading="eager"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
      <div className="absolute bottom-8 left-8">
        <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight">
          {s.title}
        </h2>
        <p className="text-neutral-300">{s.subtitle}</p>
      </div>
    </div>
  );
}
