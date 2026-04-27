import { useState, useEffect } from 'react'
import Dashboard from './pages/Dashboard'
import DataArchitecture from './pages/DataArchitecture'
import FrontendPlanning from './pages/FrontendPlanning'

export type Page = 'dashboard' | 'data-architecture' | 'frontend-planning'

const DETAIL_PAGES: Page[] = ['data-architecture', 'frontend-planning']

function hashToPage(): Page {
  const h = location.hash.replace('#', '') as Page
  return DETAIL_PAGES.includes(h) ? h : 'dashboard'
}

function GlobalNav({ page, onNavigate }: { page: Page; onNavigate: (p: Page) => void }) {
  return (
    <nav className="global-nav">
      <button className="nav-logo" onClick={() => onNavigate('dashboard')}>
        <span className="nav-logo-dot" />
        LU Equity
      </button>
      <div className="nav-links">
        <button
          className={`nav-link${page === 'dashboard' ? ' active' : ''}`}
          onClick={() => onNavigate('dashboard')}
        >
          Overview
        </button>
        <button
          className={`nav-link${page === 'data-architecture' ? ' active' : ''}`}
          onClick={() => onNavigate('data-architecture')}
        >
          Data Architecture
        </button>
        <button
          className={`nav-link${page === 'frontend-planning' ? ' active' : ''}`}
          onClick={() => onNavigate('frontend-planning')}
        >
          Frontend Planning
        </button>
      </div>
      <div className="nav-badge">
        <span className="nav-badge-dot" />
        Live · 2026
      </div>
    </nav>
  )
}

export default function App() {
  const [page, setPage] = useState<Page>(hashToPage)

  const navigate = (p: Page) => {
    setPage(p)
    history.pushState(null, '', p === 'dashboard' ? location.pathname : `#${p}`)
  }

  useEffect(() => {
    const onPop = () => setPage(hashToPage())
    window.addEventListener('popstate', onPop)
    return () => window.removeEventListener('popstate', onPop)
  }, [])

  return (
    <div className="app-shell">
      <GlobalNav page={page} onNavigate={navigate} />
      <main className="app-main">
        {page === 'data-architecture' ? <DataArchitecture /> :
         page === 'frontend-planning' ? <FrontendPlanning /> :
         <Dashboard onNavigate={navigate} />}
      </main>
    </div>
  )
}
