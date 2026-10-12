import { BrowserRouter } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import { SubscriptionProvider } from './context/SubscriptionContext'
import AppRouter from './router/AppRouter'
import CookieBanner from './components/common/CookieBanner'

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <SubscriptionProvider>
          <AppRouter />
          <CookieBanner />
        </SubscriptionProvider>
      </AuthProvider>
    </BrowserRouter>
  )
}

export default App
