import React, { useState } from 'react';
import axios from 'axios';

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

    try {
      await axios.post('http://localhost:5000/register', userData);
      setMessage('User registered successfully!');
    } catch (err) {
      setMessage('Registration failed');
    }
  };

  return (
    <div>
      <h2>Register</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="name"
          value={userData.name}
          onChange={handleChange}
          placeholder="Name"
          required
        />
        <input
          type="number"
          name="age"
          value={userData.age}
          onChange={handleChange}
          placeholder="Age"
          required
        />
        <input
          type="text"
          name="gender"
          value={userData.gender}
          onChange={handleChange}
          placeholder="Gender"
          required
        />
        <input
          type="text"
          name="school"
          value={userData.school}
          onChange={handleChange}
          placeholder="School Name"
          required
        />
        <input
          type="date"
          name="dob"
          value={userData.dob}
          onChange={handleChange}
          placeholder="DOB"
          required
        />
        <input
          type="text"
          name="mobile"
          value={userData.mobile}
          onChange={handleChange}
          placeholder="Mobile Number"
          required
        />
        <input
          type="email"
          name="email"
          value={userData.email}
          onChange={handleChange}
          placeholder="Email"
          required
        />
        <button type="submit">Register</button>
      </form>

      {message && <p>{message}</p>}
    </div>
  );
}

export default UserRegistrationPage;
