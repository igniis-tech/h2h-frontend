

// // src/api.js
// export const API_BASE = (import.meta.env.VITE_API_BASE || "http://127.0.0.1:8000/api/").replace(/\/+$/, "");

// // --------- tiny utils ----------
// function withTimeout(promise, ms = 12000) {
//   let t;
//   return Promise.race([
//     promise.finally(() => clearTimeout(t)),
//     new Promise((_, rej) => (t = setTimeout(() => rej(new Error("Request timeout")), ms))),
//   ]);
// }

// function getCookie(name) {
//   if (typeof document === "undefined") return null;
//   const m = document.cookie.match(new RegExp("(^|; )" + name + "=([^;]*)"));
//   return m ? decodeURIComponent(m[2]) : null;
// }

// // Ensure csrftoken cookie exists (your /health/ has @ensure_csrf_cookie)
// async function ensureCsrfCookie() {
//   let token = getCookie("csrftoken");
//   if (token) return token;
//   await withTimeout(fetch(`${API_BASE}/health/`, { credentials: "include" }), 8000);
//   token = getCookie("csrftoken");
//   return token;
// }

// // Compose headers for unsafe methods (POST/PUT/DELETE)
// async function csrfHeaders(extra = {}) {
//   const token = await ensureCsrfCookie();
//   return {
//     "Content-Type": "application/json",
//     ...(token ? { "X-CSRFToken": token } : {}),
//     ...extra,
//   };
// }

// // --------------- SSO ----------------
// export async function startSSO() {
//   const state = Math.random().toString(36).slice(2);
//   sessionStorage.setItem("sso_state", state);
//   const url = `${API_BASE}/auth/sso/authorize?state=${encodeURIComponent(state)}`;
//   try {
//     const res = await withTimeout(fetch(url, { method: "GET", credentials: "include" }), 10000);
//     if (!res.ok) { window.location.href = url; return; }
//     const data = await res.json().catch(() => ({}));
//     window.location.href = data?.authorization_url || url;
//   } catch {
//     window.location.href = url;
//   }
// }

// /**
//  * Keep the normalized return your AuthCallback expects
//  * AND persist to both storages as requested.
//  */
// export async function exchangeCodeForToken({ code, state }) {
//   const url = new URL(`${API_BASE}/auth/sso/callback`);
//   if (code) url.searchParams.set("code", code);
//   if (state) url.searchParams.set("state", state);

//   const res = await withTimeout(fetch(url.toString(), {
//     method: "GET",
//     credentials: "include",
//     headers: { Accept: "application/json" },
//   }), 12000);

//   if (!res.ok) {
//     const text = await res.text().catch(() => "");
//     throw new Error(`SSO callback failed: ${res.status} ${text}`);
//   }

//   const payload = await res.json();

//   // Normalize
//   const access_token = payload?.tokens?.access_token || null;
//   const id_token = payload?.tokens?.id_token || null;
//   const user_info = payload?.claims || payload?.user || null;

//   // Persist in BOTH storages (as you requested)
//   try { localStorage.setItem("user_info", JSON.stringify(user_info)); } catch {}
//   try { sessionStorage.setItem("user_info", JSON.stringify(user_info)); } catch {}
//   try { if (access_token) localStorage.setItem("jwt", access_token); } catch {}
//   try { if (access_token) sessionStorage.setItem("jwt", access_token); } catch {}

//   return { access_token, id_token, user_info, raw: payload };
// }

// // -------- Booking flow APIs --------
// export async function checkAvailability({ event_id, property_id, unit_type_id, category, package_id }) {
//   const url = new URL(`${API_BASE}/inventory/availability`);
//   url.searchParams.set("event_id", event_id);
//   url.searchParams.set("property_id", property_id);
//   url.searchParams.set("unit_type_id", unit_type_id);
//   if (category) url.searchParams.set("category", category);
//   if (package_id) url.searchParams.set("package_id", package_id);

//   const res = await withTimeout(fetch(url.toString(), { credentials: "include" }), 10000);
//   if (!res.ok) throw new Error("Availability failed");

//   const data = await res.json();
//   try { localStorage.setItem("last_availability", JSON.stringify(data)); } catch {}
//   try { sessionStorage.setItem("last_availability", JSON.stringify(data)); } catch {}
//   return data;
// }

// export async function validatePromo({ code, package_id, amount_inr }) {
//   const url = new URL(`${API_BASE}/promocodes/validate`);
//   url.searchParams.set("code", code);
//   if (package_id) url.searchParams.set("package_id", package_id);
//   if (amount_inr != null) url.searchParams.set("amount_inr", amount_inr);

//   const res = await withTimeout(fetch(url.toString(), { credentials: "include" }), 10000);
//   if (!res.ok) throw new Error("Promo validate failed");

//   const data = await res.json();
//   try { localStorage.setItem("last_promo", JSON.stringify(data)); } catch {}
//   try { sessionStorage.setItem("last_promo", JSON.stringify(data)); } catch {}
//   return data;
// }

