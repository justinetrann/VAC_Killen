import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import logo from './img/logo.png';
import './Navbar.css';
import { useAuth } from '../context/AuthContext';
import useToast from '../hooks/useToast';

function Navbar() {
  const { currentUser, logout } = useAuth();
  const [navBackground, setNavBackground] = useState('transparentNav');
  const { isShowing, message, showToast } = useToast();

  const handleScroll = () => {
    const show = window.scrollY > 50;
    setNavBackground(show ? 'darkNav' : 'transparentNav');
  };

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = async () => {
    try {
      await logout();
      showToast('You have been logged out successfully');
    } catch (error) {
      console.error("Logout failed", error);
      showToast('Logout failed. Please try again.');
    }
  };

  return (
    <>
      <nav className={`navbar ${navBackground}`}>
        <img src={logo} alt="Logo" className="logo" />
        <div className="church-name">
          <Link to="/">Vietnamese Alliance Church Killeen</Link>
        </div>
        <div className="nav-links">
          <Link to="/about">About</Link>
          <Link to="/sermons">Sermons</Link>
          <Link to="/events">Events</Link>
          <Link to="/contact">Contact</Link>
          {currentUser ? (
            <button onClick={handleLogout}>Logout</button>
          ) : (
            <Link to="/login">Login</Link>
          )}
        </div>
      </nav>
      {isShowing && <div className="toast">{message}</div>}
    </>
  );
}

export default Navbar;
