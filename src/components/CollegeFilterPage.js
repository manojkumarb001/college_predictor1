import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Select from 'react-select';
import { TextField, Button, CircularProgress, Typography, Paper, Table, TableHead, TableBody, TableRow, TableCell, TableContainer } from '@mui/material';
import { Search, Refresh } from '@mui/icons-material';

function CollegeFilterPage() {
  const [colleges, setColleges] = useState([]);
  const [filteredColleges, setFilteredColleges] = useState([]);
  const [filters, setFilters] = useState({ districts: [], collegeCodes: [] });
  const [searchQuery, setSearchQuery] = useState({ college: '', district: '', collegeCode: '' });
  const [selectedDistrict, setSelectedDistrict] = useState(null);
  const [selectedCollegeCode, setSelectedCollegeCode] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [collegesRes, filtersRes] = await Promise.all([
          axios.get(`${process.env.REACT_APP_BACKEND_URL}/all-colleges`),
          axios.get(`${process.env.REACT_APP_BACKEND_URL}/filters`)
        ]);

        setColleges(collegesRes.data.colleges || []);
        setFilteredColleges(collegesRes.data.colleges || []);

        setFilters({
          districts: filtersRes.data.districts ? filtersRes.data.districts.map(d => ({ value: d, label: d })) : [],
          collegeCodes: filtersRes.data.college_codes ? filtersRes.data.college_codes.map(c => ({ value: c, label: c })) : []
        });
      } catch (err) {
        console.error('Failed to load data:', err);
        setError('Failed to load data.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleFilterChange = (selectedOption, field) => {
    if (field === 'district') setSelectedDistrict(selectedOption);
    if (field === 'collegeCode') setSelectedCollegeCode(selectedOption);
    setSearchQuery(prev => ({ ...prev, [field]: selectedOption ? selectedOption.value : '' }));
  };

  const handleSearchChange = (e) => {
    setSearchQuery(prev => ({ ...prev, college: e.target.value }));
  };

  useEffect(() => {
    setFilteredColleges(colleges.filter(college => (
      (!searchQuery.college || (college.college_name && college.college_name.toLowerCase().includes(searchQuery.college.toLowerCase()))) &&
      (!searchQuery.district || (college.college_district && college.college_district.toLowerCase().includes(searchQuery.district.toLowerCase()))) &&
      (!searchQuery.collegeCode || (college.code && college.code.toString().includes(searchQuery.collegeCode)))
    )));
  }, [searchQuery, colleges]);

  const resetFilters = () => {
    setSearchQuery({ college: '', district: '', collegeCode: '' });
    setSelectedDistrict(null);
    setSelectedCollegeCode(null);
  };

  return (
    <Paper elevation={3} style={{ padding: '20px', margin: '20px auto', maxWidth: '900px' }}>
      <Typography variant="h5" align="center" gutterBottom>College Filter Page</Typography>
      
      {error && <Typography color="error">{error}</Typography>}

      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', margin: '20px' }}>
          <CircularProgress />
        </div>
      ) : (
        <>
          <div style={{ display: 'flex', gap: '10px', marginBottom: '20px', flexWrap: 'wrap' }}>
            <TextField
              fullWidth
              label="Search College Name"
              variant="outlined"
              value={searchQuery.college}
              onChange={handleSearchChange}
              InputProps={{ startAdornment: <Search color="action" /> }}
            />

            <Select
              options={filters.districts}
              value={selectedDistrict}
              onChange={(option) => handleFilterChange(option, 'district')}
              placeholder="Select District"
              isSearchable
              styles={{ container: (base) => ({ ...base, flex: 1 }) }}
            />

            <Select
              options={filters.collegeCodes}
              value={selectedCollegeCode}
              onChange={(option) => handleFilterChange(option, 'collegeCode')}
              placeholder="Select College Code"
              isSearchable
              styles={{ container: (base) => ({ ...base, flex: 1 }) }}
            />

            <Button
              variant="contained"
              color="primary"
              startIcon={<Refresh />}
              onClick={resetFilters}
              style={{ minWidth: '150px' }}
            >
              Reset Filters
            </Button>
          </div>

          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow style={{ backgroundColor: '#007bff' }}>
                  <TableCell style={{ color: 'white', fontWeight: 'bold' }}>College Name</TableCell>
                  <TableCell style={{ color: 'white', fontWeight: 'bold' }}>College Code</TableCell>
                  <TableCell style={{ color: 'white', fontWeight: 'bold' }}>District</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredColleges.map((college, index) => (
                  <TableRow key={index} hover>
                    <TableCell>{college.college_name}</TableCell>
                    <TableCell>{college.code}</TableCell>
                    <TableCell>{college.college_district}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </>
      )}
    </Paper>
  );
}

export default CollegeFilterPage;
