// // export const API_BASE = 'http://127.0.0.1:8000/api'

// // export async function startSSO(){
// //   const res = await fetch(`${API_BASE}/auth/sso/authorize`)
// //   if(!res.ok) throw new Error('Failed to hit SSO authorize endpoint')
// //   const data = await res.json()
// //   if(!data.authorization_url) throw new Error('No authorization_url in response')
// //   // Redirect user's browser to provider
// //   window.location.href = data.authorization_url
// // }

// // export async function submitBooking(payload, token){
// //   // Placeholder: Send to your backend when available.
// //   // Here we just simulate a small delay and "success" result.
// //   await new Promise(r => setTimeout(r, 600))
// //   const id = Math.random().toString(36).slice(2,8).toUpperCase()
// //   return { id, ...payload }
// // }
// // src/api.js

// // --- Configure your backend API base here (dev) ---
// export const API_BASE = ' https://h2h-backend-vpk9.vercel.app/api';

// // Optional: tiny timeout helper so fetch doesn't hang forever in dev
// function withTimeout(promise, ms = 10000) {
//   let t;
//   return Promise.race([
//     promise.finally(() => clearTimeout(t)),
//     new Promise((_, rej) => (t = setTimeout(() => rej(new Error('Request timeout')), ms))),
//   ]);
// }

// /**
//  * Step 1: Start SSO.
//  * - Calls your backend /auth/sso/authorize with credentials so Django session is set
//  * - Reads { authorization_url } and navigates to Cognito
//  * - On any failure, falls back to opening the authorize endpoint directly
//  */
// export async function startSSO() {
//   const authorizeUrl = `${API_BASE}/auth/sso/authorize`;

//   try {
//     const res = await withTimeout(
//       fetch(authorizeUrl, {
//         method: 'GET',
//         credentials: 'include', // IMPORTANT for Django session (state)
//         headers: {
//           // help DRF choose JSON over HTML; not strictly required
//           Accept: 'application/json',
//         },
//         mode: 'cors',
//       }),
//       10000
//     );

//     if (!res.ok) {
//       console.warn('[SSO] /authorize returned', res.status);
//       // Let server handle redirect if you ever flip it to 302 in future
//       window.location.href = authorizeUrl;
//       return;
//     }

//     // If CORS is misconfigured, the browser would block here before this runs.
//     const data = await res.json().catch(() => ({}));
//     const loginUrl = data && data.authorization_url;

//     if (loginUrl) {
//       // Unambiguous redirect to Cognito
//       window.location.href = loginUrl;
//       return;
//     }

//     console.warn('[SSO] No authorization_url in response:', data);
//     window.location.href = authorizeUrl;
//   } catch (err) {
//     console.error('[SSO] authorize error; falling back to direct open:', err);
//     window.location.href = authorizeUrl;
//   }
// }

// /**
//  * Step 2: On /auth/callback (frontend), exchange ?code&state with your backend.
//  * Your backend returns: { access_token, user_info, expires_in }
//  */
// export async function exchangeCodeForToken({ code, state }) {
//   const url = new URL(`${API_BASE}/auth/sso/callback`);
//   if (code) url.searchParams.set('code', code);
//   if (state) url.searchParams.set('state', state);

//   const res = await withTimeout(
//     fetch(url.toString(), {
//       method: 'GET',
//       credentials: 'include', // send session cookie so state matches
//       headers: {
//         Accept: 'application/json',
//       },
//       mode: 'cors',
//     }),
//     10000
//   );

//   if (!res.ok) {
//     const text = await res.text().catch(() => '');
//     throw new Error(`SSO callback failed: ${res.status} ${text}`);
//   }

//   return res.json(); // { access_token, user_info, expires_in }
// }

// /**
//  * Booking stub — replace with your real POST when you have the endpoint.
//  */
// export async function submitBooking(payload, token) {
//   // Example real call (uncomment & adapt when ready):
//   /*
//   const res = await withTimeout(
//     fetch(`${API_BASE}/bookings`, {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json',
//         ...(token ? { Authorization: `Bearer ${token}` } : {}),
//       },
//       body: JSON.stringify(payload),
//       credentials: 'include', // only if your backend uses session + JWT together
//       mode: 'cors',
//     }),
//     10000
//   );

