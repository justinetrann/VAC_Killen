import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import logo from './img/logo.png';
import './Navbar.css'; 

function Navbar() {
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
        <Link to="/">Vietnamese Alliance Church Killen</Link>
      </div>
      <div className="nav-links">
        <Link to="#about">About</Link>
        <Link to="#sermons">Sermons</Link>
        <Link to="#events">Events</Link>
        <Link to="#contact">Contact</Link>
        <Link to="/login">Login</Link>
      </div>
    </nav>
  );
}

export default Navbar;
