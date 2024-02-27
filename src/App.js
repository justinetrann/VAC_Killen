import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Home from './pages/Home';
import Sermon from './pages/Sermon';
import Login from './pages/Login';
import Events from './pages/Events';
import Contact from './pages/Contact';
import About from './pages/About';
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
        <Link to="/about">About</Link>
        <Link to="/sermons">Sermons</Link>
        <Link to="/events">Events</Link>
        <Link to="/contant">Contact</Link>
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
            <Route path="/about" element={<About />} />
            <Route path="/login" element={<Login />} />
            <Route path="/sermons" element={<Sermon />} />
            <Route path="/events" element={<Events />} />
            <Route path="/contact" element={<Contact />} />
            {/* Add other routes as needed */}
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
