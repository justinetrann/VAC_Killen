import React, { useState, useEffect } from 'react';
import { Slide } from 'react-slideshow-image';
import Navbar from '../components/Navbar';
import { useAuth } from '../context/AuthContext';
import { initializeApp } from "firebase/app";
import { getFirestore, doc, setDoc, getDoc } from "firebase/firestore";
import { getStorage, ref, uploadBytes, getDownloadURL, deleteObject } from "firebase/storage";
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import 'react-slideshow-image/dist/styles.css';
import './Home.css';

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
const storage = getStorage(app);


function Home() {
  const { currentUser } = useAuth();
  const [flipped, setFlipped] = useState(Array(4).fill(false));
  const [isEditing, setIsEditing] = useState(false);
  const [content, setContent] = useState({});
  const [loading, setLoading] = useState(true);
  const [slideImages, setSlideImages] = useState([]);
  const [frontImages, setFrontImages] = useState({
    front1: '',
    front2: '',
    front3: '',
    front4: '',
  });

  useEffect(() => {
    const loadContentAndImages = async () => {
      setLoading(true);
      try {
        // Load page content
        const docRef = doc(db, "contents", "pageContent");
        const docSnap = await getDoc(docRef);
    
        if (docSnap.exists()) {
          setContent(docSnap.data());
        } else {
          console.log("No such document for page content!");
        }
    
        // Load slide images
        const imagesRef = doc(db, "images", "slideImages");
        const imagesSnap = await getDoc(imagesRef);
    
        if (imagesSnap.exists()) {
          setSlideImages(imagesSnap.data().urls);
        } else {
          console.log("No such document for slide images!");
        }
        
        // Load front images for white boxes
        const frontImagesRef = doc(db, "images", "frontImages");
        const frontImagesSnap = await getDoc(frontImagesRef);
    
        if (frontImagesSnap.exists()) {
          setFrontImages(frontImagesSnap.data());
        } else {
          console.log("No such document for front images!");
          // Initialize with default values if the document doesn't exist
          setFrontImages({
            front1: '',
            front2: '',
            front3: '',
            front4: '',
          });
        }
      } catch (error) {
        console.error("Error loading data: ", error);
      } finally {
        setLoading(false);
      }
    };
  
    loadContentAndImages();
  }, []);

  const handleImageUpload = async (event, boxId) => {
    if (!currentUser) return;
  
    const file = event.target.files[0];
    if (!file) return;
  
    const storageRef = ref(storage, `frontImages/${boxId}/${file.name}`);
    await uploadBytes(storageRef, file);
  
    const downloadURL = await getDownloadURL(storageRef);
    
    setFrontImages(prev => ({ ...prev, [boxId]: downloadURL }));
  
    const imagesRef = doc(db, "images", "frontImages");
    await setDoc(imagesRef, { [boxId]: downloadURL }, { merge: true });
  };

  // Handle image removal
  const handleRemoveImage = (imageToRemove) => {
    if (!currentUser) return;

    const newSlideImages = slideImages.filter(image => image !== imageToRemove);
    setSlideImages(newSlideImages);

    const imagesRef = doc(db, "images", "slideImages");
    setDoc(imagesRef, { urls: newSlideImages }, { merge: true });

    const imageRef = ref(storage, imageToRemove);
    deleteObject(imageRef).then(() => {
      console.log('Image deleted successfully');
    }).catch((error) => {
      console.error('Error removing image: ', error);
    });
  };

  if (loading) {
    return <div className="loading-container"></div>;
  }

  const handleFocus = () => setIsEditing(true);

  const handleBlur = async (content, contentId) => {
    setIsEditing(false);
    setContent((prev) => ({ ...prev, [contentId]: content }));
    
    try {
      await setDoc(doc(db, "contents", "pageContent"), { [contentId]: content }, { merge: true });
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
                {currentUser && (
                  <button className="remove-button" onClick={() => handleRemoveImage(slideImage)}>Remove</button>
                )}
              </div>
            </div>
          ))}
        </Slide>
        {currentUser && (
            <input className="add-button" type="file" onChange={handleImageUpload} style={{ position: 'absolute', zIndex: 1000 }} />
        )}
      </div>
      <div className="what-we-believe">
        <h1>WHAT WE BELIEVE</h1>
      </div>
      <div className="what-we-believe-info">
        {currentUser ? (
          <ReactQuill 
            value={content.what_we_believe || ''} 
            onChange={(newContent) => handleBlur(newContent, 'what_we_believe')}
          />
        ) : (
          <div dangerouslySetInnerHTML={{ __html: content.what_we_believe || 'Click to Edit' }}></div>
        )}
      </div>
      <div className="container">
        <div className={`white-box ${flipped[0] ? 'flipped' : ''}`} onClick={() => handleFlip(0)}>
        <div className="front">
          <h1>OUR FAITH</h1>
          <img src={frontImages.front1} alt="Front 1" className="front-image"/>
          {currentUser && (
            <input type="file" onChange={(e) => handleImageUpload(e, 'front1')} />
          )}
        </div>
        <div className="back">
          {currentUser ? (
            <ReactQuill 
              value={content.our_faith || ''} 
              onChange={(newContent) => handleBlur(newContent, 'our_faith')}
              onFocus={handleFocus}
            />
          ) : (
            <div dangerouslySetInnerHTML={{ __html: content.our_faith || 'Click to Edit' }}></div>
          )}
        </div>
      </div>
      <div className={`white-box ${flipped[1] ? 'flipped' : ''}`} onClick={() => handleFlip(1)}>
        <div className="front">
          <h1>OUR GREAT COMMISSION MISSION</h1>
          <img src={frontImages.front2} alt="Front 2" className="front-image"/>
          {currentUser && (
            <input type="file" onChange={(e) => handleImageUpload(e, 'front2')} />
          )}
        </div>
        <div className="back">
          {currentUser ? (
              <ReactQuill 
                value={content.our_mission || ''} 
                onChange={(newContent) => handleBlur(newContent, 'our_mission')}
                onFocus={handleFocus}
              />
            ) : (
              <div dangerouslySetInnerHTML={{ __html: content.our_mission || 'Click to Edit' }}></div>
            )}
        </div>
      </div>
      <div className={`white-box ${flipped[2] ? 'flipped' : ''}`} onClick={() => handleFlip(2)}>
        <div className="front">
          <h1>IDENTITY</h1>
          <img src={frontImages.front3} alt="Front 3" className="front-image"/>
          {currentUser && (
            <input type="file" onChange={(e) => handleImageUpload(e, 'front3')} />
          )}
        </div>
        <div className="back">
          {currentUser ? (
              <ReactQuill 
                value={content.identity || ''} 
                onChange={(newContent) => handleBlur(newContent, 'identity')}
                onFocus={handleFocus}
              />
            ) : (
              <div dangerouslySetInnerHTML={{ __html: content.identity || 'Click to Edit' }}></div>
            )}
        </div>
      </div>
      <div className={`white-box ${flipped[3] ? 'flipped' : ''}`} onClick={() => handleFlip(3)}>
        <div className="front">
          <h1>STATEMENT OF FAITH</h1>
          <img src={frontImages.front4} alt="Front 4" className="front-image"/>
          {currentUser && (
            <input type="file" onChange={(e) => handleImageUpload(e, 'front4')} />
          )}
        </div>
        <div className="back">
          {currentUser ? (
              <ReactQuill 
                value={content.statement_of_faith || ''} 
                onChange={(newContent) => handleBlur(newContent, 'statement_of_faith')}
                onFocus={handleFocus}
              />
            ) : (
              <div dangerouslySetInnerHTML={{ __html: content.statement_of_faith || 'Click to Edit' }}></div>
            )}
        </div>
      </div>
      </div>
      <div className='statement-of-faith'>
        <h1>STATEMENT OF FAITH</h1>
        {currentUser ? (
            <ReactQuill 
              value={content.statement_of_faith_verse || ''} 
              onChange={(newContent) => handleBlur(newContent, 'statement_of_faith_verse')}
            />
          ) : (
            <div dangerouslySetInnerHTML={{ __html: content.statement_of_faith_verse || 'Click to Edit' }}></div>
          )}
      </div>
      <div style={{ height: '200px' }}>
      </div>
    </div>
  );
}

export default Home;
