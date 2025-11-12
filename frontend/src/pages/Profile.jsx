// frontend/src/pages/Profile.jsx
import React, { useEffect, useRef, useState } from "react";
import {
  apiProfile,
  apiProfileUpdate,
  apiProfileAvatar,
  apiChangePassword,
  apiBase,
} from "../lib/api";
import { Link } from "react-router-dom";

const okAlert = (m) => window.alert(m);
const errorAlert = (m) => window.alert(m);

const EditIcon = (props) => (
  <svg viewBox="0 0 24 24" className={`h-4 w-4 ${props.className || ""}`} fill="currentColor" aria-hidden="true">
    <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25Zm17.71-10.04a1.001 1.001 0 0 0 0-1.42l-2.5-2.5a1.001 1.001 0 0 0-1.42 0l-1.83 1.83 3.75 3.75 1.99-1.66Z"/>
  </svg>
);

const CheckIcon = (props) => (
  <svg viewBox="0 0 24 24" className={`h-4 w-4 ${props.className || ""}`} fill="currentColor" aria-hidden="true">
    <path d="M9 16.17 4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
  </svg>
);

const XIcon = (props) => (
  <svg viewBox="0 0 24 24" className={`h-4 w-4 ${props.className || ""}`} fill="currentColor" aria-hidden="true">
    <path d="M18.3 5.71 12 12l6.3 6.29-1.41 1.42L10.59 13.41 4.29 19.71 2.88 18.3 9.17 12 2.88 5.71 4.29 4.29 10.59 10.59 16.89 4.29z"/>
  </svg>
);

// helper: turn /storage/... into absolute URL using your API base
function toAbsUrl(u) {
  if (!u) return "";
  return u.startsWith("/") ? `${apiBase}${u}` : u;
}

