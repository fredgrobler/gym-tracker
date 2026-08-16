import { HashRouter, Routes, Route, NavLink, useLocation } from 'react-router-dom'
import { useLiveQuery } from 'dexie-react-hooks'
import { db } from './db'
import Onboarding from './screens/Onboarding'
import Today from './screens/Today'
import Session from './screens/Session'
import History from './screens/History'
import Settings from './screens/Settings'

function BottomNav() {
  const location = useLocation()
  if (location.pathname.startsWith('/session/')) return null
  return (
    <nav className="bottom-nav">
      <NavLink to="/" end className={({ isActive }) => `nav-item${isActive ? ' active' : ''}`}>
        <span className="nav-icon">🏋️</span>
        <span>Today</span>
      </NavLink>
      <NavLink to="/history" className={({ isActive }) => `nav-item${isActive ? ' active' : ''}`}>
        <span className="nav-icon">📈</span>
        <span>History</span>
      </NavLink>
      <NavLink to="/settings" className={({ isActive }) => `nav-item${isActive ? ' active' : ''}`}>
        <span className="nav-icon">⚙️</span>
        <span>Settings</span>
      </NavLink>
    </nav>
  )
}

function Shell() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Today />} />
        <Route path="/session/:id" element={<Session />} />
        <Route path="/history" element={<History />} />
        <Route path="/settings" element={<Settings />} />
      </Routes>
      <BottomNav />
    </>
  )
}

export default function App() {
  // Wrapped in an object so we can tell "still loading" (outer undefined)
  // apart from "loaded, no enrollment row yet" ({ value: undefined }).
  const state = useLiveQuery(async () => ({ value: await db.enrollment.get(1) }), [])

  if (state === undefined) {
    return null // loading DB
  }

  if (state.value === undefined) {
    return <Onboarding />
  }

  return (
    <HashRouter>
      <Shell />
    </HashRouter>
  )
}
