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

  const [flipped, setFlipped] = useState(Array(4).fill(false));

  const handleFlip = (index) => {
    const newFlipped = [...flipped];
    newFlipped[index] = !newFlipped[index];
    setFlipped(newFlipped);
  };

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
      <div className="what-we-believe">
        <h1>WHAT WE BELIEVE</h1>
      </div>
      <div className="what-we-believe-info">
        <h3>Do we actually do what we say we do? Are we authentic in our claims of bringing all of Jesus to all the world?</h3>
        <h3>In this module, you will learn more about what The Alliance believes, why we believe what we believe, 
          and what it really means to proclaim our beliefs in word and deed, “in the name of the Lord Jesus, 
          giving thanks to God the Father through him” (Col. 3:17).</h3>
      </div>
      <div className="container">
        <div className={`white-box ${flipped[0] ? 'flipped' : ''}`} onClick={() => handleFlip(0)}>
        <div className="front">
          <h1>OUR FAITH</h1>
        </div>
        <div className="back">
          <p>In The Alliance, we are Jesus people. We say “all of Jesus” because we’re after His Lordship, 
            His leading, and His truth. We long for a complete transformation in our lives through His Spirit.</p>
          <p>Scripture tells us that “the same power that raised Jesus from the grave is at work within us” (Rom. 6:10–11). 
            If we believe that, then our lives change. We don’t get as distracted by the latest fad or the newest way to do things 
            because our focus is on Jesus and His supremacy—in everything. We say, “all of Jesus,” because we also believe that it’s 
            possible to believe things about Jesus but not surrender our lives to Him. It is only in that full surrender that we resonate 
            with His heartbeat, offering the hope only He can provide to the world’s marginalized and overlooked. You see, “all of Jesus” is not 
            just for us; we’re redeemed for other people.</p>
        </div>
      </div>
      <div className={`white-box ${flipped[1] ? 'flipped' : ''}`} onClick={() => handleFlip(1)}>
        <div className="front">
          <h1>OUR GREAT COMMISSION MISSION</h1>
        </div>
        <div className="back">
          <p>“All authority in heaven and on earth has been given to me. Therefore go and make disciples of all nations, 
            baptizing them in the name of the Father and of the Son and of the Holy Spirit, and teaching them to obey everything 
            I have commanded you. And surely I am with you always, to the very end of the age.” – MATTHEW 28:18–20</p>
          <p>We believe in the Great Commission; this is what Jesus calls His disciples (us) to in Matthew 28:18-20. Our call, 
            as The Christian and Missionary Alliance, is the Great Commission. Everything we do is done in the Holy Spirit, by the Holy Spirit, 
            and through the Holy Spirit in order to take all of Jesus to all the world. Our mission is to be Great Commission people, to make disciples of all nations.</p>
        </div>
      </div>
      <div className={`white-box ${flipped[2] ? 'flipped' : ''}`} onClick={() => handleFlip(2)}>
        <div className="front">
          <h1>IDENTITY</h1>
        </div>
        <div className="back">
          <p>We start with Jesus. He is the source of our love, the cause of our worship, and the core of our message.
             Not only do we begin with Jesus, but we end with Jesus, too, and center ourselves around Him. Everything we are
              begins and ends with Him.</p>
          <p>Acts 1:8 says, “But you will receive power when the Holy Spirit comes on you; and you will be my witnesses in Jerusalem, and 
            in all Judea and Samaria, and to the ends of the earth.” 
            We rely on the Holy Spirit to fill us as we seek to fulfill our calling to every segment of society and spread the good news.</p>
          <p>We believe we are at our best when we do this together, serving in a local church and among a community of local churches. 
            We are a diverse family—children of God and brothers and sisters in Christ. We do life together.</p>
        </div>
      </div>
      <div className={`white-box ${flipped[3] ? 'flipped' : ''}`} onClick={() => handleFlip(3)}>
        <div className="front">
          <h1>STATEMENT OF FAITH</h1>
        </div>
        <div className="back">
          <p>What The Alliance believes about God, how He relates to us, and how we relate to Him is foundational in our teachings. 
            The Alliance wholeheartedly serves God and the people of His world based soundly on the Bible. We live and die by these 
            words and believe they bring the only life worth living—one wholly committed to our King Jesus.</p>
          <p>We believe that Jesus is our Savior, Sanctifier, Healer, and Coming King—this is what we call “the Fourfold Gospel,” the C&MA’s 
            spiritual DNA. Throughout its 100-plus year history, the C&MA has always been known for its distinctive, scripturally grounded views on a
            number of topics held within the Christian faith. Read more about our statements and perspectives below.</p>
        </div>
      </div>
      </div>
      <div className='statement-of-faith'>
        <h1>STATEMENT OF FAITH</h1>
      </div>
      <div style={{ height: '2000px' }}>
      </div>
    </div>
  );
}

export default App;
