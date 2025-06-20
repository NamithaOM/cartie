import React, { useState } from 'react';
import axios from 'axios';
import Navbar from './Navbar';

const baseUrl = import.meta.env.VITE_BASE_URL;

export default function Register() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  });

  const [message, setMessage] = useState('');
  const [messageColor, setMessageColor] = useState('red');

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');

    try {
      const response = await axios.post(`${baseUrl}/api/auth/register`, formData);
      setMessage('Registration successful!');
      setMessageColor('green');
      console.log('User data:', response.data);
    } catch (error) {
      setMessage(error.response?.data?.message || 'Registration failed');
      setMessageColor('red');
    }
  };

  return (
    <>
      <Navbar />
      <div style={{ maxWidth: "400px", margin: "auto", padding: "20px" }}>
        <h2>Register</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="form-control"
              placeholder="Name"
              required
            />
          </div>
          <div className="mb-3">
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="form-control"
              placeholder="Email"
              required
            />
          </div>
          <div className="mb-3">
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="form-control"
              placeholder="Password"
              required
            />
          </div>
          <button type="submit" className="btn btn-primary w-100">
            Register
          </button>
        </form>
        {message && (
          <p style={{ color: messageColor, marginTop: "10px" }}>{message}</p>
        )}
      </div>
    </>
  );
}
