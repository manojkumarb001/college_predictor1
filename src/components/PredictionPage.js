import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Select from 'react-select'; // ✅ Import react-select for searchable dropdowns

function PredictionPage() {
  const [formData, setFormData] = useState({
    maths: '',
    physics: '',
    chemistry: '',
    category: '',
    branch: '',
    district: ''
  });

  const [filters, setFilters] = useState({ categories: [], branches: [], districts: [] });
  const [prediction, setPrediction] = useState([]);
  const [cutoff, setCutoff] = useState(null);
  const [minCutoff, setMinCutoff] = useState('');
  const [error, setError] = useState('');
  const [showMinCutoff, setShowMinCutoff] = useState(false);

  // ✅ Fetch Categories, Branches & Districts from Backend
  useEffect(() => {
    const fetchFilters = async () => {
      try {
        const response = await axios.get('http://localhost:5000/filters');
        
        if (response.data) {
          // ✅ Ensure Data is in Correct Format
          const categories = response.data.categories.map(item => ({
            value: item.value, label: item.label
          }));

          const branches = response.data.branches.map(item => ({
            value: item.value, label: item.label
          }));

          const districts = response.data.districts.map(item => ({
            value: item.value, label: item.label
          }));

          setFilters({ categories, branches, districts });
        } else {
          console.error("⚠️ No data received from API");
        }
      } catch (err) {
        console.error("❌ Error fetching filter options:", err);
        setError("Failed to load filter options.");
      }
    };

    fetchFilters();
  }, []);

  // ✅ Handle input field changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // ✅ Handle dropdown selections
  const handleSelectChange = (selectedOption, field) => {
    setFormData({ ...formData, [field]: selectedOption.value });
  };

  // ✅ Handle form submission for cutoff calculation
  const handleSubmit = (e) => {
    e.preventDefault();

    const maths = parseFloat(formData.maths);
    const physics = parseFloat(formData.physics);
    const chemistry = parseFloat(formData.chemistry);

    if (isNaN(maths) || isNaN(physics) || isNaN(chemistry)) {
      setError('Please enter valid numeric marks.');
      return;
    }

    const calculatedCutoff = maths + (physics / 2) + (chemistry / 2);
    setCutoff(calculatedCutoff);
    setShowMinCutoff(true);
  };

  // ✅ Handle prediction API request
  const handlePredict = async () => {
    if (!minCutoff) {
      setError("Please set a minimum cutoff before predicting.");
      return;
    }

    try {
      const response = await axios.post('http://localhost:5000/predict', { 
        ...formData, 
        min_cutoff: parseFloat(minCutoff),
        max_cutoff: cutoff
      });

      setPrediction(response.data);
      setError('');
    } catch (err) {
      console.error('Error fetching prediction:', err);
      setError('Failed to fetch predictions.');
    }
  };

  return (
    <div>
      <h2>College Prediction</h2>

      {/* ✅ Display API Fetch Error */}
      {error && <p style={{ color: 'red' }}>{error}</p>}
      
      {/* ✅ Form for Input */}
      <form onSubmit={handleSubmit}>
        <input type="number" name="maths" placeholder="Maths Marks" value={formData.maths} onChange={handleChange} required />
        <input type="number" name="physics" placeholder="Physics Marks" value={formData.physics} onChange={handleChange} required />
        <input type="number" name="chemistry" placeholder="Chemistry Marks" value={formData.chemistry} onChange={handleChange} required />

        {/* ✅ Dynamic Searchable Dropdowns */}
        <label>Category:</label>
        <Select options={filters.categories} onChange={(selectedOption) => handleSelectChange(selectedOption, 'category')} placeholder="Select Category" />

        <label>Branch:</label>
        <Select options={filters.branches} onChange={(selectedOption) => handleSelectChange(selectedOption, 'branch')} placeholder="Select Branch" />

        <label>District:</label>
        <Select options={filters.districts} onChange={(selectedOption) => handleSelectChange(selectedOption, 'district')} placeholder="Select District" />

        <button type="submit">Calculate Cutoff</button>
      </form>

      {cutoff && <h3>Your Calculated Cutoff: {cutoff}</h3>}

      {showMinCutoff && (
        <div>
          <p><strong>Note:</strong> Adjust the minimum cutoff range to filter colleges.</p>
          <input 
            type="number" 
            placeholder="Enter Minimum Cutoff" 
            value={minCutoff} 
            onChange={(e) => setMinCutoff(e.target.value)}
            required
          />
          <button onClick={handlePredict}>Predict Colleges</button>
        </div>
      )}

      {/* ✅ Display Predicted Colleges */}
      {prediction.length > 0 ? (
        <table>
          <thead>
            <tr>
              <th>College Name</th>
              <th>Branch</th>
              <th>District</th>
              <th>Category</th>
              <th>Average Cutoff</th>
            </tr>
          </thead>
          <tbody>
            {prediction.map((college, index) => (
              <tr key={index}>
                <td>{college.college_name}</td>
                <td>{college.branch}</td>
                <td>{college.district}</td>
                <td>{college.community}</td>
                <td>{college.average_cutoff}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No predictions available. Try different inputs.</p>
      )}
    </div>
  );
}

export default PredictionPage;
