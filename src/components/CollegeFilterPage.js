import React, { useState, useEffect } from 'react';
import axios from 'axios';

function CollegeFilterPage() {
  const [colleges, setColleges] = useState([]);
  const [filteredColleges, setFilteredColleges] = useState([]);
  const [searchQuery, setSearchQuery] = useState({
    college: '',
    branch: '',
    community: '',
    min_cutoff: '',
    max_cutoff: ''
  });
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchColleges = async () => {
      try {
        const response = await axios.get('http://localhost:5000/all-colleges');
        console.log('Response:', response.data);
        setColleges(response.data);
        setFilteredColleges(response.data);
      } catch (err) {
        console.error("Error fetching colleges: ", err);
        setError('Failed to load colleges.');
      }
    };

    fetchColleges();
  }, []);

  // Handle filter change
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setSearchQuery(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  useEffect(() => {
    const filterColleges = () => {
      const filtered = colleges.filter(college => {
        return (
          (searchQuery.college ? college.College?.toLowerCase().includes(searchQuery.college.toLowerCase()) : true) &&
          (searchQuery.branch ? college.Branch?.toLowerCase().includes(searchQuery.branch.toLowerCase()) : true) &&
          (searchQuery.community ? college.Category?.toLowerCase() === searchQuery.community.toLowerCase() : true) &&
          (searchQuery.min_cutoff ? parseFloat(college.Cutoff) >= parseFloat(searchQuery.min_cutoff) : true) &&
          (searchQuery.max_cutoff ? parseFloat(college.Cutoff) <= parseFloat(searchQuery.max_cutoff) : true)
        );
      });
      setFilteredColleges(filtered);
    };

    filterColleges();
  }, [searchQuery, colleges]);

  return (
    <div>
      {error && <p>{error}</p>}

      <div>
        <input type="text" name="college" placeholder="College Name" value={searchQuery.college} onChange={handleFilterChange} />
        <input type="text" name="branch" placeholder="Branch" value={searchQuery.branch} onChange={handleFilterChange} />
        <input type="text" name="community" placeholder="Community" value={searchQuery.community} onChange={handleFilterChange} />
        <input type="number" name="min_cutoff" placeholder="Min Cutoff" value={searchQuery.min_cutoff} onChange={handleFilterChange} />
        <input type="number" name="max_cutoff" placeholder="Max Cutoff" value={searchQuery.max_cutoff} onChange={handleFilterChange} />
      </div>

      <table>
        <thead>
          <tr>
            <th>College Name</th>
            <th>Branch</th>
            <th>Cutoff</th>
            <th>Community</th>
          </tr>
        </thead>
        <tbody>
          {filteredColleges.map((college, index) => (
            <tr key={index}>
              <td>{college.College}</td>
              <td>{college.Branch}</td>
              <td>{college.Cutoff}</td>
              <td>{college.Category}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default CollegeFilterPage;
