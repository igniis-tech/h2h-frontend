# Highway to Heal — React + Vite + Tailwind

A single-page site inspired by the provided design, featuring:
- SSO login button that calls **GET /api/auth/sso/authorize** and redirects the browser to the provider.
- `/auth/callback` route to capture a `?token=...` from the backend and store it locally.
- A 4-step booking flow (Dates → Package → Details → Review → Confirm).

## Quick Start

```bash
# 1) Extract
cd highway-to-heal

# 2) Install
npm i

# 3) Run
npm run dev
```

## Tailwind
This project already includes Tailwind. You can customize theme colors in `tailwind.config.js`.

## SSO Flow Notes
- The **Login** button calls `http://127.0.0.1:8000/api/auth/sso/authorize`.
- Your backend should then redirect to the Cognito `authorization_url`.
- After users complete provider login, configure your backend callback to finally redirect to
  your frontend (for local dev): `http://localhost:5173/auth/callback?token=<JWT>` (or set a cookie).
- The `/auth/callback` page saves the token and takes the user to **/booking**.

## Booking
`submitBooking` in `src/api.js` is a stub. Replace it with your real endpoint when ready.
