import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { 
  BookOpen, Calendar, Eye, Heart, Share2, 
  Quote, Briefcase, Rocket, Trophy, Handshake,
  ChevronLeft, ChevronRight, Star, Users,
  Clock, TrendingUp, MessageCircle
} from 'lucide-react';

function Stories() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [storyType, setStoryType] = useState('all');
  const [selectedStory, setSelectedStory] = useState(null);
  const [likedStories, setLikedStories] = useState({});

  const storyTypes = [
    { id: 'all', name: 'All Stories', icon: <BookOpen />, color: 'emerald', count: 24 },
    { id: 'success', name: 'Success Stories', icon: <Trophy />, color: 'amber', count: 8 },
    { id: 'inspiration', name: 'Inspirational', icon: <Quote />, color: 'purple', count: 12 },
    { id: 'entrepreneur', name: 'Entrepreneurs', icon: <Briefcase />, color: 'blue', count: 6 },
    { id: 'achievement', name: 'Achievements', icon: <Rocket />, color: 'rose', count: 10 },
    { id: 'community', name: 'Community', icon: <Handshake />, color: 'green', count: 15 }
  ];

  useEffect(() => {
    fetchPosts();
  }, [page]);

  useEffect(() => {
    if (posts.length > 0 && !selectedStory) {
      setSelectedStory(posts[0]);
    }
  }, [posts]);

  const fetchPosts = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`/api/posts/category/Stories?page=${page}&limit=12`);
      setPosts(res.data.posts);
      setTotalPages(res.data.totalPages);
    } catch (error) {
      console.error('Error fetching stories:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStoryIcon = (type) => {
    const story = storyTypes.find(s => s.id === type);
    return story?.icon || <BookOpen />;
  };

  const getStoryColor = (type) => {
    const story = storyTypes.find(s => s.id === type);
    return story?.color || 'emerald';
  };

  const filteredStories = storyType === 'all' 
    ? posts 
    : posts.filter(post => post.tags?.some(tag => tag.toLowerCase().includes(storyType.toLowerCase())));

  const handleLike = (storyId) => {
    setLikedStories(prev => ({
      ...prev,
      [storyId]: !prev[storyId]
    }));
  };

 if (loading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center">
        <div className="relative">
          <div className="w-16 h-16 border-4 border-gray-200 border-t-emerald-600 rounded-full animate-spin"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <BookOpen className="w-6 h-6 text-emerald-600 animate-pulse" />
          </div>
        </div>
        <p className="mt-4 text-gray-600 font-medium">Loading stories post...</p>
      </div>
    );
  }
  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-emerald-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header with Pattern */}
        <div className="relative mb-12">
          <div className="absolute inset-0 flex items-center" aria-hidden="true">
            <div className="w-full border-t border-emerald-200"></div>
          </div>
          <div className="relative flex justify-center">
            <div className="bg-gradient-to-r from-emerald-600 to-green-600 p-4 rounded-2xl shadow-xl">
              <BookOpen className="w-8 h-8 text-white" />
            </div>
            <div className="ml-4 text-center">
              <h1 className="text-4xl font-bold text-gray-900">
                Inspirational <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-green-600">Stories</span>
              </h1>
              <p className="text-lg text-gray-600 mt-2">
                Real stories from Nigerian youths making a difference
              </p>
            </div>
          </div>
        </div>

        {/* Story Types - Modern Filter Pills */}
    

        {/* Featured Story - Modern Card Layout */}
        {selectedStory && (
          <div className="mb-16">
            <div className="relative group">
              {/* Background Decoration */}
              <div className="absolute -inset-1 bg-gradient-to-r from-emerald-600 to-green-600 rounded-3xl blur-xl opacity-20 group-hover:opacity-30 transition duration-300"></div>
              
              <div className="relative bg-white rounded-2xl overflow-hidden shadow-2xl">
                <div className="grid lg:grid-cols-2 gap-8">
                  {/* Image Section */}
                  <div className="relative h-full min-h-[500px] overflow-hidden">
                    {selectedStory.image ? (
                      <>
                        <img 
                          src={`https://umuahia-blog-3.onrender.com/${selectedStory.image}`}
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                          alt={selectedStory.title}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                      </>
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-emerald-600 to-green-600 flex items-center justify-center">
                        <Quote size={120} className="text-white/30" />
                      </div>
                    )}
                    
                    {/* Featured Badge */}
                    <div className="absolute top-6 left-6">
                      <span className="bg-gradient-to-r from-amber-500 to-orange-500 text-white px-4 py-2 rounded-full text-sm font-semibold shadow-lg flex items-center gap-2">
                        <Star className="w-4 h-4" />
                        Featured Story
                      </span>
                    </div>

                    {/* Author Info Overlay */}
                    <div className="absolute bottom-6 left-6 right-6">
                      <div className="flex items-center gap-4">
                        <img 
                          src={`https://ui-avatars.com/api/?name=${selectedStory.author?.fullName || 'Young Nigerian'}&background=ffffff&color=059669&size=60`}
                          className="rounded-xl w-14 h-14 border-2 border-white shadow-lg"
                          alt="Author"
                        />
                        <div className="text-white">
                          <h4 className="font-bold text-lg">{selectedStory.author?.fullName || 'Anonymous Hero'}</h4>
                          <div className="flex items-center gap-4 text-sm text-white/80">
                            <span className="flex items-center gap-1">
                              <Calendar className="w-4 h-4" />
                              {new Date(selectedStory.createdAt).toLocaleDateString()}
                            </span>
                            <span className="flex items-center gap-1">
                              <Clock className="w-4 h-4" />
                              5 min read
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Content Section */}
                  <div className="p-8 lg:p-12 flex flex-col justify-between">
                    <div>
                      {/* Story Type Badge */}
                      <div className="inline-flex items-center gap-2 bg-emerald-100 text-emerald-700 px-4 py-2 rounded-full text-sm font-medium mb-6">
                        {getStoryIcon(selectedStory.tags?.[0])}
                        {selectedStory.tags?.[0] || 'Inspirational Story'}
                      </div>

                      <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-6 leading-tight">
                        {selectedStory.title}
                      </h2>

                      <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                        {selectedStory.content.substring(0, 300)}...
                      </p>

                      {/* Impact Stats */}
                      <div className="grid grid-cols-3 gap-4 mb-8">
                        <div className="bg-gray-50 rounded-xl p-4 text-center">
                          <div className="text-2xl font-bold text-gray-900">{selectedStory.views || 0}</div>
                          <div className="text-sm text-gray-500 flex items-center justify-center gap-1">
                            <Eye className="w-4 h-4" /> Views
                          </div>
                        </div>
                        <div className="bg-gray-50 rounded-xl p-4 text-center">
                          <div className="text-2xl font-bold text-gray-900">{selectedStory.likes || 0}</div>
                          <div className="text-sm text-gray-500 flex items-center justify-center gap-1">
                            <Heart className="w-4 h-4" /> Likes
                          </div>
                        </div>
                        <div className="bg-gray-50 rounded-xl p-4 text-center">
                          <div className="text-2xl font-bold text-gray-900">24</div>
                          <div className="text-sm text-gray-500 flex items-center justify-center gap-1">
                            <Share2 className="w-4 h-4" /> Shares
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-wrap gap-4">
                      <Link
                        to={`/stories/${selectedStory._id}`}
                        className="flex-1 bg-gradient-to-r from-emerald-600 to-green-600 text-white px-8 py-4 rounded-xl font-semibold hover:shadow-xl hover:scale-105 transition-all duration-300 text-center"
                      >
                        Read Full Story
                      </Link>
                      <button 
                        onClick={() => handleLike(selectedStory._id)}
                        className="p-4 bg-rose-50 text-rose-600 rounded-xl hover:bg-rose-100 hover:scale-105 transition-all duration-300"
                      >
                        <Heart className={`w-6 h-6 ${likedStories[selectedStory._id] ? 'fill-current' : ''}`} />
                      </button>
                      <button className="p-4 bg-emerald-50 text-emerald-600 rounded-xl hover:bg-emerald-100 hover:scale-105 transition-all duration-300">
                        <Share2 className="w-6 h-6" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* More Stories Section */}
        {filteredStories.length === 0 ? (
          <div className="text-center py-20">
            <div className="inline-block p-6 bg-emerald-100 rounded-full mb-4">
              <BookOpen className="w-12 h-12 text-emerald-600" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">No stories available</h3>
            <p className="text-gray-500">Check back later for more inspiring stories.</p>
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-bold text-gray-900">
                More <span className="text-emerald-600">Inspiring</span> Stories
              </h2>
              <div className="flex items-center gap-2 text-emerald-600">
                <TrendingUp className="w-5 h-5" />
                <span className="font-medium">Trending Now</span>
              </div>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredStories.slice(1).map((post, index) => (
                <div 
                  key={post._id} 
                  className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 overflow-hidden"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  {/* Image Container */}
                  <div className="relative h-56 overflow-hidden">
                    {post.image ? (
                      <img 
                        src={`https://umuahia-blog-3.onrender.com/${post.image}`}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                        alt={post.title}
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-emerald-500 to-green-500 flex items-center justify-center">
                        <Quote className="w-16 h-16 text-white/30" />
                      </div>
                    )}
                    
                    {/* Overlay Gradient */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    
                    {/* Tags Overlay */}
                    <div className="absolute top-4 left-4 flex flex-wrap gap-2">
                      {post.tags?.slice(0, 2).map(tag => (
                        <span key={tag} className="bg-white/90 backdrop-blur-sm text-emerald-700 px-3 py-1 rounded-full text-xs font-medium shadow-lg">
                          #{tag}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-6">
                    {/* Author and Date */}
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-2">
                        <img 
                          src={`https://ui-avatars.com/api/?name=${post.author?.fullName || 'Story'}&background=059669&color=fff&size=32`}
                          className="rounded-full w-8 h-8"
                          alt="Author"
                        />
                        <span className="text-sm font-medium text-gray-700">
                          {post.author?.fullName || 'Youth Story'}
                        </span>
                      </div>
                      <span className="text-xs text-gray-500 flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {new Date(post.createdAt).toLocaleDateString()}
                      </span>
                    </div>

                    {/* Title */}
                    <h3 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2 group-hover:text-emerald-600 transition-colors">
                      {post.title}
                    </h3>

                    {/* Summary */}
                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                      {post.summary || post.content.substring(0, 100)}...
                    </p>

                    {/* Footer Stats and Actions */}
                    <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                      <div className="flex items-center gap-4">
                        <span className="text-xs text-gray-500 flex items-center gap-1">
                          <Eye className="w-4 h-4" />
                          {post.views || 0}
                        </span>
                        <button 
                          onClick={() => handleLike(post._id)}
                          className="text-xs text-gray-500 flex items-center gap-1 hover:text-rose-600 transition-colors"
                        >
                          <Heart className={`w-4 h-4 ${likedStories[post._id] ? 'fill-rose-600 text-rose-600' : ''}`} />
                          {post.likes || 0}
                        </button>
                        <span className="text-xs text-gray-500 flex items-center gap-1">
                          <MessageCircle className="w-4 h-4" />
                          {post.comments || 0}
                        </span>
                      </div>
                      
                      <Link
                        to={`/stories/${post._id}`}
                        className="text-emerald-600 hover:text-emerald-700 font-medium text-sm flex items-center gap-1 group-hover:gap-2 transition-all"
                      >
                        Read More
                        <ChevronRight className="w-4 h-4" />
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination - Modern Design */}
            {totalPages > 1 && (
              <div className="mt-16">
                <div className="flex items-center justify-between bg-white rounded-2xl shadow-lg p-4 max-w-md mx-auto">
                  <button
                    onClick={() => setPage(p => p - 1)}
                    disabled={page === 1}
                    className={`p-3 rounded-xl transition-all ${
                      page === 1 
                        ? 'text-gray-300 cursor-not-allowed' 
                        : 'text-emerald-600 hover:bg-emerald-50 hover:scale-110'
                    }`}
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  
                  <div className="flex items-center gap-2">
                    {[...Array(totalPages)].map((_, i) => (
                      <button
                        key={i + 1}
                        onClick={() => setPage(i + 1)}
                        className={`
                          w-10 h-10 rounded-xl font-medium transition-all duration-300
                          ${page === i + 1 
                            ? 'bg-gradient-to-r from-emerald-600 to-green-600 text-white shadow-lg scale-110' 
                            : 'text-gray-600 hover:bg-emerald-50 hover:text-emerald-600'
                          }
                        `}
                      >
                        {i + 1}
                      </button>
                    ))}
                  </div>

                  <button
                    onClick={() => setPage(p => p + 1)}
                    disabled={page === totalPages}
                    className={`p-3 rounded-xl transition-all ${
                      page === totalPages 
                        ? 'text-gray-300 cursor-not-allowed' 
                        : 'text-emerald-600 hover:bg-emerald-50 hover:scale-110'
                    }`}
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default Stories;