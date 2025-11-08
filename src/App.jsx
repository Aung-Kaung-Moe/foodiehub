import React, { useMemo, useState } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import Navbar from "./components/Navbar.jsx";
import HeroSlider from "./components/HeroSlider.jsx";
import Filters from "./components/Filters.jsx";
import FoodGrid from "./components/FoodGrid.jsx";
import Footer from "./components/Footer.jsx";
import Modal from "./components/Modal.jsx";
import Toast from "./components/Toast.jsx";
import CartDrawer from "./components/CartDrawer.jsx";
import About from "./pages/About.jsx";
import Contact from "./pages/Contact.jsx";
import Auth from "./pages/Auth.jsx";
import { foods as ALL_ITEMS } from "./data/foods.js";

export default function App() {
  const navigate = useNavigate();
  const [category, setCategory] = useState("all");
  const [sortBy, setSortBy] = useState("price-asc");
  const [popular, setPopular] = useState("all");

  const [selected, setSelected] = useState(null); // preview modal
  const [toast, setToast] = useState(null);       // { id, message }
  const [user, setUser] = useState(null);         // { username }
  const [cartOpen, setCartOpen] = useState(false);
  const [cart, setCart] = useState([]);

  const filtered = useMemo(() => {
    let list = [...ALL_ITEMS];
    if (category !== "all") list = list.filter((i) => i.category === category);
    if (popular !== "all") {
      const threshold = popular === "top10" ? 90 : 80;
      list = list.filter((i) => i.popularity >= threshold);
    }
    if (sortBy === "price-asc") list.sort((a, b) => a.price - b.price);
    else if (sortBy === "price-desc") list.sort((a, b) => b.price - a.price);
    return list;
  }, [category, sortBy, popular]);

  const handleAddToCart = (item) => {
    if (!user) {
      setToast({ id: Date.now(), message: "Please log in" });
      setTimeout(() => setToast(null), 2200);
      return;
    }
    setCart((prev) => [...prev, item]);
    setToast({ id: Date.now(), message: `${item.name} — Item added successfully` });
    setTimeout(() => setToast(null), 1800);
  };

  const handleLogin = (username) => {
    setUser({ username });
    navigate("/");
  };

  const handleLogout = () => {
    setUser(null);
    setCart([]);
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100">
      <Navbar onOpenCart={() => setCartOpen(true)} user={user} onLogout={handleLogout} />

      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Routes>
          <Route
            path="/"
            element={
              <>
                <section className="pt-8">
                  <HeroSlider />
                </section>

                <section className="mt-10">
                  <Filters
                    category={category}
                    setCategory={setCategory}
                    sortBy={sortBy}
                    setSortBy={setSortBy}
                    popular={popular}
                    setPopular={setPopular}
                  />
                </section>

                <section className="mt-6 mb-16">
                  <FoodGrid
                    items={filtered}
                    onPreview={(it) => setSelected(it)}
                    onAdd={handleAddToCart}
                  />
                </section>
              </>
            }
          />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/login" element={<Auth onLogin={handleLogin} />} />
        </Routes>
      </main>

      <Footer />

      {/* Modal & Toast */}
      <Modal open={!!selected} onClose={() => setSelected(null)}>
        {selected && (
          <div className="space-y-3">
            <img
              src={selected.img}
              alt={selected.name}
              className="h-48 w-full object-cover rounded-xl"
            />
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-xl font-bold">{selected.name}</h3>
                <p className="text-sm text-neutral-400 capitalize">{selected.category}</p>
              </div>
              <div className="font-semibold">${Number(selected.price).toFixed(2)}</div>
            </div>
            <p className="text-neutral-300">{selected.description}</p>
            <p className="text-sm text-neutral-400">
              Special ingredients:{" "}
              <span className="text-neutral-200">{selected.ingredients.join(", ")}</span>
            </p>
            <div className="pt-2">
              <button
                onClick={() => {
                  handleAddToCart(selected);
                  setSelected(null);
                }}
                className="w-full rounded-2xl bg-emerald-500/20 px-4 py-2 text-emerald-300 ring-1 ring-emerald-500/40 hover:bg-emerald-500/30"
              >
                Add to cart
              </button>
            </div>
          </div>
        )}
      </Modal>

      <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} items={cart} />

      {toast && <Toast message={toast.message} />}
    </div>
  );
}
