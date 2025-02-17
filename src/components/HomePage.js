import React from 'react';
import { Link } from 'react-router-dom';
import '../index.css'; // Import the CSS file for styling

function HomePage() {
  return (
    <div className="home-container">
      <header className="home-header">
      <img
  src="/logo/logo.jpg" 
  alt="College Predictor Logo"
  className="logo"
/>
        <h1>College Predictor System</h1>
        <p className="tagline">
          The ultimate tool to predict which college you can get into based on your marks and preferences.
        </p>
      </header>
      
      <main className="home-main">
        <section className="intro-section">
          <h2>Welcome to the College Predictor</h2>
          <p>
            This system helps students predict the best colleges based on their marks, branch preferences,
            and category. Whether you're looking to filter colleges by criteria or predict the best
            college for your marks, we’ve got you covered.
          </p>
        </section>

        <section className="action-buttons">
          <h3>Start exploring:</h3>
          <div className="button-container">
            <Link to="/filter-colleges">
              <button className="action-button">Filter Colleges</button>
            </Link>
            <Link to="/register">
              <button className="action-button">Register</button>
            </Link>
            <Link to="/predict">
              <button className="action-button">Predict Colleges</button>
            </Link>
          </div>
        </section>
      </main>

   
    </div>
  );
}

export default HomePage;