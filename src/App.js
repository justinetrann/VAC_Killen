import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Slide } from 'react-slideshow-image';
import 'react-slideshow-image/dist/styles.css';
import './App.css';

import image1 from './img/image1.jpg';
import image2 from './img/image2.jpg';
import image3 from './img/image3.jpg';
import front1 from './img/front1.png';
import front2 from './img/front2.png';
import front3 from './img/front3.png';
import front4 from './img/front4.png';
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
          <img src={front1} alt="Front 1" className="front-image"/>
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
          <img src={front2} alt="Front 2" className="front-image"/>
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
          <img src={front3} alt="Front 3" className="front-image"/>
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
          <img src={front4} alt="Front 4" className="front-image"/>
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
        <p>There is one God (1), Creator of all things (2), who is infinitely perfect (3), existing eternally in three persons: Father, Son, and Holy Spirit. (4)</p>
        <p>Jesus Christ is the true God and the true man. (5) He was sent by the Father (6), conceived by the Holy Spirit and born of the virgin Mary. (7) He died on the cross, the Just for the unjust, (8) as a substitutionary sacrifice, (9) and all who believe in Him are justified on the ground of His shed blood. (10) He rose from the dead according to the Scriptures. (11) He is now at the right hand of Majesty on high as our great High Priest. (12) He will come again to establish His kingdom, righteousness and peace. (13)</p>
        <p>The Holy Spirit is a divine person, (14) sent to indwell, guide, teach, gift, empower, and bear His fruit in every believer, (15) He convicts the world of sin, of righteousness, and of judgment. (16)</p>
        <p>The Old and New Testaments, inerrant as originally given, were verbally inspired by God and are a complete revelation of His will for our salvation. They constitute the divine and only rule of Christian faith and practice. (17)</p>
        <p>Man was originally created in the image and likeness of God: (18) he fell through disobedience, incurring thereby both physical and spiritual death. All men are born with a sinful nature, (19) are separated from the life of God, and can be saved only through the atoning work of the Lord Jesus Christ. (20) The portion of the impenitent and unbelieving is existence forever in conscious torment; (21) and that of the believer, in everlasting joy and bliss. (22)</p>
        <p>Salvation has been provided through Jesus Christ for all people (23); Those who repent and believe in Him are justified by grace through faith (24), born again of the Holy Spirit (25), delivered from the dominion of darkness, transferred into the Kingdom of God’s Son(26), granted the gift of eternal life, and adopted as the children of God. (27).</p>
        <p>It is the will of God that each believer should be filled with the Holy Spirit and be sanctified wholly, (28) being separated from sin and the world and fully dedicated to the will of God, thereby receiving power for holy living and effective service. (29) This is both a crisis and a progressive experience wrought in the life of the believer subsequent to conversion. (30)</p>
        <p>Provision is made in the redemptive work of the Lord Jesus Christ for the healing of the whole person. (31) Prayer for the sick and anointing with oil are taught in the Scriptures (32) as privileges for the Church in this present age. (33)</p>
        <p>The Church consists of all those who believe on the Lord Jesus Christ, are redeemed through His blood, and are born again of the Holy Spirit. Christ is the Head of the Body, the Church, (34) which has been commissioned by Him to go into all the world as a witness, preaching the gospel to all nations. (35) The local church is a body of believers in Christ who are joined together for the worship of God, for edification through the Word of God, for prayer, fellowship, the proclamation of the gospel, and observance of the ordinances of Baptism and the Lord‘s Supper. (36)</p> 
        <p>There shall be a bodily resurrection of the just and of the unjust; for the former, a resurrection unto life; (37) for the latter, a resurrection unto judgment. (38)</p>
        <p>The second coming of the Lord Jesus Christ is imminent (39) and will be personal, visible, and premillennial. (40) This is the believer’s blessed hope and is a vital truth which is an incentive to holy living and faithful service. (41)</p> 
      </div>
      <div style={{ height: '200px' }}>
      </div>
    </div>
  );
}

export default App;
