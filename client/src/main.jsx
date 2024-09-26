import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { createBrowserRouter, Route, RouterProvider } from 'react-router-dom'

const router = createBrowserRouter([
  // {
  //   path: "/",
  //   element: <LoginPage />
  // },
  {
    path: "/menu",
    element: <App />
  },
  {
    path: "/deals",
    element: <App />
  },
  {
    path: "/settings",
    element: <App />
  },
])

createRoot(document.getElementById('root')).render(
  <RouterProvider router={router} />
)
