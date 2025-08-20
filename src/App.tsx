import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom'
import Dashboard from './components/Dashboard'
import AuthGate from './components/AuthGate'
import GoodTimeJournal from './components/GoodTimeJournal'
import Prototypes from './components/Prototypes'
import FailureReframe from './components/FailureReframe'
import Odyssey from './components/Odyssey'
import Habits from './components/Habits'
import WeeklyReview from './components/WeeklyReview'
import Login from './components/Login'

export default function App() {
  return (
    <Router>
      <nav className="bg-white shadow p-4 flex gap-4">
        <Link to="/">Dashboard</Link>
        <Link to="/gtj">GTJ</Link>
        <Link to="/prototypes">Prototipos</Link>
        <Link to="/failure-reframe">Failure Reframe</Link>
        <Link to="/odyssey">Odyssey</Link>
        <Link to="/habits">Hábitos</Link>
        <Link to="/weekly">Revisión semanal</Link>
        <Link to="/login" className="ml-auto">Login</Link>
      </nav>
      <div className="p-4">
        <Routes>
          <Route
            path="/"
            element={
              <AuthGate>
                <Dashboard />
              </AuthGate>
            }
          />
          <Route path="/gtj" element={<GoodTimeJournal />} />
          <Route path="/prototypes" element={<Prototypes />} />
          <Route path="/failure-reframe" element={<FailureReframe />} />
          <Route path="/odyssey" element={<Odyssey />} />
          <Route path="/habits" element={<Habits />} />
          <Route path="/weekly" element={<WeeklyReview />} />
          <Route path="/login" element={<Login />} />
        </Routes>
      </div>
    </Router>
  )
}