// export async function createBooking(payload) {
//   const headers = await csrfHeaders();
//   const res = await withTimeout(fetch(`${API_BASE}/bookings/create`, {
//     method: "POST",
//     headers,
//     credentials: "include",
//     body: JSON.stringify(payload),
//   }), 12000);

//   if (!res.ok) {
//     const err = await res.json().catch(() => ({}));
//     throw Object.assign(new Error(err.error || "Create booking failed"), { data: err });
//   }

//   const data = await res.json();
//   try { localStorage.setItem("last_booking", JSON.stringify(data)); } catch {}
//   try { sessionStorage.setItem("last_booking", JSON.stringify(data)); } catch {}
//   return data;
// }

// export async function createOrder({ package_id, booking_id, promo_code }) {
//   const headers = await csrfHeaders();
//   const res = await withTimeout(fetch(`${API_BASE}/payments/create-order`, {
//     method: "POST",
//     headers,
//     credentials: "include",
//     body: JSON.stringify({ package_id, booking_id, promo_code }),
//   }), 12000);

//   if (!res.ok) {
//     const err = await res.json().catch(() => ({}));
//     throw Object.assign(new Error(err.error || "Create order failed"), { data: err });
//   }

//   const data = await res.json();
//   try { localStorage.setItem("last_order", JSON.stringify(data)); } catch {}
//   try { sessionStorage.setItem("last_order", JSON.stringify(data)); } catch {}
//   return data;
// }

// export function openPaymentLink(url) {
//   try { window.open(url, "_blank", "noopener,noreferrer"); } catch {}
// }

// export async function downloadTicket(razorpay_order_id) {
//   const res = await withTimeout(fetch(`${API_BASE}/tickets/${razorpay_order_id}.pdf`, {
//     method: "GET",
//     credentials: "include",
//   }), 15000);

//   if (!res.ok) {
//     const txt = await res.text().catch(() => "");
//     throw new Error(`Ticket not ready: ${res.status} ${txt}`);
//   }

//   const blob = await res.blob();
//   const url = window.URL.createObjectURL(blob);
//   const a = document.createElement("a");
//   a.href = url;
//   a.download = `H2H_${razorpay_order_id}.pdf`;
//   document.body.appendChild(a);
//   a.click();
//   a.remove();
//   window.URL.revokeObjectURL(url);
// }
// src/api.js
// Normalize API base: if the app is on localhost and API is 127.0.0.1 (or ::1), use localhost to keep SameSite happy.
const RAW_API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:8000/api/";

function normalizeApiBase(raw) {
  try {
    const appHost = window.location.hostname; // e.g. "localhost" or "127.0.0.1"
    const u = new URL(raw, window.location.origin); // handles missing scheme
    const isLoopback = (h) => h === "localhost" || h === "127.0.0.1" || h === "[::1]";

    if (isLoopback(appHost) && isLoopback(u.hostname) && u.hostname !== appHost) {
      // align to the app's loopback hostname to avoid SameSite cookie drops
      u.hostname = appHost;
    }
    // Optional: align ports if you encode the port in VITE_API_BASE; usually you keep 8000 for API.
    return u.href.replace(/\/+$/, "");
  } catch {
    return raw.replace(/\/+$/, "");
  }
}

export const API_BASE = normalizeApiBase(RAW_API_BASE);

// --------- tiny utils ----------
function withTimeout(promise, ms = 12000) {
  let t;
  return Promise.race([
    promise.finally(() => clearTimeout(t)),
    new Promise((_, rej) => (t = setTimeout(() => rej(new Error("Request timeout")), ms))),
  ]);
}

function getCookie(name) {
  if (typeof document === "undefined") return null;
  const m = document.cookie.match(new RegExp("(^|; )" + name + "=([^;]*)"));
  return m ? decodeURIComponent(m[2]) : null;
}
function snapshotCookies(tag = "default") {
  try {
    const readable = {
      csrftoken: getCookie("csrftoken") || null,
      sessionid_visible: !!getCookie("sessionid"), // usually false (HttpOnly)
      when: new Date().toISOString(),
      tag,
    };
    localStorage.setItem("cookie_snapshot", JSON.stringify(readable));
    sessionStorage.setItem("cookie_snapshot", JSON.stringify(readable));
  } catch {}
}

// Ensure csrftoken cookie exists (your /health/ has @ensure_csrf_cookie)
// IMPORTANT: no custom headers here → no CORS preflight.
export async function ensureCsrfCookie() {
  let token = getCookie("csrftoken");
  if (token) return token;
  // IMPORTANT: use *localhost* (not 127.0.0.1) everywhere so SameSite works
  const url = `${API_BASE}/health/?t=${Date.now()}`;
  await fetch(url, { credentials: "include" });
  return getCookie("csrftoken");
}
// Compose headers for unsafe methods (POST/PUT/DELETE)
export async function csrfHeaders(extra = {}) {
  const token = await ensureCsrfCookie();
  return {
    "Content-Type": "application/json",
    ...(token ? { "X-CSRFToken": token } : {}),
    ...extra,
  };
}

// Prime on module load (appears in Network)
try { ensureCsrfCookie(true); } catch {}

