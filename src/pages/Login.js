import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import { useNavigate } from 'react-router-dom';
import { initializeApp } from "firebase/app";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import useToast from '../hooks/useToast';
import './Login.css';

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

function Login() {
  const [formValues, setFormValues] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();
  const { showToast } = useToast();

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormValues({ ...formValues, [name]: value });
  };

  const validateForm = (values) => {
    const errors = {};
    if (!values.email) {
      errors.email = 'Email is a required field';
    } else if (!/\S+@\S+\.\S+/.test(values.email)) {
      errors.email = 'Invalid email format';
    }
    if (!values.password) {
      errors.password = 'Password is a required field';
    } else if (values.password.length < 6) {
      errors.password = 'Password must be at least 6 characters';
    }
    return errors;
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const validationErrors = validateForm(formValues);
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length === 0) {
      signInWithEmailAndPassword(auth, formValues.email, formValues.password)
        .then(() => {
          showToast('Logged in successfully');
          navigate('/'); // Adjust the path as per your routing setup
        })
        .catch((error) => {
          let errorMessage = 'Login failed. Please try again.';
          if (error.code === 'auth/user-not-found') {
            errorMessage = 'No user found with this email.';
          } else if (error.code === 'auth/wrong-password') {
            errorMessage = 'Incorrect password. Please try again.';
          }
          showToast(errorMessage);
          setErrors(prevErrors => ({
            ...prevErrors,
            firebase: errorMessage
          }));
        });
    }
  };

  return (
    <div className="Login">
      <Navbar />
      <form noValidate onSubmit={handleSubmit} className="form">
        <span>Login</span>
        <input
          type="email"
          name="email"
          onChange={handleChange}
          value={formValues.email}
          placeholder="Enter email id / username"
          className="form-control inp_text"
          id="email"
        />
        {errors.email && <p className="error">{errors.email}</p>}
        <input
          type="password"
          name="password"
          onChange={handleChange}
          value={formValues.password}
          placeholder="Enter password"
          className="form-control"
        />
        {errors.password && <p className="error">{errors.password}</p>}
        {errors.firebase && <p className="error">{errors.firebase}</p>}
        <button type="submit">Login</button>
      </form>
    </div>
  );
}

export default Login;
