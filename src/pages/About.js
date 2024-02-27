import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { useAuthState } from 'react-firebase-hooks/auth';
import { getFirestore, doc, getDoc, setDoc } from "firebase/firestore";
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import './About.css';

const firebaseConfig = {
  apiKey: "AIzaSyCTpfM8O1jXnvUaRpT15ea53I7itKcPcQU",
  authDomain: "vackillen.firebaseapp.com",
  projectId: "vackillen",
  storageBucket: "vackillen.appspot.com",
  messagingSenderId: "367924533984",
  appId: "1:367924533984:web:5eb7df06c0d17c1d388e85"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const firestore = getFirestore(app);

function About() {
  const [user] = useAuthState(auth);
  const [location, setLocation] = useState(null);
  const [newLocationName, setNewLocationName] = useState('');
  const [editorContent, setEditorContent] = useState('');

  useEffect(() => {
    const fetchLocation = async () => {
      const docRef = doc(firestore, "locations", "uniqueLocationId");
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        setLocation(docSnap.data());
      } else {
        console.log("No such document!");
      }
    };

    fetchLocation();
  }, []);

  const handleLocationSubmit = async (event) => {
    event.preventDefault(); // Prevent the form from refreshing the page
    if (user && newLocationName.trim() !== '') {
      const newLocation = { name: newLocationName };
      const docRef = doc(firestore, "locations", "uniqueLocationId");
      await setDoc(docRef, newLocation);
      setLocation(newLocation);
      setNewLocationName(''); // Reset input after submit
    } else {
      alert("You must be logged in and provide a location name!");
    }
  };

  const handleQuillSubmit = async () => {
    if (user) {
      const newContent = { content: editorContent };
      const docRef = doc(firestore, "locations", "uniqueLocationId");
      await setDoc(docRef, newContent, { merge: true }); // Merge with existing data
      setLocation(newContent);
      setEditorContent(''); // Reset editor content after submit
    } else {
      alert("You must be logged in to update content!");
    }
  };

  return (
    <div className='About'>
      <Navbar />
      <h1>About</h1>
      <div className='location'>
        {location && <div className='location-name'>Location: {location.name}</div>}
        {user ? (
          <>
            <form onSubmit={handleLocationSubmit}>
              <input
                className='input-location'
                type="text"
                placeholder="Enter new location name"
                value={newLocationName}
                onChange={(e) => setNewLocationName(e.target.value)}
              />
              <button className ='location-submit' type="submit">Update Location</button>
            </form>
          </>
        ) : ( null )}
      </div>
      <div className="editor-container">
      {user ? (
        <>
          <ReactQuill
            className="editor"
            theme="snow"
            value={editorContent}
            onChange={setEditorContent}
          />
          <button className='editor-submit' onClick={handleQuillSubmit}>Update Content</button>
        </>
      ) : (null)}
      </div>
    </div>
  );
}

export default About;
