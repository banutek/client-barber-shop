import { useCallback, useState } from 'react'
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom'
import { GeolocationProvider, NotificationBell, OnboardingSlides, SplashScreen } from './components'
import { AuthGuard } from './guards'
import { HomePage, ShopDetailsPage, WaitingListDetailsPage } from './pages'
import { OnboardingWelcome } from './components/onboarding'
import { NotificationsProvider } from './components/notification'

type AppPhase = 'splash' | 'welcome' | 'onboarding' | 'app'

export default function App() {
  const [phase, setPhase] = useState<AppPhase>('splash')

  const handleSplashFinish = useCallback(() => {
    setPhase(localStorage.getItem('device_infos') ? 'app' : 'welcome')
  }, [])

  const handleWelcomeFinish = useCallback(() => {
    setPhase('onboarding')
  }, [])

  const handleOnboardingFinish = useCallback(() => {
    setPhase('app')
  }, [])

  if (phase === 'splash') {
    return <SplashScreen onFinish={handleSplashFinish} />
  }

  if (phase === 'welcome') {
    return <OnboardingWelcome onFinish={handleWelcomeFinish} />
  }

  if (phase === 'onboarding') {
    return <OnboardingSlides onFinish={handleOnboardingFinish} />
  }

  return (
    <AuthGuard>
      <GeolocationProvider>
        <NotificationsProvider>
          <Router>
            <div className="fixed top-3 right-4 z-40">
              <NotificationBell />
            </div>
            <Routes>
              <Route element={<HomePage />} path="/" />
              <Route element={<ShopDetailsPage />} path="/shop-details/:shopId" />
              <Route element={<WaitingListDetailsPage />} path="/waiting-list-details/:listId" />
            </Routes>
          </Router>
        </NotificationsProvider>
      </GeolocationProvider>
    </AuthGuard>
  )
}
