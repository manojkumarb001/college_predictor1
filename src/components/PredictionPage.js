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
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchFilters();
  }, []);

  const fetchFilters = async () => {
    try {
      const categoryResponse = await axios.get("http://127.0.0.1:5000/categories");
      const branchResponse = await axios.get("http://127.0.0.1:5000/branches");
      const districtResponse = await axios.get("http://127.0.0.1:5000/districts");

      console.log("Category Response:", categoryResponse.data);
      console.log("Branch Response:", branchResponse.data);
      console.log("District Response:", districtResponse.data);

      setFilters({
        categories: categoryResponse.data.categories || [],
        branches: branchResponse.data.branches || [],
        districts: districtResponse.data.districts || [],
      });
    } catch (error) {
      console.error("❌ Error fetching filters:", error);
      setError("Failed to fetch filter data. Please try again later.");
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    const updatedFormData = { ...formData, [name]: value };

    if (["maths", "physics", "chemistry"].includes(name)) {
      const maths = parseFloat(updatedFormData.maths) || 0;
      const physics = parseFloat(updatedFormData.physics) || 0;
      const chemistry = parseFloat(updatedFormData.chemistry) || 0;
      updatedFormData.cutoff = (maths + physics / 2 + chemistry / 2).toFixed(2);
    }

    setFormData(updatedFormData);
  };

  const handlePredict = async () => {
    if (!formData.min_cutoff || isNaN(parseFloat(formData.min_cutoff))) {
      setError("⚠️ Please enter a valid minimum cutoff.");
      return;
    }

    setLoading(true);
    setError("");
    setPredictions([]);

    try {
      console.log("Sending request with:", formData);
      const response = await axios.post("http://127.0.0.1:5000/predict", {
        min_cutoff: parseFloat(formData.min_cutoff),
        max_cutoff: parseFloat(formData.cutoff),
        category: formData.category || "General",
        branch: formData.branch,
        district: formData.district,
      });

      console.log("Prediction Response:", response.data.predicted_colleges);
      setPredictions(response.data.predicted_colleges || []);
    } catch (error) {
      console.error("❌ Error fetching prediction:", error);
      setError("Failed to fetch predictions. Please check your input and try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ maxWidth: 700, margin: "auto", mt: 4, p: 3, boxShadow: 3, borderRadius: 2, bgcolor: "white" }}>
      <Typography variant="h4" align="center" gutterBottom>
        College Predictor
      </Typography>

      <TextField fullWidth margin="normal" label="Maths" type="number" name="maths" value={formData.maths} onChange={handleInputChange} />
      <TextField fullWidth margin="normal" label="Physics" type="number" name="physics" value={formData.physics} onChange={handleInputChange} />
      <TextField fullWidth margin="normal" label="Chemistry" type="number" name="chemistry" value={formData.chemistry} onChange={handleInputChange} />
      <TextField fullWidth margin="normal" label="Calculated Cutoff" type="number" value={formData.cutoff} disabled />

      <TextField fullWidth margin="normal" label="Min Cutoff" type="number" name="min_cutoff" value={formData.min_cutoff} onChange={handleInputChange} />

      <FormControl fullWidth margin="normal">
        <InputLabel>Category</InputLabel>
        <Select name="category" value={formData.category} onChange={handleInputChange}>
          <MenuItem value=""><em>Select Category</em></MenuItem>
          {filters.categories.map((cat, index) => (
            <MenuItem key={index} value={cat}>{cat}</MenuItem>
          ))}
        </Select>
      </FormControl>

      <FormControl fullWidth margin="normal">
        <InputLabel>Branch</InputLabel>
        <Select name="branch" value={formData.branch} onChange={handleInputChange}>
          <MenuItem value=""><em>Select Branch</em></MenuItem>
          {filters.branches.map((branch, index) => (
            <MenuItem key={index} value={branch}>{branch}</MenuItem>
          ))}
        </Select>
      </FormControl>

      <FormControl fullWidth margin="normal">
        <InputLabel>District</InputLabel>
        <Select name="district" value={formData.district} onChange={handleInputChange}>
          <MenuItem value=""><em>Select District</em></MenuItem>
          {filters.districts.map((district, index) => (
            <MenuItem key={index} value={district}>{district}</MenuItem>
          ))}
        </Select>
      </FormControl>

      <Button fullWidth variant="contained" color="primary" sx={{ mt: 2 }} onClick={handlePredict} disabled={loading}>
        {loading ? <CircularProgress size={24} /> : "Predict Colleges"}
      </Button>

      {error && <Typography color="error" align="center" sx={{ mt: 2 }}>{error}</Typography>}

      {loading ? (
        <Box display="flex" justifyContent="center" sx={{ mt: 3 }}>
          <CircularProgress />
        </Box>
      ) : predictions.length > 0 && (
        <TableContainer component={Paper} sx={{ mt: 3 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell><b>College Name</b></TableCell>
                <TableCell><b>College Code</b></TableCell>
                <TableCell><b>Branch</b></TableCell>
                <TableCell><b>District</b></TableCell>
                <TableCell><b>Category</b></TableCell>
                <TableCell><b>Cutoff Range</b></TableCell>
                <TableCell><b>No. of Students Selected</b></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {predictions.map((college, index) => (
                <TableRow key={index}>
                  <TableCell>{college.college_name}</TableCell>
                  <TableCell>{college.college_code}</TableCell>
                  <TableCell>{college.branch}</TableCell>
                  <TableCell>{college.district}</TableCell>
                  <TableCell>{college.category}</TableCell>
                  <TableCell>{`${college.min_cutoff} - ${college.max_cutoff}`}</TableCell>
                  <TableCell>{college.college_count}</TableCell>

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
