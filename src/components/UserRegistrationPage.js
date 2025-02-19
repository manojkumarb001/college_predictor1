import React, { useState } from 'react';
import axios from 'axios';
import './UserRegistrationPage.css';

function UserRegistrationPage() {
  const [userData, setUserData] = useState({
    name: '',
    age: '',
    gender: '',
    school: '',
    dob: '',
    mobile: '',
    email: '',
  });
  const [message, setMessage] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserData({ ...userData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Sending Data:", userData);
  
    try {
      const response = await axios.post("http://localhost:5000/register", userData, {
        headers: { "Content-Type": "application/json" },
      });
      setMessage("User registered successfully!");
      console.log("Response:", response.data);
    } catch (err) {
      setMessage("Registration failed");
      console.error("Error:", err.response?.data || err.message);
    }
  };

  return (
    <div className="registration-container">
      <h2>Register</h2>
      <form className="registration-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <input
            type="text"
            name="name"
            value={userData.name}
            onChange={handleChange}
            placeholder="Name"
            required
          />
        </div>
        
        <div className="form-group">
          <input
            type="text"
            name="gender"
            value={userData.gender}
            onChange={handleChange}
            placeholder="Gender"
            required
          />
        </div>
        <div className="form-group">
          <input
            type="text"
            name="mobile"
            value={userData.mobile}
            onChange={handleChange}
            placeholder="Mobile Number"
            required
          />
        </div>
        <div className="form-group">
          <input
            type="text"
            name="school"
            value={userData.school}
            onChange={handleChange}
            placeholder="School Name"
            required
          />
        </div>

        <div className="form-group">
          <input
            type="date"
            name="dob"
            value={userData.dob}
            onChange={handleChange}
            placeholder="DOB"
            required
          />
        </div>
        <div className="form-group">
          <input
            type="number"
            name="age"
            value={userData.age}
            onChange={handleChange}
            placeholder="Age"
            required
          />
        </div>
        <div className="form-group">
          <input
            type="email"
            name="email"
            value={userData.email}
            onChange={handleChange}
            placeholder="Email"
            required
          />
        </div>
        
        
        <button type="submit">Register</button>
      </form>

      {message && <p className="form-message">{message}</p>}
    </div>
  );
}

export default UserRegistrationPage;
