import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import AnnouncementTicker from '../components/AnnouncementTicker';

const Home = () => {
  const [stats, setStats] = useState({ total: 0, byCommunity: [] });
  const [latestPosts, setLatestPosts] = useState([]);

  useEffect(() => {
    fetchStats();
    fetchLatestPosts();
  }, []);

  const fetchStats = async () => {
    try {
      const res = await axios.get('https://umuahia-blog.onrender.com/api/youth/stats');
      setStats(res.data);
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const fetchLatestPosts = async () => {
    try {
      const res = await axios.get('https://umuahia-blog.onrender.com/api/posts');
      setLatestPosts(res.data.slice(0, 6));
    } catch (error) {
      console.error('Error fetching posts:', error);
    }
  };

  const categories = [
    { name: 'News & Updates', icon: '📰', color: 'bg-blue-100' },
    { name: 'Opportunities', icon: '💼', color: 'bg-green-100' },
    { name: 'Lifestyle', icon: '🌟', color: 'bg-purple-100' },
    { name: 'Culture', icon: '🎭', color: 'bg-red-100' },
    { name: 'Stories', icon: '📖', color: 'bg-yellow-100' },
    { name: 'Resources', icon: '📚', color: 'bg-indigo-100' }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <AnnouncementTicker />
      
      {/* Hero Section */}
      <div className="bg-blue-600 text-white py-20">
        <div className="container mx-auto text-center">
          <h1 className="text-5xl font-bold mb-4">Umuahia South Youth Platform</h1>
          <p className="text-xl mb-8">Connect, Learn, and Grow with your community</p>
          <Link 
            to="/register" 
            className="bg-white text-blue-600 px-8 py-3 rounded-lg text-lg font-semibold hover:bg-gray-100"
          >
            Register Now
          </Link>
        </div>
      </div>

      {/* Stats Section */}
      <div className="container mx-auto py-16">
        <h2 className="text-3xl font-bold text-center mb-12">Our Community</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-lg shadow text-center">
            <div className="text-4xl font-bold text-blue-600">{stats.total}</div>
            <div className="text-gray-600">Registered Youth</div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow text-center">
            <div className="text-4xl font-bold text-green-600">{stats.byCommunity.length}</div>
            <div className="text-gray-600">Communities</div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow text-center">
            <div className="text-4xl font-bold text-purple-600">6</div>
            <div className="text-gray-600">Categories</div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow text-center">
            <div className="text-4xl font-bold text-orange-600">24/7</div>
            <div className="text-gray-600">Active Platform</div>
          </div>
        </div>
      </div>

      {/* Categories Grid */}
      <div className="container mx-auto py-16">
        <h2 className="text-3xl font-bold text-center mb-12">Explore Categories</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {categories.map((cat) => (
            <Link 
              key={cat.name} 
              to={`/posts/${cat.name}`}
              className={`${cat.color} p-8 rounded-lg shadow hover:shadow-lg transition-shadow`}
            >
              <div className="text-4xl mb-4">{cat.icon}</div>
              <h3 className="text-xl font-semibold">{cat.name}</h3>
            </Link>
          ))}
        </div>
      </div>

      {/* Latest Posts */}
      <div className="container mx-auto py-16">
        <h2 className="text-3xl font-bold text-center mb-12">Latest Updates</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {latestPosts.map((post) => (
            <div key={post._id} className="bg-white rounded-lg shadow overflow-hidden">
              {post.image && (
                <img 
                  src={`https://umuahia-api.onrender.com${post.image}`} 
                  alt={post.title}
                  className="w-full h-48 object-cover"
                />
              )}
              <div className="p-6">
                <span className="text-sm text-blue-600 font-semibold">{post.category}</span>
                <h3 className="text-xl font-semibold mt-2">{post.title}</h3>
                <p className="text-gray-600 mt-2">{post.content.substring(0, 100)}...</p>
                <div className="mt-4 text-sm text-gray-500">
                  By {post.author?.fullName || 'Unknown'} | {new Date(post.createdAt).toLocaleDateString()}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Home;