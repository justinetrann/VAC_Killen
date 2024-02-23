// Importing React and other necessary components
import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Slide } from 'react-slideshow-image';
import 'react-slideshow-image/dist/styles.css';
import './App.css';

// Importing images
import image1 from './img/image1.jpg';
import image2 from './img/image2.jpg';
import image3 from './img/image3.jpg';

//Icons
import { faUser } from '@fortawesome/free-solid-svg-icons';
import { faBook } from '@fortawesome/free-solid-svg-icons';
import { faCalendar } from '@fortawesome/free-regular-svg-icons';
import { faAddressCard } from '@fortawesome/free-regular-svg-icons';

// Slide images array
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
      <nav className={`top-nav ${navBackground}`}>
        <div className="church-name">
          Vietnamese Alliance Church Killen
        </div>
        <div className="login top-right-login">
        <a href="#login">
          <FontAwesomeIcon icon={faUser} /> Login
        </a>
      </div>
      </nav>
      <nav className={`navbar ${navBackground}`}>
        <div className="nav-links">
          <a href="#about">About</a>
          <a href="#sermons">
            <FontAwesomeIcon icon={faBook} /> Sermons
          </a>
          <a href="#events">
          <FontAwesomeIcon icon={faCalendar} /> Events
          </a>
          <a href="#contact">
          <FontAwesomeIcon icon={faAddressCard} /> Contact
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
