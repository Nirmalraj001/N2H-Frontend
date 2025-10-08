import AdminBulkOrderDetail from './pages/admin/AdminBulkOrderDetail';
import AdminBulkOrders from './pages/admin/AdminBulkOrders';
import BulkOrderDetail from './pages/BulkOrderDetail';
import BulkOrder from './pages/BulkOrder';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { ToastProvider } from './components/ui/Toast';
import { ToastContainer } from './components/ui/ToastContainer';
import { ProtectedRoute } from './components/ProtectedRoute';
import { ScrollToTop } from './components/ScrollToTop';
import { AppShell } from './components/layout/AppShell';
import { AdminLayout } from './pages/admin/AdminLayout';
import { Home } from './pages/Home';
import { Products } from './pages/Products';
import { ProductDetail } from './pages/ProductDetail';
import { Cart } from './pages/Cart';
import { Checkout } from './pages/Checkout';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { Profile } from './pages/Profile';
import { Orders } from './pages/Orders';
import { AdminDashboard } from './pages/admin/AdminDashboard';
import { AdminProducts } from './pages/admin/AdminProducts';
import { AdminOrders } from './pages/admin/AdminOrders';
import { AdminCategories } from './pages/admin/AdminCategories';
import { AdminUsers } from './pages/admin/AdminUsers';
import { AdminBanners } from './pages/admin/AdminBanners';
import { AdminLogos } from './pages/admin/AdminLogos';
import { AdminSiteLinks } from './pages/admin/AdminSiteLinks';
import { AdminReviews } from './pages/admin/AdminReviews';
import { AdminTheme } from './pages/admin/AdminTheme';
import { Reviews } from './pages/Reviews';
import { Categories } from './pages/Categories';

function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <AuthProvider>
        <ToastProvider>
          <ToastContainer />
          <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />

              <Route
                path="/"
                element={
                  <AppShell>
                    <Home />
                  </AppShell>
                }
              />
              <Route
                path="/categories"
                element={
                  <AppShell>
                    <Categories />
                  </AppShell>
                }
              />
              <Route
                path="/products"
                element={
                  <AppShell>
                    <Products />
                  </AppShell>
                }
              />
              <Route
                path="/products/:id"
                element={
                  <AppShell>
                    <ProductDetail />
                  </AppShell>
                }
              />
              <Route
                path="/cart"
                element={
                  <AppShell>
                    <Cart />
                  </AppShell>
                }
              />
              <Route
                path="/checkout"
                element={
                  <ProtectedRoute>
                    <AppShell>
                      <Checkout />
                    </AppShell>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/profile"
                element={
                  <ProtectedRoute>
                    <AppShell>
                      <Profile />
                    </AppShell>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/orders"
                element={
                  <ProtectedRoute>
                    <AppShell>
                      <Orders />
                    </AppShell>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/bulk-order"
                element={
                  <ProtectedRoute>
                    <AppShell>
                      <BulkOrder />
                    </AppShell>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/orders/bulk/:id"
                element={
                  <ProtectedRoute>
                    <AppShell>
                      <BulkOrderDetail />
                    </AppShell>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/reviews"
                element={
                  <ProtectedRoute>
                    <AppShell>
                      <Reviews />
                    </AppShell>
                  </ProtectedRoute>
                }
              />

              <Route
                path="/admin"
                element={
                  <ProtectedRoute adminOnly>
                    <AdminLayout />
                  </ProtectedRoute>
                }
              >
                <Route index element={<AdminDashboard />} />
                <Route path="products" element={<AdminProducts />} />
                <Route path="orders" element={<AdminOrders />} />
                <Route path="bulk-orders" element={<AdminBulkOrders />} />
                <Route path="bulk-orders/:id" element={<AdminBulkOrderDetail />} />
                <Route path="categories" element={<AdminCategories />} />
                <Route path="users" element={<AdminUsers />} />
                <Route path="banners" element={<AdminBanners />} />
                <Route path="logos" element={<AdminLogos />} />
                <Route path="site-links" element={<AdminSiteLinks />} />
                <Route path="reviews" element={<AdminReviews />} />
                <Route path="theme" element={<AdminTheme />} />
              </Route>

              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </ToastProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