export default function Profile() {
  const [loading, setLoading] = useState(true);
  const [me, setMe] = useState(null);

  const [preview, setPreview] = useState(null);
  const fileRef = useRef(null);

  // inline edit state per key: { key: "value being edited" }
  const [editing, setEditing] = useState({});

  // password form
  const [pwd, setPwd] = useState({
    current_password: "",
    new_password: "",
    new_password_confirmation: "",
  });

  useEffect(() => {
    (async () => {
      try {
        const { user } = await apiProfile();
        setMe(user);
      } catch (e) {
        errorAlert(e.message || "Failed to load profile");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const onPickAvatar = (e) => {
    const f = e.target.files?.[0];
    if (!f) return;
    const url = URL.createObjectURL(f);
    setPreview({ file: f, url });
  };

  const saveAvatar = async () => {
    if (!preview?.file) return;
    try {
      await apiProfileAvatar(preview.file);
      // refresh user to get new avatar_url
      const { user } = await apiProfile();
      setMe(user);
      setPreview(null);
      okAlert("Avatar updated");
    } catch (e) {
      errorAlert(e.message || "Avatar update failed");
    }
  };

  // start editing a single key
  const startEdit = (key) => {
    setEditing((s) => ({ ...s, [key]: me?.[key] ?? "" }));
  };
  const cancelEdit = (key) => {
    setEditing((s) => {
      const next = { ...s };
      delete next[key];
      return next;
    });
  };

  const commitEdit = async (key) => {
    try {
      const newVal = editing[key] ?? null;

      // optimistic UI update
      setMe((prev) => ({ ...prev, [key]: newVal }));

      // send only the changed field
      const { user } = await apiProfileUpdate({ [key]: newVal });

      // ensure state matches server (important if backend normalizes)
      setMe(user);
      cancelEdit(key);
      okAlert("Profile saved");
    } catch (e) {
      // revert optimistic update by refetching
      try {
        const { user } = await apiProfile();
        setMe(user);
      } catch {}
      errorAlert(e.message || "Save failed");
    }
  };

  const changePassword = async (e) => {
    e.preventDefault();

    if (!pwd.current_password) {
      return errorAlert("Current password is required");
    }
    if (!pwd.new_password || !pwd.new_password_confirmation) {
      return errorAlert("Please fill new password and repeat new password");
    }
    if (pwd.new_password !== pwd.new_password_confirmation) {
      return errorAlert("New passwords do not match");
    }

    try {
      await apiChangePassword(pwd); // server verifies current password
      setPwd({ current_password: "", new_password: "", new_password_confirmation: "" });
      okAlert("Password updated");
    } catch (e) {
      // Will show "Current password is incorrect" if backend returned that
      errorAlert(e.message || "Password update failed");
    }
  };

  const renderRow = (label, key, placeholder = "-") => {
    const isEditing = Object.prototype.hasOwnProperty.call(editing, key);
    const value = me?.[key];
    const showValue =
      value !== null && value !== undefined && String(value).trim() !== "" ? value : null;

    return (
      <div className="grid grid-cols-3 gap-3 items-center py-2 border-b border-neutral-800 last:border-none">
        <div className="text-sm text-neutral-400">{label}</div>
        <div className="col-span-2 flex items-center gap-2">
          {isEditing ? (
            <>
              <input
                className="flex-1 rounded-xl bg-neutral-950 px-3 py-2 ring-1 ring-neutral-700 focus:ring-emerald-500/60"
                value={editing[key] ?? ""}
                onChange={(e) => setEditing((s) => ({ ...s, [key]: e.target.value }))}
              />
              <button
                onClick={() => commitEdit(key)}
                className="rounded-lg ring-1 ring-emerald-500/40 bg-emerald-500/20 px-2 py-1 text-emerald-300 hover:bg-emerald-500/30"
                title="Save"
                aria-label={`Save ${label}`}
              >
                <CheckIcon />
              </button>
              <button
                onClick={() => cancelEdit(key)}
                className="rounded-lg ring-1 ring-neutral-700 px-2 py-1 hover:bg-neutral-800"
                title="Cancel"
                aria-label={`Cancel ${label}`}
              >
                <XIcon />
              </button>
            </>
          ) : (
            <>
              <div className="flex-1 truncate text-neutral-200">
                {showValue ? showValue : <span className="text-neutral-500">{placeholder}</span>}
              </div>
              <button
                onClick={() => startEdit(key)}
                className="rounded-lg ring-1 ring-neutral-700 px-2 py-1 hover:bg-neutral-800"
                title="Edit"
                aria-label={`Edit ${label}`}
              >
                <EditIcon />
              </button>
            </>
          )}
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <section className="py-12">
        <div className="mx-auto max-w-2xl text-neutral-400">Loading…</div>
      </section>
    );
  }

  return (
    <section className="py-10">
      <div className="mx-auto max-w-3xl space-y-8">
        {/* Header card: avatar + actions */}
        <div className="rounded-3xl bg-neutral-900 p-6 ring-1 ring-neutral-800">
          <h2 className="text-lg font-semibold mb-4">Profile Picture</h2>
          <div className="flex items-center gap-4">
            <div className="h-20 w-20 overflow-hidden rounded-full ring-1 ring-neutral-700 bg-neutral-800">
              {preview?.url ? (
                <img src={preview.url} alt="preview" className="h-full w-full object-cover" />
              ) : me?.avatar_url ? (
                <img src={toAbsUrl(me.avatar_url)} alt="avatar" className="h-full w-full object-cover" />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-neutral-400 text-sm">
                  No avatar
                </div>
              )}
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => fileRef.current?.click()}
                className="rounded-2xl px-4 py-2 ring-1 ring-neutral-700 hover:bg-neutral-800"
              >
                Choose file
              </button>
              <input
                ref={fileRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={onPickAvatar}
              />
              <button
                onClick={saveAvatar}
                disabled={!preview}
                className="rounded-2xl bg-emerald-500/20 px-4 py-2 text-emerald-300 ring-1 ring-emerald-500/40 hover:bg-emerald-500/30 disabled:opacity-60"
              >
                Save avatar
              </button>
              {preview && (
                <button
                  onClick={() => setPreview(null)}
                  className="rounded-2xl px-4 py-2 ring-1 ring-neutral-700 hover:bg-neutral-800"
                >
                  Cancel
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Read-only details with inline edit */}
        <div className="rounded-3xl bg-neutral-900 p-6 ring-1 ring-neutral-800">
          <h2 className="text-lg font-semibold mb-2">Details</h2>

          {renderRow("Name", "name")}
          {renderRow("Username", "username")}
          {renderRow("Email", "email")}
          {renderRow("Home address", "home_address")}
          {renderRow("Street", "street")}
          {renderRow("City", "city")}
          {renderRow("Region", "region")}
          {renderRow("Country", "country")}
        </div>

        {/* Password */}
        <form onSubmit={changePassword} className="rounded-3xl bg-neutral-900 p-6 ring-1 ring-neutral-800 space-y-4">
          <h2 className="text-lg font-semibold">Change Password</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <label className="text-sm text-neutral-400">Current password</label>
              <input
                type="password"
                className="mt-1 w-full rounded-xl bg-neutral-950 px-3 py-2 ring-1 ring-neutral-700 focus:ring-emerald-500/60"
                value={pwd.current_password}
                onChange={(e) => setPwd({ ...pwd, current_password: e.target.value })}
                autoComplete="current-password"
              />
            </div>
            <div>
              <label className="text-sm text-neutral-400">New password</label>
              <input
                type="password"
                className="mt-1 w-full rounded-xl bg-neutral-950 px-3 py-2 ring-1 ring-neutral-700 focus:ring-emerald-500/60"
                value={pwd.new_password}
                onChange={(e) => setPwd({ ...pwd, new_password: e.target.value })}
                autoComplete="new-password"
              />
            </div>
            <div>
              <label className="text-sm text-neutral-400">Repeat new password</label>
              <input
                type="password"
                className="mt-1 w-full rounded-xl bg-neutral-950 px-3 py-2 ring-1 ring-neutral-700 focus:ring-emerald-500/60"
                value={pwd.new_password_confirmation}
                onChange={(e) => setPwd({ ...pwd, new_password_confirmation: e.target.value })}
                autoComplete="new-password"
              />
            </div>
          </div>
          <div>
            <button
              type="submit"
              className="rounded-2xl bg-emerald-500/20 px-4 py-2 text-emerald-300 ring-1 ring-emerald-500/40 hover:bg-emerald-500/30"
            >
              Update password
            </button>
          </div>
        </form>

        {/* Optional link to Orders page */}
        <div className="text-sm text-neutral-400">
          Manage your purchases on the{" "}
          <Link to="/orders" className="text-emerald-300 hover:underline">
            Orders
          </Link>{" "}
          page.
        </div>
      </div>
    </section>
  );
}
