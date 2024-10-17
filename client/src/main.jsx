import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import { Provider } from 'react-redux'
import './index.css'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import MenuPage from './pages/MenuPage.jsx'
import AuditPage from './pages/AuditPage.jsx'
import OrderPage from "./pages/OrderPage.jsx"
import store from './store/index.js'
import CategoriesPage from './pages/CategoriesPage.jsx'
import ProductsPage from './pages/ProductsPage.jsx'
import RidersPage from './pages/RidersPage.jsx'
import DeliveryPage from './pages/DeliveryPage.jsx'
import DineInPage from './pages/DineInPage.jsx'
import WaitersPage from './pages/WaitersPage.jsx'

const router = createBrowserRouter([
  {
    element: <App />,
    children: [
      {
        path: "/menu",
        element: <MenuPage />
      },
      {
        path: "/order",
        element: <OrderPage />
      },
      {
        path: "/delivery",
        element: <DeliveryPage />
      },
      {
        path: "/dinein",
        element: <DineInPage />
      },
      {
        path: "/audit",
        element: <AuditPage />
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
      },
      {
        path: "/waiters",
        element: <WaitersPage />
      }
    ]
  },
])

createRoot(document.getElementById('root')).render(
  <Provider store={store}>
    <RouterProvider router={router} />
  </Provider>
)
