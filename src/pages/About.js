import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { useAuthState } from 'react-firebase-hooks/auth';
import { getFirestore, doc, getDoc, setDoc } from "firebase/firestore";
import ReactQuill from 'react-quill';
import ImageResize from 'quill-image-resize-module-react';
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

const Quill = ReactQuill.Quill;
Quill.register('modules/imageResize', ImageResize);

function About() {
  const [user] = useAuthState(auth);
  const [location, setLocation] = useState(null);
  const [newLocationName, setNewLocationName] = useState('');
  const [editorContent, setEditorContent] = useState('');

  useEffect(() => {
    const fetchLocation = async () => {
      const locationDocRef = doc(firestore, "locations", "uniqueLocationId");
      const locationDocSnap = await getDoc(locationDocRef);
      
      if (locationDocSnap.exists()) {
        setLocation(locationDocSnap.data());
      } else {
        console.log("No such document for location!");
      }
    };

    fetchLocation();

    const fetchEditorContent = async () => {
      const editorDocRef = doc(firestore, "editorContent", "uniqueEditorId");
      const editorDocSnap = await getDoc(editorDocRef);
  
      if (editorDocSnap.exists()) {
        setEditorContent(editorDocSnap.data().content);
      } else {
        console.log("No such document for editor content!");
      }
    };
  
    fetchEditorContent();
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
      const editorDocRef = doc(firestore, "editorContent", "uniqueEditorId");
      await setDoc(editorDocRef, newContent, { merge: true });
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
            modules={{
              toolbar: [
                [{ 'header': '1'}, {'header': '2'}, { 'font': [] }],
                [{size: []}],
                ['bold', 'italic', 'underline', 'strike', 'blockquote'],
                [{'list': 'ordered'}, {'list': 'bullet'},
                 {'indent': '-1'}, {'indent': '+1'}],
                ['clean']
              ],
              imageResize: {},
            }}
          />
          <button className='editor-submit' onClick={handleQuillSubmit}>Update Content</button>
        </>
      ) : (null)}
      </div>
      <div className='editor-container-display'>
        <div className="content-display" dangerouslySetInnerHTML={{ __html: editorContent }}></div>
      </div>
    </div>
  );
}

export default About;