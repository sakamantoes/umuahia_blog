import React, { useState, useEffect } from 'react';
import axios from 'axios';

const AnnouncementTicker = () => {
  const [announcements, setAnnouncements] = useState([]);

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  const fetchAnnouncements = async () => {
      try {
      const res = await axios.get('https://umuahia-blog.onrender.com/api/posts/announcements');
      setAnnouncements(res.data);
    } catch (error) {
      console.error('Error fetching announcements:', error);
    }
  };

  if (announcements.length === 0) return null;

  return (
    <div className="bg-yellow-100 border-yellow-400 border p-2 overflow-hidden">
      <div className="container mx-auto flex">
        <span className="font-bold mr-4 whitespace-nowrap">📢 Announcements:</span>
        <div className="overflow-hidden relative flex-1">
          <div 
            className="whitespace-nowrap animate-marquee"
            style={{
              animation: 'marquee 20s linear infinite'
            }}
          >
            {announcements.map((ann, index) => (
              <span key={ann._id} className="mx-8">
                <strong>{ann.type}:</strong> {ann.title} 
                {ann.link && <a href={ann.link} target="_blank" rel="noopener noreferrer" className="text-blue-600 ml-2">🔗</a>}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnnouncementTicker;