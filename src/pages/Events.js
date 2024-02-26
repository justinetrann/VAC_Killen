import React, { useState, useEffect, useCallback } from 'react';
import Navbar from '../components/Navbar';
import { initializeApp } from "firebase/app";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { getFirestore, collection, query, where, getDocs, doc, updateDoc, addDoc } from "firebase/firestore";
import { getStorage, ref, getDownloadURL, uploadBytes } from "firebase/storage";
import './Events.css';

const firebaseConfig = {
  apiKey: "AIzaSyCTpfM8O1jXnvUaRpT15ea53I7itKcPcQU",
  authDomain: "vackillen.firebaseapp.com",
  projectId: "vackillen",
  storageBucket: "vackillen.appspot.com",
  messagingSenderId: "367924533984",
  appId: "1:367924533984:web:5eb7df06c0d17c1d388e85"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

function Events() {
  const [user, setUser] = useState(null);
  const [title, setTitle] = useState('');
  const [date, setDate] = useState('');
  const [photos, setPhotos] = useState([]);
  const [events, setEvents] = useState([]);

  const fetchEvents = useCallback(async () => {
    if (!user) return; // Ensure there's a logged-in user
  
    const q = query(collection(db, "events"), where("userId", "==", user.uid));
    const querySnapshot = await getDocs(q);
    const loadedEvents = [];
    for (const doc of querySnapshot.docs) {
      const eventData = doc.data();
      eventData.id = doc.id;
  
      const photoRefs = eventData.photoUrls || [];
      const photoURLs = await Promise.all(photoRefs.map(async (url) => {
        return url;
      }));
      eventData.photoUrls = photoURLs;
      loadedEvents.push(eventData);
    }
    setEvents(loadedEvents);
  }, [user]);

  useEffect(() => {
    onAuthStateChanged(auth, async (user) => {
      if (user) {
        setUser(user);
        await fetchEvents();
      } else {
        setUser(null);
        setEvents([]);
      }
    });
  }, [fetchEvents]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) return; // Ensure there's a logged-in user
  
    // Add event to Firestore
    const docRef = await addDoc(collection(db, "events"), {
      title,
      date,
      userId: user.uid,
    });
  
    const photosUrls = await Promise.all([...photos].map(async (photo) => {
      const photoRef = ref(storage, `events/${docRef.id}/${photo.name}`);
      await uploadBytes(photoRef, photo);
      return getDownloadURL(photoRef);
    }));
  
    // Update the event with photo URLs
    await updateDoc(doc(db, "events", docRef.id), {
      photoUrls: photosUrls
    });
  
    // Reset form fields
    setTitle('');
    setDate('');
    setPhotos([]);
  
    // Refresh the events displayed in the UI
    await fetchEvents(); // This is where you place it
  };
  
  const handleFileChange = (e) => {
    setPhotos(e.target.files); // Update the photos state with the selected files
  };

  return (
    <div className="Events">
      <Navbar />
      {user && (
        <div className="form">
          <form onSubmit={handleSubmit}>
            <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Event Title" required />
            <input type="date" value={date} onChange={(e) => setDate(e.target.value)} required />
            <input type="file" multiple onChange={handleFileChange} />
            <button type="submit">Submit</button>
          </form>
        </div>
      )}
      <div className="event-gallery">
        {events.map((event) => (
          <div key={event.id} className="event">
            <h2>{event.title}</h2>
            <p>{event.date}</p>
            <div className="photos">
              {event.photoUrls?.map((url, index) => (
                <img key={index} src={url} alt={`Event ${event.title}`} />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Events;