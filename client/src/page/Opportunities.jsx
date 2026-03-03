import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const Posts = () => {
  const { category } = useParams();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPosts();
  }, [category]);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`https://umuahia-blog.onrender.com/api/posts?category=${category}`);
      setPosts(res.data);
    } catch (error) {
      console.error('Error fetching posts:', error);
    } finally {
      setLoading(false);
    }
  };

  const categoryIcons = {
    'News & Updates': '📰',
    'Opportunities': '💼',
    'Lifestyle': '🌟',
    'Culture': '🎭',
    'Stories': '📖',
    'Resources': '📚'
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto">
        <h1 className="text-3xl font-bold text-center mb-2">
          {categoryIcons[category]} {category}
        </h1>
        <p className="text-center text-gray-600 mb-8">
          {posts.length} {posts.length === 1 ? 'post' : 'posts'} found
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts.map((post) => (
            <div key={post._id} className="bg-white rounded-lg shadow-lg overflow-hidden">
              {post.image && (
                <img 
                  src={`http://localhost:5000${post.image}`} 
                  alt={post.title}
                  className="w-full h-48 object-cover"
                />
              )}
              <div className="p-6">
                <h2 className="text-xl font-semibold mb-3">{post.title}</h2>
                <p className="text-gray-600 mb-4">{post.content}</p>
                <div className="text-sm text-gray-500">
                  <p>By {post.author?.fullName || 'Unknown'}</p>
                  <p>{new Date(post.createdAt).toLocaleDateString()}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {posts.length === 0 && (
          <div className="text-center text-gray-600 mt-8">
            No posts available in this category yet.
          </div>
        )}
      </div>
    </div>
  );
};

export default Posts;