import { Route, BrowserRouter as Router, Routes } from 'react-router-dom'
import { GeolocationProvider, NotificationBell, NotificationsProvider } from './components'
import { HomePage, ShopDetailsPage, WaitingListDetailsPage } from './pages'

export default function App() {
  return (
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
  )
}
