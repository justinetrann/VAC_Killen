import React, { useState, useEffect } from 'react';
import { initializeApp } from "firebase/app";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { getFirestore, collection, addDoc, doc, deleteDoc, query, onSnapshot } from "firebase/firestore";
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import './EventCalender.css';

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
const db = getFirestore(app);

const EventCalendar = () => {
  const [user, setUser] = useState(null);
  const [events, setEvents] = useState([]);
  const [newEventName, setNewEventName] = useState('');
  const [selectedDate, setSelectedDate] = useState(new Date());

  useEffect(() => {
    onAuthStateChanged(auth, setUser);
  }, []);

  useEffect(() => {
    const q = query(collection(db, "events"));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const events = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setEvents(events);
    });
    return () => unsubscribe();
  }, []);

  const handleDateChange = (selectedDate) => {
    console.log("Selected Date:", selectedDate);
    setSelectedDate(new Date(selectedDate));
  };

  const addEvent = async () => {
    if (!user) return;
  
    // Create a new date object from the selected date
    const dateWithTimezone = new Date(selectedDate);
    // Adjust the date to the start of the day in the user's local timezone
    dateWithTimezone.setHours(0, 0, 0, 0);
    // Offset the date to account for the timezone, ensuring it aligns with the start of the day in UTC
    dateWithTimezone.setMinutes(dateWithTimezone.getMinutes() - dateWithTimezone.getTimezoneOffset());
  
    await addDoc(collection(db, "events"), {
      name: newEventName,
      date: dateWithTimezone.toISOString().split('T')[0], // Convert to YYYY-MM-DD format
      userId: user.uid,
    });
    setNewEventName('');
  };

  const removeEvent = async (id) => {
    if (!user) return;

    await deleteDoc(doc(db, "events", id));
  };

  // Filter events for the currently selected date
  const eventsForSelectedDate = events.filter(event => {
    return new Date(event.date).toDateString() === selectedDate.toDateString();
  });

  const renderDayContent = ({ date, view }) => {
  if (view === 'month') {
    const dayEvents = events.filter(event => new Date(event.date).toDateString() === date.toDateString());
    if (dayEvents.length > 0) {
      return (
        <div>
          {dayEvents.map(event => (
            <div key={event.id} className="event-indicator">{event.name}</div>
          ))}
        </div>
      );
    }
  }
};

  return (
    <div className="event-calendar">
      <div>
        <Calendar
          onChange={handleDateChange}
          value={selectedDate}
          tileContent={renderDayContent}
        />
      </div>
      {user ? (
        <div>
          <input
            className='input-add-event'
            type="text"
            value={newEventName}
            onChange={(e) => setNewEventName(e.target.value)}
            placeholder="Event Name"
          />
          <button className="add-event-button" onClick={addEvent}>Add Event</button>
          <ul>
            {eventsForSelectedDate.map(event => (
              <li key={event.id}>
                {event.name}
                <button className="delete-event-button" onClick={() => removeEvent(event.id)}>Remove</button>
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </div>
  );
};
 
 export default EventCalendar;