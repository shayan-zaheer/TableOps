import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import { Provider } from 'react-redux'
import './index.css'
import { createBrowserRouter, Route, RouterProvider } from 'react-router-dom'
import MenuPage from './pages/MenuPage.jsx'
import DealsPage from './pages/DealsPage.jsx'
import SettingsPage from './pages/SettingsPage.jsx'
import OrderPage from "./pages/OrderPage.jsx"
import store from './store/index.js'
import CategoriesPage from './pages/CategoriesPage.jsx'
import ProductsPage from './pages/ProductsPage.jsx'
import RidersPage from './pages/RidersPage.jsx'

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
        path: "/order",
        element: <OrderPage />
      },
      {
        path: "/settings",
        element: <SettingsPage />
      },
      {
        path: "/categories",
        element: <CategoriesPage />
      },
      {
        path: "/products",
        element: <ProductsPage />
      },
      {
        path: "/riders",
        element: <RidersPage />
      }
    ]
  },
])

createRoot(document.getElementById('root')).render(
  <Provider store={store}>
    <RouterProvider router={router} />
  </Provider>
)
