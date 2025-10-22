
// import React, { useEffect, useState } from 'react';
// import { useNavigate, useSearchParams } from 'react-router-dom';
// import { useAuth } from '../state/AuthContext';
// import { exchangeCodeForToken } from '../api';

// export default function AuthCallback() {
//   const [params] = useSearchParams();
//   const navigate = useNavigate();
//   const { setToken, setProfile } = useAuth();
//   const [error, setError] = useState(null);

//   useEffect(() => {
//     const code = params.get('code');
//     const returnedState = params.get('state'); // may be null if you came here manually
//     const expectedState = sessionStorage.getItem('sso_state');

//     (async () => {
//       try {
//         if (!code) {
//           throw new Error('Missing code');
//         }

//         // Enforce state only if we actually initiated the flow (safer + dev-friendly)
//         if (expectedState && returnedState !== expectedState) {
//           throw new Error('State mismatch');
//         }

//         const { access_token, user_info } = await exchangeCodeForToken({
//           code,
//           state: returnedState || undefined,
//         });

//         if (access_token) setToken(access_token);
//         if (user_info) setProfile(user_info);

//         // Clean up and go home (or wherever you want)
//         sessionStorage.removeItem('sso_state');
//         navigate('/', { replace: true });
//       } catch (e) {
//         setError(e.message || 'SSO exchange failed');
//       }
//     })();
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, []);

//   return (
//     <main className="section">
//       <div className="container text-center">
//         {!error ? (
//           <>
//             <div className="text-2xl font-semibold">Completing sign-in…</div>
//             <p className="opacity-70 mt-2">Please wait.</p>
//           </>
//         ) : (
//           <>
//             <div className="text-2xl font-semibold text-red-600">Sign-in failed</div>
//             <pre className="mt-4 text-left bg-red-50 border border-red-200 p-4 rounded-xl overflow-auto">
//               {error}
//             </pre>
//             <p className="mt-4 opacity-70">
//               Tip: Make sure you clicked “Login” from this site (so a{" "}
//               <code>sso_state</code> exists), and that your backend CORS allows{" "}
//               <code>http://localhost:5173</code>. Also check that your Cognito callback URL is exactly{" "}
//               <code>http://localhost:5173/auth/callback</code>.
//             </p>
//           </>
//         )}
//       </div>
//     </main>
//   );
// }

// // import React, { useEffect, useState } from "react";
// // import { useNavigate, useSearchParams } from "react-router-dom";
// // import { exchangeCodeForToken } from "../api";

// // export default function AuthCallback() {
// //   const [msg, setMsg] = useState("Finishing sign-in…");
// //   const [search] = useSearchParams();
// //   const navigate = useNavigate();

// //   useEffect(() => {
// //     let alive = true;
// //     (async () => {
// //       try {
// //         const code = search.get("code");
// //         const state = search.get("state");
// //         if (!code) {
// //           setMsg("Missing authorization code.");
// //           return;
// //         }
// //         await exchangeCodeForToken({ code, state });
// //         if (!alive) return;
// //         setMsg("Signed in! Redirecting…");
// //         // if you keep tokens in context, you could set them here
// //         navigate("/", { replace: true });
// //       } catch (e) {
// //         console.error(e);
// //         setMsg("Sign-in failed. Please try again.");
// //       }
// //     })();
// //     return () => { alive = false; };
// //   }, [search, navigate]);

// //   return (
// //     <main className="section bg-cream">
// //       <div className="container max-w-md">
// //         <div className="card p-6 text-center">
// //           <div className="text-lg">{msg}</div>
// //         </div>
// //       </div>
// //     </main>
// //   );
// // }


// src/routes/AuthCallback.jsx
import React, { useEffect, useRef, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../state/AuthContext';
import { exchangeCodeForToken } from '../api';

export default function AuthCallback() {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const { setToken, setProfile } = useAuth();
  const [error, setError] = useState(null);

  // 🔒 StrictMode guard: run effect only once
  const ranRef = useRef(false);

  useEffect(() => {
    if (ranRef.current) return;
    ranRef.current = true;

    const code = params.get('code');
    const returnedState = params.get('state');
    const expectedState = sessionStorage.getItem('sso_state');

    (async () => {
      try {
        if (!code) throw new Error('Missing authorization code');

        // Enforce state only if we initiated the flow
        if (expectedState && returnedState !== expectedState) {
          throw new Error('State mismatch');
        }

        const { access_token, user_info } = await exchangeCodeForToken({
          code,
          state: returnedState || undefined,
        });

        // Save to both storages as requested
        if (access_token) {
          sessionStorage.setItem('jwt', access_token);
          localStorage.setItem('jwt', access_token);
          setToken(access_token);
        }
        if (user_info) {
          const profileStr = JSON.stringify(user_info);
          sessionStorage.setItem('profile', profileStr);
          localStorage.setItem('profile', profileStr);
          setProfile(user_info);
        }

        sessionStorage.removeItem('sso_state');
        navigate('/', { replace: true });
      } catch (e) {
        setError(e.message || 'SSO exchange failed');
      }
    })();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <main className="section">
      <div className="container text-center">
        {!error ? (
          <>
            <div className="text-2xl font-semibold">Completing sign-in…</div>
            <p className="opacity-70 mt-2">Please wait.</p>
          </>
        ) : (
          <>
            <div className="text-2xl font-semibold text-red-600">Sign-in failed</div>
            <pre className="mt-4 text-left bg-red-50 border border-red-200 p-4 rounded-xl overflow-auto">
              {error}
            </pre>
          </>
        )}
      </div>
    </main>
  );
}
