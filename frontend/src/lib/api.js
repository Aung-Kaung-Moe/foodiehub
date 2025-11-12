// frontend/src/lib/api.js

// Base URL for Laravel backend; set in frontend/.env as:
// VITE_API_URL=http://localhost:8000
const API = (import.meta.env.VITE_API_URL || "").replace(/\/+$/, "");

// --- cookie utils ---
function getCookie(name) {
  const m = document.cookie.match(
    new RegExp('(?:^|; )' + name.replace(/[$()*+./?[\\\]^{|}]/g, '\\$&') + '=([^;]*)')
  );
  return m ? decodeURIComponent(m[1]) : null;
}

// MUST be called before state-changing requests so Sanctum seeds XSRF-TOKEN
export async function csrf() {
  if (!API) {
    console.error("VITE_API_URL is not set. Create frontend/.env with VITE_API_URL=http://localhost:8000");
    throw new Error("API base URL not configured");
  }
  await fetch(`${API}/sanctum/csrf-cookie`, {
    credentials: "include",
    headers: {
      "X-Requested-With": "XMLHttpRequest",
      Accept: "application/json",
    },
  });
}

// Extract a user-friendly message from Laravel error responses
function extractErrorMessage(data, status) {
  let msg = (data && (data.message || data.error)) || `HTTP ${status}`;
  if (data && data.errors && typeof data.errors === "object") {
    const firstKey = Object.keys(data.errors)[0];
    if (firstKey && Array.isArray(data.errors[firstKey]) && data.errors[firstKey][0]) {
      msg = data.errors[firstKey][0];
    }
  }
  return msg;
}

// tolerant request helper: handles 204, non-JSON text, and surfaces server errors
async function request(method, path, body) {
  if (!API) {
    console.error("VITE_API_URL is not set. Create frontend/.env with VITE_API_URL=http://localhost:8000");
    throw new Error("API base URL not configured");
  }

  const headers = {
    "Content-Type": "application/json",
    Accept: "application/json",
    "X-Requested-With": "XMLHttpRequest",
  };

  // Attach CSRF header if present (Sanctum expects it with cookie auth)
  const xsrf = getCookie("XSRF-TOKEN");
  if (xsrf) headers["X-XSRF-TOKEN"] = xsrf;

  const res = await fetch(`${API}${path}`, {
    method,
    credentials: "include",
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });

  const ct = res.headers.get("content-type") || "";
  const isJson = ct.includes("application/json");

  let data;
  if (res.status === 204) {
    data = {};
  } else if (isJson) {
    try {
      data = await res.json();
    } catch {
      data = {};
    }
  } else {
    // Successful but non-JSON (e.g., misconfigured endpoint returning HTML)
    const text = await res.text().catch(() => "");
    if (!res.ok) throw new Error(text || `HTTP ${res.status}`);
    data = {};
  }

  if (!res.ok) {
    throw new Error(extractErrorMessage(data, res.status));
  }

  return data || {};
}

// Special: multipart/form-data upload (do not set Content-Type manually)
async function requestForm(path, formData) {
  if (!API) throw new Error("API base URL not configured");

  const headers = {
    Accept: "application/json",
    "X-Requested-With": "XMLHttpRequest",
  };
  const xsrf = getCookie("XSRF-TOKEN");
  if (xsrf) headers["X-XSRF-TOKEN"] = xsrf;

  const res = await fetch(`${API}${path}`, {
    method: "POST",
    credentials: "include",
    headers, // IMPORTANT: no 'Content-Type' here; browser sets boundary
    body: formData,
  });

  const ct = res.headers.get("content-type") || "";
  const isJson = ct.includes("application/json");
  const data = isJson ? await res.json().catch(() => ({})) : {};

  if (!res.ok) {
    throw new Error(extractErrorMessage(data, res.status));
  }
  return data || {};
}

// --- public API ---
export async function apiRegister({ username, email, password }) {
  await csrf();
  return request("POST", "/api/register", { username, email, password });
}

export async function apiLogin({ identifier, password }) {
  await csrf();
  return request("POST", "/api/login", { identifier, password });
}

export async function apiLogout() {
  await csrf();
  return request("POST", "/api/logout");
}

export function apiMe() {
  return request("GET", "/api/me");
}

// --- profile endpoints ---
export function apiProfile() {
  return request("GET", "/api/profile");
}

export async function apiProfileUpdate(payload) {
  await csrf();
  return request("PUT", "/api/profile", payload);
}

export async function apiProfileAvatar(file) {
  await csrf();
  const fd = new FormData();
  fd.append("avatar", file);
  return requestForm("/api/profile/avatar", fd);
}

// Accepts: { current_password, new_password, new_password_confirmation }
export async function apiChangePassword({ current_password, new_password, new_password_confirmation }) {
  await csrf();
  return request("PUT", "/api/profile/password", {
    current_password,
    new_password,
    new_password_confirmation,
  });
}
// Cart APIs
export function apiCart() {
  return request("GET", "/api/cart");
}

export async function apiCartAddItem({ product_id, name, price, quantity = 1, image_url }) {
  await csrf();
  return request("POST", "/api/cart/items", { product_id, name, price, quantity, image_url });
}

export async function apiCartRemoveItem(itemId) {
  await csrf();
  return request("DELETE", `/api/cart/items/${itemId}`);
}

export async function apiCartSetTransport(transport) {
  await csrf();
  return request("PUT", "/api/cart/transport", { transport });
}

export async function apiCartCheckout() {
  await csrf();
  return request("POST", "/api/cart/checkout");
}


// optionally export base for debugging / building absolute URLs
export const apiBase = API;
