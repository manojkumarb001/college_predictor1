import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { AppBar, Toolbar, Typography, Container, Box } from "@mui/material";
import HomePage from "./components/HomePage";
import CollegeFilterPage from "./components/CollegeFilterPage";
import UserRegistrationPage from "./components/UserRegistrationPage";
import PredictionPage from "./components/PredictionPage";
import "./index.css";

function App() {
  return (
    <Router>
      <Box className="container">
        {/* ✅ Fixed Header */}
        <AppBar position="fixed" sx={{ bgcolor: "white",color:"black",fontWeight:"bolder", zIndex: 1100 }}>
          <Toolbar>
            <Typography variant="h6" sx={{ flexGrow: 1 }}>
              College Predictor System
            </Typography>
          </Toolbar>
        </AppBar>

        {/* ✅ Add margin-top to avoid content being hidden behind fixed header */}
        <Container sx={{ flexGrow: 1, mt: 10 }}>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/filter-colleges" element={<CollegeFilterPage />} />
            <Route path="/register" element={<UserRegistrationPage />} />
            <Route path="/predict" element={<PredictionPage />} />
          </Routes>
        </Container>

        {/* ✅ Modern Footer */}
        <Box
          component="footer"
          sx={{
            textAlign: "center",
            py: 2,
            bgcolor: "#ebdedey",color:"black",
            mt: "auto",
          }}
        >
          <Typography variant="body2">&copy; 2025 College Predictor</Typography>
        </Box>
      </Box>
    </Router>
  );
}

export default App;
