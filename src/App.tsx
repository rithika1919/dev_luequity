import { useState } from 'react'
import Dashboard from './pages/Dashboard'
import DataArchitecture from './pages/DataArchitecture'
import FrontendPlanning from './pages/FrontendPlanning'

export type Page = 'dashboard' | 'data-architecture' | 'frontend-planning'

export default function App() {
  const [page, setPage] = useState<Page>('dashboard')

  if (page === 'data-architecture') return <DataArchitecture onBack={() => setPage('dashboard')} />
  if (page === 'frontend-planning') return <FrontendPlanning onBack={() => setPage('dashboard')} />
  return <Dashboard onNavigate={setPage} />
}
