import React, { useState, useEffect } from 'react';
import './Contact.css';
import Navbar from '../components/Navbar';
import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc, query, getDocs, deleteDoc, doc } from "firebase/firestore";
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
  
    useEffect(() => {
      const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
        setUser(currentUser);
        if (currentUser) {
          fetchMessages();
        }
      });
  
      return () => unsubscribe();
    }, []);
  
    const fetchMessages = async () => {
      const q = query(collection(db, "messages"));
      const querySnapshot = await getDocs(q);
      const fetchedMessages = [];
      querySnapshot.forEach((doc) => {
        fetchedMessages.push({ id: doc.id, ...doc.data() });
      });
      setMessages(fetchedMessages);
    };
  
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
      fetchMessages(); // Refresh messages after deletion
    };
  
    return (
      <div className="contact">
        <Navbar />
        <h1>{user ? 'Inbox' : 'Contact Us'}</h1>
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
                <p>Date: {message.date.toDate().toString()}</p>
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