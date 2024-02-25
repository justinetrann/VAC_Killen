import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import logo from './img/logo.png';
import './App.css';
import { AuthProvider, useAuth } from './context/AuthContext';

function Navbar() {
  const { currentUser, logout } = useAuth();
  const [navBackground, setNavBackground] = useState('transparentNav');

  const handleScroll = () => {
    const show = window.scrollY > 50;
    setNavBackground(show ? 'darkNav' : 'transparentNav');
  };

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={`navbar ${navBackground}`}>
      <img src={logo} alt="Logo" className="logo" />
      <div className="church-name">
        <Link to="/">Vietnamese Alliance Church Killeen</Link>
      </div>
      <div className="nav-links">
        <Link to="/">About</Link>
        <Link to="/">Sermons</Link>
        <Link to="/">Events</Link>
        <Link to="/">Contact</Link>
        {currentUser ? (
          <button onClick={() => logout()}>Logout</button>
        ) : (
          <Link to="/login">Login</Link>
        )}
      </div>
    </nav>
  );
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <Navbar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            {/* Add other routes as needed */}
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
