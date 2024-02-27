import React, { useState, useEffect } from 'react';
import './Contact.css';
import Navbar from '../components/Navbar';
import { initializeApp } from "firebase/app";
import { getFirestore, doc, getDoc, setDoc } from "firebase/firestore";
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
   const [userEmail, setUserEmail] = useState(''); // Email from Firebase for logged-in users
   const [contactEmail, setContactEmail] = useState(''); // Input email for logged-out users
   const [contactTitle, setContactTitle] = useState('');
   const [contactMessage, setContactMessage] = useState('');
   const [newEmail, setNewEmail] = useState('');
   const [user, setUser] = useState(null); // State to keep track of the current user

   useEffect(() => {
       const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
           setUser(currentUser);
           if (currentUser) {
               const fetchEmail = async () => {
                   const docRef = doc(db, "users", currentUser.uid);
                   const docSnap = await getDoc(docRef);
                   if (docSnap.exists()) {
                       setUserEmail(docSnap.data().email);
                   } else {
                       console.log("No such document!");
                   }
               };
               fetchEmail();
           }
       });

       return () => unsubscribe();
   }, []);

   const handleContactSubmit = (e) => {
       e.preventDefault();
       const emailToSend = user ? userEmail : contactEmail; // Use user's email if logged in, otherwise use input email

       console.log(`Sending message from ${emailToSend} with title: ${contactTitle} and message: ${contactMessage}`);
       // Here you would send the email to the address stored in Firebase, using emailToSend as the "From" or "Reply-To"
   };

   const handleEmailUpdate = async (e) => {
       e.preventDefault();
       if (user) {
           await setDoc(doc(db, "users", user.uid), {
               email: newEmail
           }, { merge: true });
           setUserEmail(newEmail);
           setNewEmail('');
       }
   };

   return (
       <div className="contact-page">
           <Navbar />
           <h2>Contact Us</h2>
           <form onSubmit={handleContactSubmit}>
               {!user && (
                   <input
                       type="email"
                       placeholder="Your Email"
                       value={contactEmail}
                       onChange={(e) => setContactEmail(e.target.value)}
                       required
                   />
               )}
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
           {user && (
               <>
                   <h2>Update Contact Email</h2>
                   <form onSubmit={handleEmailUpdate}>
                       <input
                           type="email"
                           placeholder="New Email"
                           value={newEmail}
                           onChange={(e) => setNewEmail(e.target.value)}
                           required
                       />
                       <button type="submit">Update Email</button>
                   </form>
               </>
           )}
       </div>
   );
}

export default Contact;