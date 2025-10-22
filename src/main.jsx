// import React from 'react'
// import ReactDOM from 'react-dom/client'
// import { createBrowserRouter, RouterProvider } from 'react-router-dom'
// import './styles.css'
// import App from './App'
// import AuthCallback from './routes/AuthCallback'
// import Booking from './routes/Booking'
// import Home from './routes/Home'
// import { AuthProvider } from './state/AuthContext'

// const router = createBrowserRouter([
//   {
//     element: <App />,
//     children: [
//       { path: "/", element: <Home /> },
//       { path: "/booking", element: <Booking /> },
//       { path: "/auth/callback", element: <AuthCallback /> },
//     ]
//   }
// ])

// ReactDOM.createRoot(document.getElementById('root')).render(
//   <React.StrictMode>
//     <AuthProvider>
//       <RouterProvider router={router} />
//     </AuthProvider>
//   </React.StrictMode>
// )
import React from 'react'
import ReactDOM from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import './styles.css'
import App from './App'
import AuthCallback from './routes/AuthCallback'
import Booking from './routes/Booking'
import Home from './routes/Home'
import PackageDetails from './routes/PackageDetails' // ← add
import { AuthProvider } from './state/AuthContext'

const router = createBrowserRouter([
  {
    element: <App />,
    children: [
      { path: "/", element: <Home /> },
      { path: "/booking", element: <Booking /> },
      { path: "/auth/callback", element: <AuthCallback /> },
      { path: "/packages/:id", element: <PackageDetails /> }, // ← add
    ]
  }
])

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  </React.StrictMode>
)
