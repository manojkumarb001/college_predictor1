import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Select from 'react-select';

function CollegeFilterPage() {
  const [colleges, setColleges] = useState([]);
  const [filteredColleges, setFilteredColleges] = useState([]);
  const [filters, setFilters] = useState({ districts: [], collegeCodes: [] });
  const [searchQuery, setSearchQuery] = useState({ college: '', district: '', collegeCode: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [collegesRes, filtersRes] = await Promise.all([
          axios.get('http://localhost:5000/all-colleges'),
          axios.get('http://localhost:5000/filters')
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
    setSearchQuery(prev => ({ ...prev, [field]: selectedOption ? selectedOption.value : '' }));
  };

  const handleSearchChange = (e) => {
    setSearchQuery(prev => ({ ...prev, college: e.target.value }));
  };

  useEffect(() => {
    setFilteredColleges(colleges.filter(college => (
      (!searchQuery.college || (college.college_name && college.college_name.toLowerCase().includes(searchQuery.college.toLowerCase()))) &&
      (!searchQuery.district || (college.college_district && college.college_district.toLowerCase().includes(searchQuery.district.toLowerCase()))) &&
      (!searchQuery.collegeCode || (college.code && college.code.toString().includes(searchQuery.collegeCode))) // Use `code` for filtering
    )));
  }, [searchQuery, colleges]);
  
  const resetFilters = () => {
    setSearchQuery({ college: '', district: '', collegeCode: '' });
  };

  return (
    <div>
      <h1>College Filter Page</h1>
      {error && <p>{error}</p>}
      {loading ? (
        <p>Loading...</p>
      ) : (
        <>
          <input
            type="text"
            placeholder="Search College Name"
            value={searchQuery.college}
            onChange={handleSearchChange}
          />
          <div className="filters">
            <Select
              options={filters.districts}
              onChange={(option) => handleFilterChange(option, 'district')}
              placeholder="Select District"
              isSearchable
            />
            <Select
              options={filters.collegeCodes}
              onChange={(option) => handleFilterChange(option, 'collegeCode')}
              placeholder="Select College Code"
              isSearchable
            />
          </div>
          <button onClick={resetFilters}>Reset Filters</button>
          <table>
            <thead>
              <tr>
                <th>College Name</th>
                <th>College Code</th>
                <th>District</th>
              </tr>
            </thead>
            <tbody>
  {filteredColleges.map((college, index) => (
    <tr key={index}>
      <td>{college.college_name}</td>
      <td>{college.code}</td>
      <td>{college.college_district}</td>
    </tr>
  ))}
</tbody>

          </table>
        </>
      )}
    </div>
  );
}

export default CollegeFilterPage;
