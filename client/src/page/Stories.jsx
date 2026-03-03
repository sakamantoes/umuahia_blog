import React, { useState, useEffect } from 'react';
import axios from 'axios';

const YouthDirectory = () => {
  const [youth, setYouth] = useState([]);
  const [filter, setFilter] = useState('');
  const [communities, setCommunities] = useState([]);

  useEffect(() => {
    fetchYouth();
  }, []);

  const fetchYouth = async () => {
    try {
      const res = await axios.get('https://umuahia-blog.onrender.com/api/youth');
      setYouth(res.data);
      
      // Extract unique communities
      const uniqueCommunities = [...new Set(res.data.map(y => y.community))];
      setCommunities(uniqueCommunities);
    } catch (error) {
      console.error('Error fetching youth:', error);
    }
  };

  const filteredYouth = filter
    ? youth.filter(y => y.community === filter)
    : youth;

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto">
        <h1 className="text-3xl font-bold text-center mb-8">Youth Directory</h1>
        
        {/* Filter */}
        <div className="mb-8 text-center">
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="p-2 border rounded-lg"
          >
            <option value="">All Communities</option>
            {communities.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>

        {/* Youth Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredYouth.map((person) => (
            <div key={person._id} className="bg-white rounded-lg shadow-lg overflow-hidden">
              <div className="p-6">
                <h2 className="text-xl font-semibold mb-2">{person.fullName}</h2>
                <p className="text-gray-600 mb-2"><strong>Community:</strong> {person.community}</p>
                <p className="text-gray-600 mb-2"><strong>Occupation:</strong> {person.occupation || 'Not specified'}</p>
                <p className="text-gray-600"><strong>Email:</strong> {person.email}</p>
              </div>
            </div>
          ))}
        </div>

        {filteredYouth.length === 0 && (
          <p className="text-center text-gray-600 mt-8">No youth found in this community.</p>
        )}
      </div>
    </div>
  );
};

export default YouthDirectory;