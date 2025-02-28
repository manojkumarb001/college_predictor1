import React from 'react';
import { Link } from 'react-router-dom';
import { Box, Typography, Button, Container, Card, CardContent } from '@mui/material';
import '../index.css';

function HomePage() {
  return (
    <Container maxWidth="md">
      <Box textAlign="center" mt={5}>
        <img src="/logo/logo.jpg" alt="College Predictor Logo" style={{ width: 120, height: 120 }} />
        <Typography variant="h3" fontWeight="bold" mt={2}>
          College Predictor System
        </Typography>
        <Typography variant="h6" color="textSecondary" mt={1}>
          The ultimate tool to predict which college you can get into based on your marks and preferences.
        </Typography>
      </Box>

      <Card elevation={3} sx={{ mt: 4, p: 3, borderRadius: 3 }}>
        <CardContent>
          <Typography variant="h5" fontWeight="medium">
            Welcome to the College Predictor
          </Typography>
          <Typography variant="body1" mt={2}>
            This system helps students predict the best colleges based on their marks, branch preferences, 
            and category. Whether you're looking to filter colleges by criteria or predict the best college for 
            your marks, we’ve got you covered.
          </Typography>
        </CardContent>
      </Card>

      <Box textAlign="center" mt={4}>
        <Typography variant="h6" fontWeight="medium" gutterBottom>
          Start exploring:
        </Typography>
        <Box display="flex" justifyContent="center" gap={2}>
          <Button variant="contained" color="primary" component={Link} to="/filter-colleges" size="large">
            Filter Colleges
          </Button>
          <Button variant="contained" color="secondary" component={Link} to="/register" size="large">
            Register
          </Button>
          <Button variant="contained" color="success" component={Link} to="/predict" size="large">
            Predict Colleges
          </Button>
        </Box>
      </Box>
    </Container>
  );
}

export default HomePage;
