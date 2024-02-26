import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCalendar, faNoteSticky, faFolder,faTrashCan } from '@fortawesome/free-solid-svg-icons';
import Navbar from '../components/Navbar';
import { initializeApp } from "firebase/app";
import { getAuth, onAuthStateChanged } from '@firebase/auth';
import { getFirestore, collection, addDoc, query, onSnapshot } from '@firebase/firestore';
import { getStorage, ref, uploadBytes, getDownloadURL } from '@firebase/storage';
import { doc, deleteDoc } from '@firebase/firestore';
import useToast from '../hooks/useToast';
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
  const [errorMessage, setErrorMessage] = useState("");
  const [sortCriteria, setSortCriteria] = useState('date');
  const [sortDirection, setSortDirection] = useState('asc');
  const { isShowing, message, showToast } = useToast();

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

   setShowForm(false); // Hide the form immediately after submission
   showToast('Please wait for the upload to complete.');

   let scheduleUrl = '', lessonUrl = '', audioUrl = '';

   try {
     // Conditionally Upload Schedule if selected
     if (scheduleFile.files[0]) {
       const scheduleRef = ref(storage, `schedules/${scheduleFile.files[0].name}`);
       const uploadSchedule = await uploadBytes(scheduleRef, scheduleFile.files[0]);
       scheduleUrl = await getDownloadURL(uploadSchedule.ref);
     }

     // Conditionally Upload Lesson if selected
     if (lessonFile.files[0]) {
       const lessonRef = ref(storage, `lessons/${lessonFile.files[0].name}`);
       const uploadLesson = await uploadBytes(lessonRef, lessonFile.files[0]);
       lessonUrl = await getDownloadURL(uploadLesson.ref);
     }

     // Conditionally Upload Audio if selected
     if (audioFile.files[0]) {
       const audioRef = ref(storage, `audios/${audioFile.files[0].name}`);
       const uploadAudio = await uploadBytes(audioRef, audioFile.files[0]);
       audioUrl = await getDownloadURL(uploadAudio.ref);
     }

     // Add document to Firestore with all URLs (even if some are empty)
     await addDoc(collection(db, "sermons"), {
       title: title.value,
       date: date.value,
       scheduleUrl,
       lessonUrl,
       audioUrl,
       userId: user ? user.uid : null, // Associate the sermon with the current user if logged in
     });

     // Clear form, reset error messages, and show success toast
     event.target.reset();
     setErrorMessage(""); // Clear any previous error messages
     showToast('Upload successful! Please refresh the page.');
   } catch (error) {
     console.error("Error submitting form: ", error);
     setErrorMessage("An error occurred while submitting the form. Please try again."); // Set error message
     showToast("An error occurred. Please try again."); // Show error toast
   }
};

 const toggleFormVisibility = () => {
   setShowForm(!showForm);
   document.body.classList.toggle('no-scroll', !showForm);
 };
 
 const deleteSermon = async (sermonId) => {
   if (!user) {
     showToast("You must be logged in to delete sermons.");
     return;
   }
 
   const confirmDelete = window.confirm("Are you sure you want to delete this sermon?");
   if (confirmDelete) {
     try {
       await deleteDoc(doc(db, "sermons", sermonId));
       showToast("Sermon deleted successfully.");
       // Optionally, refresh the sermons list after deletion
       const updatedSermons = sermons.filter(sermon => sermon.id !== sermonId);
       setSermons(updatedSermons);
     } catch (error) {
       console.error("Error deleting sermon: ", error);
       showToast("Failed to delete sermon. Please try again.");
     }
   }
 };

 const sortSermons = (sermons) => {
   return sermons.sort((a, b) => {
     if (sortCriteria === 'date') {
       const dateA = new Date(a.date);
       const dateB = new Date(b.date);
       return sortDirection === 'asc' ? dateA - dateB : dateB - dateA;
     } else if (sortCriteria === 'title') {
       const titleA = a.title.toUpperCase();
       const titleB = b.title.toUpperCase();
       if (titleA < titleB) {
         return sortDirection === 'asc' ? -1 : 1;
       } else if (titleA > titleB) {
         return sortDirection === 'asc' ? 1 : -1;
       }
     }
     return 0;
   });
 };

 const sortedSermons = sortSermons([...sermons]);

 return (
   <div className='Sermon'>
     <Navbar />
     <h1>Sermons</h1>
     <div className="sort-options">
        <select value={sortCriteria} onChange={(e) => setSortCriteria(e.target.value)}>
          <option value="date">Date</option>
          <option value="title">Title</option>
        </select>
        <select value={sortDirection} onChange={(e) => setSortDirection(e.target.value)}>
          <option value="asc">Ascending</option>
          <option value="desc">Descending</option>
        </select>
      </div>
      {errorMessage && <div className="error-message">{errorMessage}</div>}
      {isShowing && <div className="toast-message">{message}</div>}
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
      {sortedSermons.map(sermon => (
      <div key={sermon.id} className="sermon-item">
         <div className="sermon-date">{sermon.date}</div>
         <div className="sermon-title">{sermon.title}</div>
         <div className="sermon-files">
            {sermon.scheduleUrl && (
            <a href={sermon.scheduleUrl} download target="_blank" rel="noopener noreferrer">
               <FontAwesomeIcon icon={faCalendar} /> Schedule
            </a>
            )}
            {sermon.lessonUrl && (
            <a href={sermon.lessonUrl} download target="_blank" rel="noopener noreferrer">
               <FontAwesomeIcon icon={faNoteSticky} /> Lesson
            </a>
            )}
            <div>
            <audio controls>
               <source src={sermon.audioUrl} type="audio/mpeg" />
               Your browser does not support the audio element.
            </audio>
            </div>
         </div>
         {user && (
            <button className="delete-sermon-button" onClick={() => deleteSermon(sermon.id)}>
               <FontAwesomeIcon icon={faTrashCan} /> Delete
            </button>
         )}
      </div>
      ))}
      {user && (
         <div className="toggle-form-icon" onClick={toggleFormVisibility}>
            <FontAwesomeIcon icon={faFolder} />
         </div>
      )}
     </div>
   </div>
 );
}

export default Sermon;
