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
//     const state = params.get('state');

//     (async () => {
//       if (!code || !state) {
//         setError('Missing code or state');
//         return;
//       }
//       try {
//         const { access_token, user_info } = await exchangeCodeForToken({ code, state });
//         if (access_token) setToken(access_token);
//         if (user_info) setProfile(user_info);
//         // Go to HOME instead of /booking
//         navigate('/', { replace: true });
//       } catch (e) {
//         setError(e.message || 'SSO exchange failed');
//       }
//     })();
//   }, []); // eslint-disable-line

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
//           </>
//         )}
//       </div>
//     </main>
//   );
// }
import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../state/AuthContext';
import { exchangeCodeForToken } from '../api';

export default function AuthCallback() {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const { setToken, setProfile } = useAuth();
  const [error, setError] = useState(null);

  useEffect(() => {
    const code = params.get('code');
    const returnedState = params.get('state'); // may be null if you came here manually
    const expectedState = sessionStorage.getItem('sso_state');

    (async () => {
      try {
        if (!code) {
          throw new Error('Missing code');
        }

        // Enforce state only if we actually initiated the flow (safer + dev-friendly)
        if (expectedState && returnedState !== expectedState) {
          throw new Error('State mismatch');
        }

        const { access_token, user_info } = await exchangeCodeForToken({
          code,
          state: returnedState || undefined,
        });

        if (access_token) setToken(access_token);
        if (user_info) setProfile(user_info);

        // Clean up and go home (or wherever you want)
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
            <p className="mt-4 opacity-70">
              Tip: Make sure you clicked “Login” from this site (so a{" "}
              <code>sso_state</code> exists), and that your backend CORS allows{" "}
              <code>http://localhost:5173</code>. Also check that your Cognito callback URL is exactly{" "}
              <code>http://localhost:5173/auth/callback</code>.
            </p>
          </>
        )}
      </div>
    </main>
  );
}