import React, { useMemo, useState, useEffect } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import Navbar from "./components/Navbar.jsx";
import HeroSlider from "./components/HeroSlider.jsx";
import Filters from "./components/Filters.jsx";
import FoodGrid from "./components/FoodGrid.jsx";
import Footer from "./components/Footer.jsx";
import Modal from "./components/Modal.jsx";
import Toast from "./components/Toast.jsx";
import About from "./pages/About.jsx";
import Profile from "./pages/Profile.jsx";
import Contact from "./pages/Contact.jsx";
import Auth from "./pages/Auth.jsx";
import Cart from "./pages/Cart.jsx";
import { foods as ALL_ITEMS } from "./data/foods.js";
import { apiLogout, apiMe, apiCartAddItem } from "./lib/api";

export default function App() {
  const navigate = useNavigate();

  const [category, setCategory] = useState("all");
  const [sortBy, setSortBy] = useState("price-asc");
  const [popular, setPopular] = useState("all");
  const [selected, setSelected] = useState(null);
  const [toast, setToast] = useState(null);
  const [user, setUser] = useState(null);

  useEffect(() => {
    apiMe()
      .then(({ user }) => setUser(user))
      .catch(() => {});
  }, []);

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

  const handleLogin = (userObj) => {
    setUser(userObj);
    navigate("/");
  };

  const handleLogout = async () => {
    try {
      await apiLogout();
    } catch (e) {
      // ignore
    }
    setUser(null);
    navigate("/");
  };

  const showToast = (message) => {
    setToast({ message });
    window.clearTimeout(showToast._timer);
    showToast._timer = window.setTimeout(() => setToast(null), 2500);
  };

  const handleAddToCart = async (item) => {
    if (!item) return;

    if (!user) {
      navigate("/login");
      return;
    }

    try {
      const res = await apiCartAddItem({
        product_id: item.id,
        name: item.name,
        price: item.price,
        quantity: 1,
        image_url: item.img,
      });

      const msg =
        (res && (res.message || res.msg || res.status)) ||
        "Item Added successfully";
      showToast(msg);
    } catch (e) {
      showToast("Item Added successfully");
    }
  };

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100">
      <Navbar user={user} onLogout={handleLogout} />
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
                  />
                </section>
              </>
            }
          />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          {/* 🔥 pass showToast into Profile */}
          <Route path="/profile" element={<Profile showToast={showToast} />} />
          <Route path="/login" element={<Auth onLogin={handleLogin} />} />
          <Route path="/register" element={<Auth onLogin={handleLogin} />} />
          <Route path="/cart" element={<Cart />} />
        </Routes>
      </main>
      <Footer />

      {/* Item details modal + Add to cart button */}
      <Modal open={!!selected} onClose={() => setSelected(null)}>
        {selected && (
          <div className="space-y-4">
            <div className="flex gap-4">
              <img
                src={
                  selected.img ||
                  "https://picsum.photos/seed/foodiehub/600/400"
                }
                alt={selected.name}
                className="h-40 w-40 rounded-2xl object-cover"
              />
              <div className="flex flex-1 flex-col justify-between">
                <div>
                  <h2 className="text-xl font-semibold tracking-tight">
                    {selected.name}
                  </h2>
                  <p className="text-sm text-neutral-400 capitalize">
                    {selected.category}
                  </p>
                </div>
                <div className="mt-2 text-lg font-semibold">
                  ${Number(selected.price).toFixed(2)}
                </div>
              </div>
            </div>
            <p className="text-neutral-300">{selected.description}</p>
            <p className="text-sm text-neutral-400">
              Special ingredients:{" "}
              <span className="text-neutral-200">
                {selected.ingredients.join(", ")}
              </span>
            </p>

            <button
              onClick={() => handleAddToCart(selected)}
              className="mt-4 w-full rounded-2xl bg-emerald-500/20 px-4 py-2 text-sm font-semibold text-emerald-200 ring-1 ring-emerald-500/40 hover:bg-emerald-500/30"
            >
              Add item to cart
            </button>
          </div>
        )}
      </Modal>

      {toast && <Toast message={toast.message} />}
    </div>
  );
}
