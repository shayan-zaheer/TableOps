import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { createBrowserRouter, Route, RouterProvider } from 'react-router-dom'
import MenuPage from './pages/MenuPage.jsx'
import DealsPage from './pages/DealsPage.jsx'
import SettingsPage from './pages/SettingsPage.jsx'

const router = createBrowserRouter([
  {
    element: <App />,
    children: [
      {
        path: "/menu",
        element: <MenuPage />
      },
      {
        path: "/deals",
        element: <DealsPage />
      },
      {
        path: "/settings",
        element: <SettingsPage />
      }
    ]
  },
])

createRoot(document.getElementById('root')).render(
  <RouterProvider router={router} />
)
