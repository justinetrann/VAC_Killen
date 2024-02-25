import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCalendar, faNoteSticky, faFolder } from '@fortawesome/free-solid-svg-icons';
import Navbar from '../components/Navbar';
import { initializeApp } from "firebase/app";
import { getAuth, onAuthStateChanged } from '@firebase/auth';
import { getFirestore, collection, addDoc, query, onSnapshot } from '@firebase/firestore';
import { getStorage, ref, uploadBytes, getDownloadURL } from '@firebase/storage';
import './Sermon.css';

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
 const auth = getAuth(app);
 const storage = getStorage(app);

function Sermon() {
  const [user, setUser] = useState(null);
  const [sermons, setSermons] = useState([]);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
   const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
     setUser(currentUser);
   });

   const fetchSermons = () => {
     const q = query(collection(db, 'sermons'));
     onSnapshot(q, (querySnapshot) => {
       const items = [];
       querySnapshot.forEach((doc) => {
         items.push({...doc.data(), id: doc.id});
       });
       setSermons(items);
     });
   };

   fetchSermons();

   return () => unsubscribe();
 }, []);

 const handleFormSubmit = async (event) => {
   event.preventDefault();
   const { title, date, scheduleFile, lessonFile, audioFile } = event.target.elements;

   try {
     // Upload Schedule
     const scheduleRef = ref(storage, `schedules/${scheduleFile.files[0].name}`);
     const uploadSchedule = await uploadBytes(scheduleRef, scheduleFile.files[0]);
     const scheduleUrl = await getDownloadURL(uploadSchedule.ref);

     // Upload Lesson
     const lessonRef = ref(storage, `lessons/${lessonFile.files[0].name}`);
     const uploadLesson = await uploadBytes(lessonRef, lessonFile.files[0]);
     const lessonUrl = await getDownloadURL(uploadLesson.ref);

     // Upload Audio
     const audioRef = ref(storage, `audios/${audioFile.files[0].name}`);
     const uploadAudio = await uploadBytes(audioRef, audioFile.files[0]);
     const audioUrl = await getDownloadURL(uploadAudio.ref);

     // Add document to Firestore with all URLs
     await addDoc(collection(db, "sermons"), { // Use db instead of firestore
       title: title.value,
       date: date.value,
       scheduleUrl,
       lessonUrl,
       audioUrl,
       userId: user.uid, // Associate the sermon with the current user
     });

     // Clear form and provide feedback or state update if needed
     event.target.reset();
   } catch (error) {
     console.error("Error submitting form: ", error);
   }
 };

 const toggleFormVisibility = () => {
   if (user) {
     setShowForm(!showForm);
   }
 };
 
 return (
   <div className='Sermon'>
     <Navbar />
     {showForm && <div className="overlay" onClick={() => setShowForm(false)}></div>}
     <div className="sermon-content">
      {showForm && user && (
         <form className="sermon-form" onSubmit={handleFormSubmit}>
         <div className="form-group">
            <input id="title" name="title" placeholder="Title" required />
         </div>

         <div className="form-group">
            <input id="date" name="date" type="date" required />
         </div>

         <div className="form-group">
            <label htmlFor="scheduleFile">Schedule (PDF, DOC, DOCX):</label>
            <input id="scheduleFile" name="scheduleFile" type="file" accept=".pdf,.doc,.docx"/>
         </div>

         <div className="form-group">
            <label htmlFor="lessonFile">Lesson (PDF, DOC, DOCX):</label>
            <input id="lessonFile" name="lessonFile" type="file" accept=".pdf,.doc,.docx"/>
         </div>

         <div className="form-group">
            <label htmlFor="audioFile">Audio File:</label>
            <input id="audioFile" name="audioFile" type="file" accept="audio/*"/>
         </div>

         <button type="submit">Submit</button>
         </form>
       )}

       {sermons.map(sermon => (
         <div key={sermon.id} className="sermon-item">
           <div className="sermon-date">Date: {sermon.date}</div>
           <div className="sermon-title">Title: {sermon.title}</div>
           <div className="sermon-files">
             <a href={sermon.scheduleUrl} target="_blank" rel="noopener noreferrer">
               <FontAwesomeIcon icon={faCalendar} /> Schedule
             </a>
             <a href={sermon.lessonUrl} target="_blank" rel="noopener noreferrer">
               <FontAwesomeIcon icon={faNoteSticky} /> Lesson
             </a>
             <a href={sermon.audioUrl} target="_blank" rel="noopener noreferrer">
               <FontAwesomeIcon icon="fa-solid fa-music" /> Audio
             </a>
           </div>
         </div>
       ))}
      <div className="toggle-form-icon" onClick={toggleFormVisibility}>
         <FontAwesomeIcon icon={faFolder} />
      </div>
     </div>
   </div>
 );
}

export default Sermon;
