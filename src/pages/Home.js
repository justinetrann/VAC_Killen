import React, { useState, useEffect } from 'react';
import { Slide } from 'react-slideshow-image';
import Navbar from '../components/Navbar';
import { useAuth } from '../context/AuthContext';
import { initializeApp } from "firebase/app";
import { getFirestore, doc, setDoc, getDoc } from "firebase/firestore";
import 'react-slideshow-image/dist/styles.css';
import './Home.css';

import image1 from './img/image1.jpg';
import image2 from './img/image2.jpg';
import image3 from './img/image3.jpg';
import front1 from './img/front1.png';
import front2 from './img/front2.png';
import front3 from './img/front3.png';
import front4 from './img/front4.png';

const slideImages = [image1, image2, image3];

const firebaseConfig = {
  apiKey: "AIzaSyCTpfM8O1jXnvUaRpT15ea53I7itKcPcQU",
  authDomain: "vackillen.firebaseapp.com",
  projectId: "vackillen",
  storageBucket: "vackillen.appspot.com",
  messagingSenderId: "367924533984",
  appId: "1:367924533984:web:5eb7df06c0d17c1d388e85"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

function Home() {
  const { currentUser } = useAuth();
  const [flipped, setFlipped] = useState(Array(4).fill(false));
  const [isEditing, setIsEditing] = useState(false);
  const [content, setContent] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadContent = async () => {
      setLoading(true);
      try {
        const docRef = doc(db, "contents", "pageContent");
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setContent(docSnap.data());
        } else {
          console.log("No such document!");
        }
      } catch (error) {
        console.error("Error loading document: ", error);
      } finally {
        setLoading(false);
      }
    };

    loadContent();
  }, []);

  if (loading) {
    return <div className="loading-container"></div>;
  }

  const handleFocus = () => setIsEditing(true);

  const handleBlur = async (event, contentId) => {
    const updatedContent = event.target.innerText;
    setContent(prev => ({ ...prev, [contentId]: updatedContent }));

    try {
      await setDoc(doc(db, "contents", "pageContent"), { [contentId]: updatedContent }, { merge: true });
      console.log("Document successfully updated!");
    } catch (error) {
      console.error("Error updating document: ", error);
    }
  };

  const handleFlip = (index) => {
    if (!isEditing) {
      const newFlipped = [...flipped];
      newFlipped[index] = !newFlipped[index];
      setFlipped(newFlipped);
    }
  };

  return (
    <div className="Home">
      <Navbar />
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
      <h3 contentEditable={!!currentUser}
          suppressContentEditableWarning={true}
          onBlur={(e) => handleBlur(e, 'what_we_believe')}>
          {content.what_we_believe || 'Click to Edit'}
      </h3>
      </div>
      <div className="container">
        <div className={`white-box ${flipped[0] ? 'flipped' : ''}`} onClick={() => handleFlip(0)}>
        <div className="front">
          <h1>OUR FAITH</h1>
          <img src={front1} alt="Front 1" className="front-image"/>
        </div>
        <div className="back">
          <p contentEditable={!!currentUser} 
            suppressContentEditableWarning={true} 
            onFocus={handleFocus} onBlur={(e) => handleBlur(e, 'our_faith')}>
          {content.our_faith || 'Click to Edit'}
          </p>
        </div>
      </div>
      <div className={`white-box ${flipped[1] ? 'flipped' : ''}`} onClick={() => handleFlip(1)}>
        <div className="front">
          <h1>OUR GREAT COMMISSION MISSION</h1>
          <img src={front2} alt="Front 2" className="front-image"/>
        </div>
        <div className="back">
          <p contentEditable={!!currentUser}
            suppressContentEditableWarning={true}
            onFocus={handleFocus} onBlur={(e) => handleBlur(e, 'our_great_commission_mission')}>
          {content.our_great_commission_mission || 'Click to Edit'}
          </p>
        </div>
      </div>
      <div className={`white-box ${flipped[2] ? 'flipped' : ''}`} onClick={() => handleFlip(2)}>
        <div className="front">
          <h1>IDENTITY</h1>
          <img src={front3} alt="Front 3" className="front-image"/>
        </div>
        <div className="back">
          <p contentEditable={!!currentUser} 
            suppressContentEditableWarning={true} 
            onFocus={handleFocus} onBlur={(e) => handleBlur(e, 'identity')}>
          {content.identity || 'Click to Edit'}
          </p>
        </div>
      </div>
      <div className={`white-box ${flipped[3] ? 'flipped' : ''}`} onClick={() => handleFlip(3)}>
        <div className="front">
          <h1>STATEMENT OF FAITH</h1>
          <img src={front4} alt="Front 4" className="front-image"/>
        </div>
        <div className="back">
          <p contentEditable={!!currentUser} 
            suppressContentEditableWarning={true} 
            onFocus={handleFocus} onBlur={(e) => handleBlur(e, 'statement_of_faith')}>
          {content.statement_of_faith || 'Click to Edit'}
          </p>
        </div>
      </div>
      </div>
      <div className='statement-of-faith'>
        <h1>STATEMENT OF FAITH</h1>
        <p contentEditable={!!currentUser} suppressContentEditableWarning={true} onBlur={(e) => handleBlur(e, 'statement_of_faith')}>
          {content.statement_of_faith || 'Click to Edit'}
        </p>
      </div>
      <div style={{ height: '200px' }}>
      </div>
    </div>
  );
}

export default Home;
