import React from 'react'
import { Routes,Route, useNavigate, useLocation } from 'react-router-dom'
import Dashboard from './components/Dashboard'
import LandingPage from './components/LandingPage'
import CheckStatus from './components/CheckStatus'
import LoginPage from './components/LoginPage'
import StudentPayments from './components/StudentPayments'
import PrivateRoute from './components/PrivateRoute'

function App() {
  const navigate=useNavigate()
  const location=useLocation()
  const token = localStorage.getItem('token');
  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/studentLogin');
  };
  return (
    <div>
      <header className="bg-primary text-white py-4 shadow fixed-top">
        <div className="container d-flex justify-content-between align-items-center">
          <h1 className="h4 mb-0">Edviron Portal</h1>
          <nav>
          <ul className="nav-list d-flex gap-4 mb-0">
            <li className={`nav-item ${location.pathname === '/dashboard' ? 'active' : ''}`}onClick={() => navigate('/dashboard')}>Dashboard</li>
            {/* <li className={`nav-item ${location.pathname === '/school-transactions' ? 'active' : ''}`} onClick={() => navigate('/school-transactions')}>School Transactions</li> */}
            <li className={`nav-item ${location.pathname === '/checkStatus' ? 'active' : ''}`}onClick={() => navigate('/checkStatus')}>Check Status</li>
            {token ? (
                <>
                  <li className={`nav-item ${location.pathname === '/studentPayments' ? 'active' : ''}`} onClick={() => navigate('/studentPayments')}>Student Payments</li>
                  <li className="nav-item" onClick={handleLogout}>Student Logout</li>
                </>
              ) : (
                <li className={`nav-item ${location.pathname === '/studentLogin' ? 'active' : ''}`} onClick={() => navigate('/studentLogin')}>Student Login</li>
              )}
          </ul>
        </nav>

        </div>
      </header>
      <main className='main-content' >  
        <Routes>
        <Route path='/dashboard' element={<Dashboard/>} />
        <Route path='/' element={<LandingPage/>} />
        <Route path='/checkStatus' element={<CheckStatus/>}  />
        <Route path='/studentLogin' element={<LoginPage/>} />
        <Route path='/studentPayments' element={<PrivateRoute><StudentPayments/></PrivateRoute>} />
        
      </Routes>
      </main>
       <footer className="text-center py-3 bg-light border-top footer">
        <small>© {new Date().getFullYear()} Edviron. All rights reserved.</small>
      </footer>
    </div>
  )
}

export default App