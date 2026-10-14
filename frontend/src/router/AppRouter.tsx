import { lazy, Suspense } from 'react'
import { Routes, Route } from 'react-router-dom'
import MainLayout from '../components/layout/MainLayout'
import AdminLayout from '../components/layout/AdminLayout'
import ProtectedRoute from './ProtectedRoute'
import LoadingSpinner from '../components/common/LoadingSpinner'

// Lazy loading de páginas para mejor rendimiento
const Home = lazy(() => import('../pages/Home/Home'))
const Games = lazy(() => import('../pages/Games/Games'))
const GameDetail = lazy(() => import('../pages/GameDetail/GameDetail'))
const LocalGameDetail = lazy(() => import('../pages/GameDetail/LocalGameDetail'))
const Videos = lazy(() => import('../pages/Videos/Videos'))
const Articles = lazy(() => import('../pages/Articles/Articles'))
const ArticleDetail = lazy(() => import('../pages/Articles/ArticleDetail'))
const TeacherProfile = lazy(() => import('../pages/TeacherProfile/TeacherProfile'))
const Contact = lazy(() => import('../pages/Contact/Contact'))
const Pricing = lazy(() => import('../pages/Pricing/Pricing'))
const Privacy = lazy(() => import('../pages/Legal/Privacy'))
const Terms = lazy(() => import('../pages/Legal/Terms'))
const Login = lazy(() => import('../pages/Auth/Login'))
const Register = lazy(() => import('../pages/Auth/Register'))
const ForgotPassword = lazy(() => import('../pages/Auth/ForgotPassword'))
const ResetPassword = lazy(() => import('../pages/Auth/ResetPassword'))
const Account = lazy(() => import('../pages/Account/Account'))

// Admin pages
const AdminDashboard = lazy(() => import('../pages/Admin/Dashboard'))
const AdminGames = lazy(() => import('../pages/Admin/ManageGames'))
const AdminVideos = lazy(() => import('../pages/Admin/ManageVideos'))
const AdminArticles = lazy(() => import('../pages/Admin/ManageArticles'))
const AdminUsers = lazy(() => import('../pages/Admin/ManageUsers'))

const PageLoader = () => (
  <div className="min-h-screen flex items-center justify-center">
    <LoadingSpinner size="lg" />
  </div>
)

export default function AppRouter() {
  return (
    <Suspense fallback={<PageLoader />}>
      <Routes>
        {/* Rutas públicas con layout principal */}
        <Route element={<MainLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/juegos" element={<Games />} />
          <Route path="/juegos/matematicas-divertidas" element={<LocalGameDetail slug="matematicas-divertidas" />} />
          <Route path="/juegos/divisiones" element={<LocalGameDetail slug="divisiones" />} />
          <Route path="/juegos/multiplicaciones-en-la-selva" element={<LocalGameDetail slug="multiplicaciones-en-la-selva" />} />
          <Route path="/juegos/:slug" element={<GameDetail />} />
          <Route path="/videos" element={<Videos />} />
          <Route path="/articulos" element={<Articles />} />
          <Route path="/articulos/:slug" element={<ArticleDetail />} />
          <Route path="/docente" element={<TeacherProfile />} />
          <Route path="/contacto" element={<Contact />} />
          <Route path="/precios" element={<Pricing />} />
          <Route path="/privacidad" element={<Privacy />} />
          <Route path="/terminos" element={<Terms />} />

          {/* Rutas de autenticación */}
          <Route path="/login" element={<Login />} />
          <Route path="/registro" element={<Register />} />
          <Route path="/recuperar-contrasena" element={<ForgotPassword />} />
          <Route path="/restablecer-contrasena" element={<ResetPassword />} />

          {/* Rutas protegidas para usuarios autenticados */}
          <Route element={<ProtectedRoute />}>
            <Route path="/mi-cuenta" element={<Account />} />
          </Route>
        </Route>

        {/* Panel de administración — solo para rol admin */}
        <Route element={<ProtectedRoute requiredRole="admin" />}>
          <Route element={<AdminLayout />}>
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/admin/juegos" element={<AdminGames />} />
            <Route path="/admin/videos" element={<AdminVideos />} />
            <Route path="/admin/articulos" element={<AdminArticles />} />
            <Route path="/admin/usuarios" element={<AdminUsers />} />
          </Route>
        </Route>

        {/* 404 */}
        <Route path="*" element={
          <MainLayout>
            <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4">
              <div className="text-8xl mb-4">🎮</div>
              <h1 className="text-4xl font-display font-black text-dark mb-3">Página no encontrada</h1>
              <p className="text-gray-600 mb-8">Esta página no existe o fue movida.</p>
              <a href="/" className="btn-primary">Volver al inicio</a>
            </div>
          </MainLayout>
        } />
      </Routes>
    </Suspense>
  )
}
