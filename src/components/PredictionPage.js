import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  TextField,
  Button,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  Box,
  CircularProgress,
} from "@mui/material";

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
  const [loading, setLoading] = useState(false); // Loading state

  useEffect(() => {
    fetchFilters();
  }, []);

  const fetchFilters = async () => {
    try {
      const categoryResponse = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/categories`);
      const branchResponse = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/branches`);
      const districtResponse = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/districts`);

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

    setLoading(true); // Show loading
    setError("");
    setPredictions([]); // Clear previous predictions

    try {
      const response = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/predict`, {
        min_cutoff: parseFloat(formData.min_cutoff),
        max_cutoff: formData.cutoff,
        category: formData.category,
        branch: formData.branch,
        district: formData.district,
      });

      setPredictions(response.data.predicted_colleges || []);
    } catch (error) {
      console.error("❌ Error fetching prediction:", error);
      setError("Failed to fetch predictions.");
    } finally {
      setLoading(false); // Hide loading
    }
  };

  return (
    <Box sx={{ maxWidth: 600, margin: "auto", mt: 4, p: 3, boxShadow: 3, borderRadius: 2, bgcolor: "white" }}>
      <Typography variant="h4" align="center" gutterBottom>
        College Predictor
      </Typography>

      <TextField
        fullWidth
        margin="normal"
        label="Maths"
        type="number"
        name="maths"
        value={formData.maths}
        onChange={handleInputChange}
        onKeyDown={(e) => e.key === "Enter" && document.getElementById("physics").focus()}
      />

      <TextField
        id="physics"
        fullWidth
        margin="normal"
        label="Physics"
        type="number"
        name="physics"
        value={formData.physics}
        onChange={handleInputChange}
        onKeyDown={(e) => e.key === "Enter" && document.getElementById("chemistry").focus()}
      />

      <TextField
        id="chemistry"
        fullWidth
        margin="normal"
        label="Chemistry"
        type="number"
        name="chemistry"
        value={formData.chemistry}
        onChange={handleInputChange}
        onKeyDown={(e) => e.key === "Enter" && document.getElementById("min_cutoff").focus()}
      />
      <TextField fullWidth margin="normal" label="Calculated Cutoff" type="number" value={formData.cutoff} disabled />

      <TextField
        id="min_cutoff"
        fullWidth
        margin="normal"
        label="Min Cutoff"
        type="number"
        name="min_cutoff"
        value={formData.min_cutoff}
        onChange={handleInputChange}
        onKeyDown={(e) => e.key === "Enter" && document.getElementById("category").focus()}
      />

      <FormControl fullWidth margin="normal">
        <InputLabel>Category</InputLabel>
        <Select
          id="category"
          name="category"
          value={formData.category}
          onChange={handleInputChange}
          onKeyDown={(e) => e.key === "Enter" && document.getElementById("branch").focus()}
        >
          <MenuItem value="">Select Category</MenuItem>
          {filters.categories.map((cat, index) => (
            <MenuItem key={index} value={cat}>{cat}</MenuItem>
          ))}
        </Select>
      </FormControl>

      <FormControl fullWidth margin="normal">
        <InputLabel>Branch</InputLabel>
        <Select
          id="branch"
          name="branch"
          value={formData.branch}
          onChange={handleInputChange}
          onKeyDown={(e) => e.key === "Enter" && document.getElementById("district").focus()}
        >
          <MenuItem value="">Select Branch</MenuItem>
          {filters.branches.map((branch, index) => (
            <MenuItem key={index} value={branch}>{branch}</MenuItem>
          ))}
        </Select>
      </FormControl>

      <FormControl fullWidth margin="normal">
  <InputLabel shrink={true} id="district-label">District</InputLabel>
  <Select
    labelId="district-label"
    id="district"
    name="district"
    value={formData.district}
    onChange={handleInputChange}
    displayEmpty
    onKeyDown={(e) => e.key === "Enter" && document.getElementById("predict-button").focus()}
  >
    <MenuItem value="">
      <em>Select District</em>
    </MenuItem>
    {filters.districts.map((district, index) => (
      <MenuItem key={index} value={district}>{district}</MenuItem>
    ))}
  </Select>
</FormControl>

      <Button
        id="predict-button"
        fullWidth
        variant="contained"
        color="primary"
        sx={{ mt: 2 }}
        onClick={handlePredict}
        disabled={loading} // Disable button when loading
      >
        {loading ? <CircularProgress size={24} /> : "Predict Colleges"}
      </Button>

      <Typography variant="h5" sx={{ mt: 3 }} align="center">
        Predicted Colleges
      </Typography>

      {error && <Typography color="error" align="center">{error}</Typography>}

      {loading ? (
        <Box display="flex" justifyContent="center" sx={{ mt: 3 }}>
          <CircularProgress />
        </Box>
      ) : (
        <TableContainer component={Paper} sx={{ mt: 3 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell><b>College Name</b></TableCell>
                <TableCell><b>College Code</b></TableCell>
                <TableCell><b>Branch</b></TableCell>
                <TableCell><b>Average Cutoff</b></TableCell>
                <TableCell><b>District</b></TableCell>
                <TableCell><b>Category</b></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {predictions.map((college, index) => (
                <TableRow key={index}>
                  <TableCell>{college.college_name}</TableCell>
                  <TableCell>{college.college_code}</TableCell>
                  <TableCell>{college.branchname}</TableCell>
                  <TableCell>{college.average_cutoff}</TableCell>
                  <TableCell>{college.district}</TableCell>
                  <TableCell>{college.community}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Box>
  );
};

export default PredictionPage;