// --------------- SSO ----------------
export async function startSSO() {
  const state = Math.random().toString(36).slice(2);
  sessionStorage.setItem("sso_state", state);
  const url = `${API_BASE}/auth/sso/authorize?state=${encodeURIComponent(state)}`;
  try {
    const res = await withTimeout(fetch(url, { method: "GET", credentials: "include" }), 10000);
    if (!res.ok) { window.location.href = url; return; }
    const data = await res.json().catch(() => ({}));
    window.location.href = data?.authorization_url || url;
  } catch {
    window.location.href = url;
  }
}

export async function exchangeCodeForToken({ code, state }) {
  const url = new URL(`${API_BASE}/auth/sso/callback`);
  if (code) url.searchParams.set("code", code);
  if (state) url.searchParams.set("state", state);

  const res = await withTimeout(fetch(url.toString(), {
    method: "GET",
    credentials: "include",
    headers: { Accept: "application/json" },
  }), 12000);

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`SSO callback failed: ${res.status} ${text}`);
  }

  const payload = await res.json();
  const access_token = payload?.tokens?.access_token || null;
  const id_token = payload?.tokens?.id_token || null;
  const user_info = payload?.claims || payload?.user || null;

  try { localStorage.setItem("user_info", JSON.stringify(user_info)); } catch {}
  try { sessionStorage.setItem("user_info", JSON.stringify(user_info)); } catch {}
  try { if (access_token) localStorage.setItem("jwt", access_token); } catch {}
  try { if (access_token) sessionStorage.setItem("jwt", access_token); } catch {}

  snapshotCookies("after-login");
  return { access_token, id_token, user_info, raw: payload };
}

// -------- Booking flow APIs --------
export async function checkAvailability({ event_id, property_id, unit_type_id, category, package_id }) {
  const url = new URL(`${API_BASE}/inventory/availability`);
  if (event_id != null) url.searchParams.set("event_id", event_id);
  if (property_id != null) url.searchParams.set("property_id", property_id);
  if (unit_type_id != null) url.searchParams.set("unit_type_id", unit_type_id);
  if (category) url.searchParams.set("category", category);
  if (package_id) url.searchParams.set("package_id", package_id);

  const res = await withTimeout(fetch(url.toString(), { credentials: "include" }), 10000);
  if (!res.ok) throw new Error("Availability failed");

  const data = await res.json();
  try { localStorage.setItem("last_availability", JSON.stringify(data)); } catch {}
  try { sessionStorage.setItem("last_availability", JSON.stringify(data)); } catch {}
  return data;
}

export async function validatePromo({ code, package_id, amount_inr }) {
  const url = new URL(`${API_BASE}/promocodes/validate`);
  url.searchParams.set("code", code);
  if (package_id) url.searchParams.set("package_id", package_id);
  if (amount_inr != null) url.searchParams.set("amount_inr", amount_inr);

  const res = await withTimeout(fetch(url.toString(), { credentials: "include" }), 10000);
  if (!res.ok) throw new Error("Promo validate failed");

  const data = await res.json();
  try { localStorage.setItem("last_promo", JSON.stringify(data)); } catch {}
  try { sessionStorage.setItem("last_promo", JSON.stringify(data)); } catch {}
  return data;
}

export async function createBooking(payload) {
  const headers = await csrfHeaders();
  const res = await withTimeout(fetch(`${API_BASE}/bookings/create`, {
    method: "POST",
    headers,
    credentials: "include",
    body: JSON.stringify(payload),
  }), 12000);

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw Object.assign(new Error(err.error || "Create booking failed"), { data: err });
  }

  const data = await res.json();
  try { localStorage.setItem("last_booking", JSON.stringify(data)); } catch {}
  try { sessionStorage.setItem("last_booking", JSON.stringify(data)); } catch {}
  snapshotCookies("after-create-booking");
  return data;
}

export async function createOrder({ package_id, booking_id, promo_code }) {
  const headers = await csrfHeaders();
  const res = await withTimeout(fetch(`${API_BASE}/payments/create-order`, {
    method: "POST",
    headers,
    credentials: "include",
    body: JSON.stringify({ package_id, booking_id, promo_code }),
  }), 12000);

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw Object.assign(new Error(err.error || "Create order failed"), { data: err });
  }

  const data = await res.json();
  try { localStorage.setItem("last_order", JSON.stringify(data)); } catch {}
  try { sessionStorage.setItem("last_order", JSON.stringify(data)); } catch {}
  snapshotCookies("after-create-order");
  return data;
}

export function openPaymentLink(url) {
  try { window.open(url, "_blank", "noopener,noreferrer"); } catch {}
}

export async function downloadTicket(razorpay_order_id) {
  const res = await withTimeout(fetch(`${API_BASE}/tickets/${razorpay_order_id}.pdf`, {
    method: "GET",
    credentials: "include",
  }), 15000);

  if (!res.ok) {
    const txt = await res.text().catch(() => "");
    throw new Error(`Ticket not ready: ${res.status} ${txt}`);
  }

  const blob = await res.blob();
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `H2H_${razorpay_order_id}.pdf`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  window.URL.revokeObjectURL(url);
}
