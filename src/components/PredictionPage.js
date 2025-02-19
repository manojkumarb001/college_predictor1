import React, { useState, useEffect } from "react";
import axios from "axios";

const PredictionPage = () => {
  const [filters, setFilters] = useState({
    categories: [],
    branches: [],
    districts: [],
  });

  const [formData, setFormData] = useState({
    maths: "",
    physics: "",
    chemistry: "",
    cutoff: "",
    min_cutoff: "",
    category: "",
    branch: "",
    district: "",
  });

  const [predictions, setPredictions] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchFilters();
  }, []);

  const fetchFilters = async () => {
    try {
      const categoryResponse = await axios.get("http://localhost:5000/categories");
      const branchResponse = await axios.get("http://localhost:5000/branches");
      const districtResponse = await axios.get("http://localhost:5000/districts");

      setFilters({
        categories: categoryResponse.data.categories || [],
        branches: branchResponse.data.branches || [],
        districts: districtResponse.data.districts || [],
      });
    } catch (error) {
      console.error("❌ Error fetching filters:", error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    const updatedFormData = { ...formData, [name]: value };

    if (["maths", "physics", "chemistry"].includes(name)) {
      const maths = parseFloat(updatedFormData.maths) || 0;
      const physics = parseFloat(updatedFormData.physics) || 0;
      const chemistry = parseFloat(updatedFormData.chemistry) || 0;
      updatedFormData.cutoff = maths + physics / 2 + chemistry / 2;
    }

    setFormData(updatedFormData);
  };

  const handlePredict = async () => {
    if (!formData.min_cutoff || isNaN(parseFloat(formData.min_cutoff))) {
      setError("⚠️ Please enter a valid minimum cutoff.");
      return;
    }

    try {
      const response = await axios.post("http://localhost:5000/predict", {
        min_cutoff: parseFloat(formData.min_cutoff),
        max_cutoff: formData.cutoff,
        category: formData.category,
        branch: formData.branch,
        district: formData.district,
      });

      setPredictions(response.data.predicted_colleges || []);
      setError("");
    } catch (error) {
      console.error("❌ Error fetching prediction:", error);
      setError("Failed to fetch predictions.");
    }
  };

  return (
    <div>
      <h2>College Predictor</h2>
      
      <label>Maths:</label>
      <input type="number" name="maths" value={formData.maths} onChange={handleInputChange} />

      <label>Physics:</label>
      <input type="number" name="physics" value={formData.physics} onChange={handleInputChange} />

      <label>Chemistry:</label>
      <input type="number" name="chemistry" value={formData.chemistry} onChange={handleInputChange} />

      <label>Calculated Cutoff:</label>
      <input type="number" value={formData.cutoff} disabled />

      <label>Min Cutoff:</label>
      <input type="number" name="min_cutoff" value={formData.min_cutoff} onChange={handleInputChange} />

      <label>Category:</label>
      <select name="category" value={formData.category} onChange={handleInputChange}>
        <option value="">Select Category</option>
        {filters.categories.map((cat, index) => (
          <option key={index} value={cat}>{cat}</option>
        ))}
      </select>

      <label>Branch:</label>
      <select name="branch" value={formData.branch} onChange={handleInputChange}>
        <option value="">Select Branch</option>
        {filters.branches.map((branch, index) => (
          <option key={index} value={branch}>{branch}</option>
        ))}
      </select>

      <label>District:</label>
      <select name="district" value={formData.district} onChange={handleInputChange}>
        <option value="">Select District</option>
        {filters.districts.map((district, index) => (
          <option key={index} value={district}>{district}</option>
        ))}
      </select>

      <button onClick={handlePredict}>Predict Colleges</button>

      <h3>Predicted Colleges:</h3>
      {error && <p style={{ color: "red" }}>{error}</p>}

      <table border="1">
        <thead>
          <tr>
            <th>College Name</th>
            <th>College Code</th>
            <th>Branch</th>
            <th>Average Cutoff</th>
            <th>District</th>
            <th>Category</th>
          </tr>
        </thead>
        <tbody>
          {predictions.length > 0 ? (
            predictions.map((college, index) => (
              <tr key={index}>
                <td>{college.college_name}</td>
                <td>{college.college_code}</td>
                <td>{college.branchname}</td>
                <td>{college.average_cutoff}</td>
                <td>{college.district}</td>
                <td>{college.community}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="6" style={{ textAlign: "center" }}>No predictions found.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default PredictionPage;