import React, { useState, useEffect } from 'react';
import './Contact.css';
import Navbar from '../components/Navbar';
import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc, query, deleteDoc, doc, orderBy, onSnapshot} from "firebase/firestore";
import { getAuth, onAuthStateChanged } from "firebase/auth";

const firebaseConfig = {
   apiKey: "AIzaSyCTpfM8O1jXnvUaRpT15ea53I7itKcPcQU",
   authDomain: "vackillen.firebaseapp.com",
   projectId: "vackillen",
   storageBucket: "vackillen.appspot.com",
   messagingSenderId: "367924533984",
   appId: "1:367924533984:web:5eb7df06c0d17c1d388e85"
};

const firebaseApp = initializeApp(firebaseConfig);
const db = getFirestore(firebaseApp);
const auth = getAuth(firebaseApp);

function Contact() {
    const [contactEmail, setContactEmail] = useState('');
    const [contactTitle, setContactTitle] = useState('');
    const [contactMessage, setContactMessage] = useState('');
    const [messages, setMessages] = useState([]);
    const [user, setUser] = useState(null);
    const [sortDirection, setSortDirection] = useState('asc');

    useEffect(() => {
        onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser);
        });

        const q = query(collection(db, 'messages'), orderBy('date', sortDirection));
        const unsubscribe = onSnapshot(q, (querySnapshot) => {
            const items = [];
            querySnapshot.forEach((doc) => {
                const data = doc.data();
                // Convert Firestore timestamp to JS Date object if necessary
                data.date = data.date ? data.date.toDate() : new Date();
                items.push({...data, id: doc.id});
            });
            setMessages(items);
        });

        return () => unsubscribe(); // Cleanup on unmount
    }, [sortDirection]);

    const handleContactSubmit = async (e) => {
        e.preventDefault();
        const messageData = {
          email: contactEmail,
          title: contactTitle,
          message: contactMessage,
          date: new Date()
        };
        await addDoc(collection(db, "messages"), messageData);
        setContactEmail('');
        setContactTitle('');
        setContactMessage('');
        alert("Message sent successfully!");
      };
    
      const handleDeleteMessage = async (id) => {
          await deleteDoc(doc(db, "messages", id));
          setMessages(messages.filter(message => message.id !== id));
      };
  
      const toggleSortDirection = () => {
          setSortDirection(prevDirection => prevDirection === 'asc' ? 'desc' : 'asc');
      };
  
    return (
      <div className="contact">
        <Navbar />
        <h1>{user ? 'Inbox' : 'Contact Us'}</h1>
        {user && (
                <button onClick={toggleSortDirection}>
                    Sort: {sortDirection === 'asc' ? 'Ascending' : 'Descending'}
                </button>
        )}
        <div className="contact-form">
          {!user && (
            <form onSubmit={handleContactSubmit}>
              <input
                type="email"
                placeholder="Your Email"
                value={contactEmail}
                onChange={(e) => setContactEmail(e.target.value)}
                required
              />
              <input
                type="text"
                placeholder="Title"
                value={contactTitle}
                onChange={(e) => setContactTitle(e.target.value)}
                required
              />
              <textarea
                placeholder="Message"
                value={contactMessage}
                onChange={(e) => setContactMessage(e.target.value)}
                required
              ></textarea>
              <button type="submit">Send Message</button>
            </form>
          )}
        {user && (
        <div>
        {messages.map((message) => (
            <div key={message.id} className="message-container">
                <p>Email: {message.email}</p>
                <p>Title: {message.title}</p>
                <p>Message: {message.message}</p>
                {/* Check if toDate exists and call it; otherwise, use the existing date value */}
                <p>Date: {message.date?.toDate ? message.date.toDate().toString() : message.date.toString()}</p>
                <button onClick={() => handleDeleteMessage(message.id)}>Delete</button>
            </div>
        ))}
        </div>
        )}
        </div>
      </div>
    );
  }
  
  export default Contact;