import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import { HomePage, ShopDetailsPage, WaitingListDetailsPage } from "./pages"


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/shop-details/:shopId" element={<ShopDetailsPage />} />
        <Route path="/waiting-list-details/:listId" element={<WaitingListDetailsPage />} />
      </Routes>
    </Router>
  )
}

export default App
