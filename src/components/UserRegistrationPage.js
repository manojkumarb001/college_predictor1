import React, { useState } from 'react';
import axios from 'axios';
import { TextField, Button, Typography, Container, Paper, Grid, Snackbar, Alert } from '@mui/material';

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
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserData({ ...userData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('Sending Data:', userData);
    
    try {
      const response = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/register`, userData, {
        headers: { 'Content-Type': 'application/json' },
      });
      setMessage('User registered successfully!');
      setIsSuccess(true);
      console.log('Response:', response.data);
    } catch (err) {
      setMessage('Registration failed');
      setIsSuccess(false);
      console.error('Error:', err.response?.data || err.message);
    } finally {
      setOpenSnackbar(true);
    }
  };

  return (
    <Container maxWidth="sm">
      <Paper elevation={3} style={{ padding: 20, marginTop: 20 }}>
        <Typography variant="h4" align="center" gutterBottom>
          Register
        </Typography>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField fullWidth label="Name" name="name" value={userData.name} onChange={handleChange} required />
            </Grid>
            <Grid item xs={6}>
              <TextField fullWidth label="Gender" name="gender" value={userData.gender} onChange={handleChange} required />
            </Grid>
            <Grid item xs={6}>
              <TextField fullWidth label="Mobile Number" name="mobile" value={userData.mobile} onChange={handleChange} required />
            </Grid>
            <Grid item xs={12}>
              <TextField fullWidth label="School Name" name="school" value={userData.school} onChange={handleChange} required />
            </Grid>
            <Grid item xs={6}>
              <TextField fullWidth type="date" name="dob" value={userData.dob} onChange={handleChange} required InputLabelProps={{ shrink: true }} />
            </Grid>
            <Grid item xs={6}>
              <TextField fullWidth type="number" label="Age" name="age" value={userData.age} onChange={handleChange} required />
            </Grid>
            <Grid item xs={12}>
              <TextField fullWidth type="email" label="Email" name="email" value={userData.email} onChange={handleChange} required />
            </Grid>
            <Grid item xs={12}>
              <Button type="submit" variant="contained" color="primary" fullWidth>
                Register
              </Button>
            </Grid>
          </Grid>
        </form>
      </Paper>
      <Snackbar open={openSnackbar} autoHideDuration={3000} onClose={() => setOpenSnackbar(false)}>
        <Alert severity={isSuccess ? 'success' : 'error'}>{message}</Alert>
      </Snackbar>
    </Container>
  );
}

export default UserRegistrationPage;
