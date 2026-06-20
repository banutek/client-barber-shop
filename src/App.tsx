import { Route, BrowserRouter as Router, Routes } from 'react-router-dom'
import { HomePage, ShopDetailsPage, WaitingListDetailsPage } from './pages'

export default function App() {
  return (
    <Router>
      <Routes>
        <Route element={<HomePage />} path="/" />
        <Route element={<ShopDetailsPage />} path="/shop-details/:shopId" />
        <Route element={<WaitingListDetailsPage />} path="/waiting-list-details/:listId" />
      </Routes>
    </Router>
  )
}
