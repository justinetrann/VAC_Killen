import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import logo from './img/logo.png';
import './App.css';

function App() {
  const [navBackground, setNavBackground] = useState('transparentNav');

  const handleScroll = () => {
    const show = window.scrollY > 50;
    if (show) {
      setNavBackground('darkNav');
    } else {
      setNavBackground('transparentNav');
    }
  };

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <Router>
      <div className="App">
        <nav className={`navbar ${navBackground}`}>
          <img src={logo} alt="Logo" className="logo" />
          <div className="church-name">
            <Link to="/">Vietnamese Alliance Church Killen</Link>
          </div>
          <div className="nav-links">
            <Link to="/">About</Link>
            <Link to="/">Sermons</Link>
            <Link to="/">Events</Link>
            <Link to="/">Contact</Link>
            <Link to="/login">Login</Link>
          </div>
        </nav>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          {/* Add other routes as needed */}
        </Routes>
      </div>
    </Router>
  );
}

export default App;
