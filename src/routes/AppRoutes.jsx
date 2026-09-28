import { Routes, Route } from 'react-router-dom'
import MainLayout from '../layouts/MainLayout'
import Dashboard from '../pages/Dashboard'
import Products from '../pages/Products'
import ProductionBatch from '../pages/ProductionBatch'
import BottleDetails from '../pages/BottleDetails'
import Analytics from '../pages/Analytics'
import LiveInspection from '../pages/LiveInspection'
import Settings from '../pages/Settings'
import NotFound from '../pages/NotFound'

export default function AppRoutes() {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route path="/" element={<Dashboard />} />
        <Route path="/products" element={<Products />} />
        <Route path="/products/:productId/batch/:batchId" element={<ProductionBatch />} />
        <Route path="/bottle/:bottleId" element={<BottleDetails />} />
        <Route path="/analytics" element={<Analytics />} />
        <Route path="/live-inspection" element={<LiveInspection />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  )
}