//   if (!res.ok) {
//     const text = await res.text().catch(() => '');
//     throw new Error(`Booking failed: ${res.status} ${text}`);
//   }
//   return res.json();
//   */

//   // Dev stub to keep UI working:
//   await new Promise((r) => setTimeout(r, 600));
//   const id = Math.random().toString(36).slice(2, 8).toUpperCase();
//   return { id, ...payload };
// }

// /** Helper (optional): auth header for future protected calls */
// export function bearer(token) {
//   return token ? { Authorization: `Bearer ${token}` } : {};
// }
// --- Configure your backend API base here (dev) ---
// Use the SAME host as your frontend to avoid cookie/cors headaches.
// (localhost === localhost; don't mix with 127.0.0.1)
export const API_BASE = 'https://h2h-backend-vpk9.vercel.app/api';

// Optional: tiny timeout helper so fetch doesn't hang forever in dev
function withTimeout(promise, ms = 10000) {
  let t;
  return Promise.race([
    promise.finally(() => clearTimeout(t)),
    new Promise((_, rej) => (t = setTimeout(() => rej(new Error('Request timeout')), ms))),
  ]);
}

// Generate a random state string for CSRF protection
function randomState(len = 16) {
  const bytes = crypto.getRandomValues(new Uint8Array(len));
  return Array.from(bytes, b => b.toString(16).padStart(2, '0')).join('');
}

/**
 * Step 1: Start SSO.
 * - Generates a state, stores it in sessionStorage (sso_state)
 * - Calls your backend /auth/sso/authorize?state=... with credentials so Django session is set
 * - Navigates to Cognito Hosted UI using the returned authorization_url
 * - On any failure, falls back to opening the authorize endpoint directly
 */
export async function startSSO() {
  const state = randomState(16);
  sessionStorage.setItem('sso_state', state);

  const authorizeUrl = `${API_BASE}/auth/sso/authorize?state=${encodeURIComponent(state)}`;

  try {
    const res = await withTimeout(
      fetch(authorizeUrl, {
        method: 'GET',
        credentials: 'include', // IMPORTANT for Django session (state)
        headers: { Accept: 'application/json' },
        mode: 'cors',
      }),
      10000
    );

    if (!res.ok) {
      // Let server handle redirect if you ever change it to 302
      window.location.href = authorizeUrl;
      return;
    }

    const data = await res.json().catch(() => ({}));
    const loginUrl = data && data.authorization_url;

    if (loginUrl) {
      window.location.href = loginUrl; // Go to Cognito Hosted UI
      return;
    }

    // Fallback if JSON didn’t contain the url for some reason
    window.location.href = authorizeUrl;
  } catch (err) {
    console.error('[SSO] /authorize error; falling back to direct open:', err);
    window.location.href = authorizeUrl;
  }
}

/**
 * Step 2: On /auth/callback (frontend), exchange ?code&state with your backend.
 * Your Django sso_callback returns:
 * {
 *   "user": {...},
 *   "tokens": {"id_token": "...", "access_token": "..."},
 *   "claims": {...},
 *   "state": "..."
 * }
 */
export async function exchangeCodeForToken({ code, state }) {
  const url = new URL(`${API_BASE}/auth/sso/callback`);
  if (code) url.searchParams.set('code', code);
  if (state) url.searchParams.set('state', state);

  const res = await withTimeout(
    fetch(url.toString(), {
      method: 'GET',
      credentials: 'include', // send session cookie so state matches
      headers: { Accept: 'application/json' },
      mode: 'cors',
    }),
    10000
  );

  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(`SSO callback failed: ${res.status} ${text}`);
  }

  // Normalize to a frontend-friendly shape
  const payload = await res.json();
  const access_token = payload?.tokens?.access_token || null;
  const id_token = payload?.tokens?.id_token || null;
  const user_info = payload?.claims || payload?.user || null;

  return { access_token, id_token, user_info, raw: payload };
}

/** Example placeholder for future protected POSTs */
export async function submitBooking(payload, token) {
  // Dev stub to keep UI working:
  await new Promise((r) => setTimeout(r, 600));
  const id = Math.random().toString(36).slice(2, 8).toUpperCase();
  return { id, ...payload };
}

/** Helper (optional): auth header for future protected calls */
export function bearer(token) {
  return token ? { Authorization: `Bearer ${token}` } : {};
}