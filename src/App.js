import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Slide } from 'react-slideshow-image';
import 'react-slideshow-image/dist/styles.css';
import './App.css';

import image1 from './img/image1.jpg';
import image2 from './img/image2.jpg';
import image3 from './img/image3.jpg';
import logo from './img/logo.png';

import { faUser } from '@fortawesome/free-solid-svg-icons';

const slideImages = [image1, image2, image3];

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
    document.addEventListener('scroll', handleScroll);
    return () => {
      document.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <div className="App">
      <nav className={`navbar ${navBackground}`}>
        <img src={logo} alt="Logo" className="logo" />
        <div className="church-name">
          Vietnamese Alliance Church Killen
        </div>
        <div className="nav-links">
          <a href="#about">About</a>
          <a href="#sermons">Sermons</a>
          <a href="#events">Events</a>
          <a href="#contact">Contact</a>
          <a href="#login">
            <FontAwesomeIcon icon={faUser} /> Login
          </a>
        </div>
      </nav>
      <div className="slide-container">
        <Slide easing="ease">
          {slideImages.map((slideImage, index) => (
            <div className="each-slide" key={index}>
              <div style={{'backgroundImage': `url(${slideImage})`, height: '100vh', backgroundSize: 'cover'}}>
                <div className="overlay"></div>
              </div>
            </div>
          ))}
        </Slide>
      </div>
      <div style={{ height: '2000px' }}>
      </div>
    </div>
  );
}

export default App;
