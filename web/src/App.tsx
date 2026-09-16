import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { StoreProvider } from './context/StoreContext'
import HomePage from './pages/HomePage'
import CartPage from './pages/CartPage'
import AdminLoginPage from './pages/AdminLoginPage'
import AdminPage from './pages/AdminPage'
import StorePage from './pages/StorePage'
import ProductDetailPage from './pages/ProductDetailPage'

export default function App() {
  return (
    <StoreProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/store" element={<StorePage />} />
          <Route path="/store/product/:id" element={<ProductDetailPage />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/admin/login" element={<AdminLoginPage />} />
          <Route path="/admin" element={<AdminPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </StoreProvider>
  )
}
