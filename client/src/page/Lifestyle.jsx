import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { 
  Heart, 
  Calendar, 
  Eye, 
  Utensils, 
  Shirt, 
  Activity, 
  Wind,
  Sparkles,
  TrendingUp,
  Clock,
  BookOpen,
  Share2,
  Bookmark
} from 'lucide-react';

function Lifestyle() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [activeFilter, setActiveFilter] = useState('all');

  const filters = [
    { id: 'all', name: 'All', icon: <Sparkles /> },
    { id: 'fashion', name: 'Fashion', icon: <Shirt /> },
    { id: 'food', name: 'Food', icon: <Utensils /> },
    { id: 'health', name: 'Health', icon: <Heart /> },
    { id: 'fitness', name: 'Fitness', icon: <Activity /> },
    { id: 'wellness', name: 'Wellness', icon: <Wind /> }
  ];

  useEffect(() => {
    fetchPosts();
  }, [page, activeFilter]);

  const fetchPosts = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`/api/posts/category/Lifestyle?page=${page}&limit=9`);
      let filteredPosts = res.data.posts;
      
      if (activeFilter !== 'all') {
        filteredPosts = filteredPosts.filter(post => 
          post.tags?.some(tag => tag.toLowerCase().includes(activeFilter.toLowerCase())) ||
          post.title.toLowerCase().includes(activeFilter.toLowerCase()) ||
          post.content.toLowerCase().includes(activeFilter.toLowerCase())
        );
      }
      
      setPosts(filteredPosts);
      setTotalPages(res.data.totalPages);
    } catch (error) {
      console.error('Error fetching lifestyle posts:', error);
    } finally {
      setLoading(false);
    }
  };

  const getFilterIcon = (filterId) => {
    const filter = filters.find(f => f.id === filterId);
    return filter?.icon || <Heart />;
  };

  if (loading) {
     return (
       <div className="min-h-[60vh] flex flex-col items-center justify-center">
         <div className="relative">
           <div className="w-16 h-16 border-4 border-gray-200 border-t-emerald-600 rounded-full animate-spin"></div>
           <div className="absolute inset-0 flex items-center justify-center">
             <Heart className="w-6 h-6 text-emerald-600 animate-pulse" />
           </div>
         </div>
         <p className="mt-4 text-gray-600 font-medium">Loading lifestyle posts...</p>
       </div>
     );
   }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        
        {/* Header with Gradient */}
        <div className="relative mb-8">
          <div className="absolute inset-0 bg-gradient-to-r from-rose-500 to-pink-500 rounded-3xl opacity-10 blur-2xl"></div>
          <div className="relative flex items-center gap-6 bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-gray-100">
            <div className="bg-gradient-to-br from-rose-500 to-pink-500 p-4 rounded-2xl shadow-lg shadow-rose-500/20">
              <Heart className="text-white" size={36} />
            </div>
            <div>
              <div className="flex items-center gap-3 mb-2">
                <h2 className="text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
                  Lifestyle
                </h2>
                <span className="px-3 py-1 bg-rose-100 text-rose-600 rounded-full text-sm font-medium">
                  {posts.length} Articles
                </span>
              </div>
              <p className="text-gray-600 text-lg">
                Fashion, food, health & wellness for the modern youth
              </p>
            </div>
          </div>
        </div>

        {/* Modern Tips Banner */}
        <div className="relative mb-8 overflow-hidden rounded-2xl bg-gradient-to-r from-rose-500 to-pink-500">
          <div className="absolute inset-0 bg-black/10"></div>
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-32 translate-x-32"></div>
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full translate-y-24 -translate-x-24"></div>
          
          <div className="relative flex items-center gap-4 p-6">
            <div className="bg-white/20 backdrop-blur-sm p-3 rounded-xl">
              <Sparkles className="text-white" size={28} />
            </div>
            <div className="flex-1">
              <strong className="text-white text-lg block mb-1">Lifestyle Tips!</strong>
              <p className="text-white/90">
                Check out our latest articles on healthy living, fashion trends, and wellness advice.
              </p>
            </div>
            <div className="hidden md:flex items-center gap-3">
              <TrendingUp className="text-white/60" size={20} />
              <span className="text-white/60">Updated daily</span>
            </div>
          </div>
        </div>

        {/* Modern Filter Pills */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">
              Browse Categories
            </h3>
            <span className="text-xs text-gray-400">{filters.length} categories</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {filters.map(filter => (
              <button
                key={filter.id}
                className={`group relative flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-300 ${
                  activeFilter === filter.id 
                    ? 'bg-gradient-to-r from-rose-500 to-pink-500 text-white shadow-lg shadow-rose-500/25 scale-105' 
                    : 'bg-white text-gray-600 hover:bg-rose-50 hover:text-rose-600 border border-gray-200 hover:border-rose-200'
                }`}
                onClick={() => setActiveFilter(filter.id)}
              >
                <span className={`transition-transform duration-300 ${activeFilter === filter.id ? 'scale-110' : 'group-hover:scale-110'}`}>
                  {filter.icon}
                </span>
                {filter.name}
                {activeFilter === filter.id && (
                  <span className="absolute -top-1 -right-1 w-2 h-2 bg-white rounded-full animate-pulse"></span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Featured Article - Modern Card */}
        {posts.length > 0 && (
          <div className="relative group mb-12">
            <div className="absolute -inset-1 bg-gradient-to-r from-rose-500 to-pink-500 rounded-3xl opacity-20 group-hover:opacity-30 blur transition duration-500"></div>
            <div className="relative bg-white rounded-2xl overflow-hidden shadow-xl">
              <div className="grid md:grid-cols-2 gap-0">
                <div className="relative h-64 md:h-full overflow-hidden">
                  <img 
                      src={`https://umuahia-blog-3.onrender.com/${posts[0].image}`}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    alt={posts[0]?.title}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent"></div>
                  <div className="absolute top-4 left-4">
                    <span className="px-4 py-2 bg-white/90 backdrop-blur-sm text-rose-600 rounded-full text-sm font-semibold shadow-lg">
                      ⭐ Editor's Pick
                    </span>
                  </div>
                </div>
                <div className="p-8 md:p-10 flex flex-col justify-center">
                  <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
                    <Calendar size={14} />
                    {new Date(posts[0]?.createdAt).toLocaleDateString('en-US', { 
                      month: 'long', 
                      day: 'numeric', 
                      year: 'numeric' 
                    })}
                    <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
                    <Clock size={14} />
                    5 min read
                  </div>
                  
                  <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4 leading-tight">
                    {posts[0]?.title}
                  </h3>
                  
                  <p className="text-gray-600 mb-6 leading-relaxed">
                    {posts[0]?.content.substring(0, 180)}...
                  </p>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <img 
                        src={`https://ui-avatars.com/api/?name=${posts[0]?.author?.fullName || 'Admin'}&background=ff4d6d&color=fff&bold=true`}
                        className="rounded-full w-10 h-10 border-2 border-rose-100"
                        alt="Author"
                      />
                      <div>
                        <p className="font-semibold text-gray-900">{posts[0]?.author?.fullName || 'Admin'}</p>
                        <p className="text-xs text-gray-500">Staff Writer</p>
                      </div>
                    </div>
                    
                    <Link 
                      to={`/lifestyle/${posts[0]?._id}`} 
                      className="group/btn inline-flex items-center gap-2 bg-gradient-to-r from-rose-500 to-pink-500 text-white px-6 py-3 rounded-xl font-semibold hover:shadow-xl hover:shadow-rose-500/25 transition-all duration-300"
                    >
                      Read Article
                      <BookOpen className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Lifestyle Grid */}
        {posts.length === 0 ? (
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-rose-500 to-pink-500 rounded-3xl opacity-5 blur-2xl"></div>
            <div className="relative bg-white/80 backdrop-blur-sm rounded-3xl p-16 text-center border border-gray-100">
              <div className="w-24 h-24 bg-gradient-to-br from-rose-100 to-pink-100 rounded-3xl mx-auto mb-6 flex items-center justify-center">
                <Heart size={48} className="text-rose-400" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">No lifestyle posts yet</h3>
              <p className="text-gray-500 max-w-md mx-auto">
                We're working on bringing you the best lifestyle content. Check back soon!
              </p>
            </div>
          </div>
        ) : (
          <>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {posts.slice(1).map((post, index) => (
                <article 
                  key={post._id} 
                  className="group relative bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2"
                >
                  {/* Image Container */}
                  <div className="relative h-48 overflow-hidden">
                    {post.image ? (
                      <img 
                        src={`https://umuahia-blog-3.onrender.com/${post.image}`}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                        alt={post.title}
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-rose-100 to-pink-100 flex items-center justify-center">
                        <div className="bg-white/80 backdrop-blur-sm p-4 rounded-2xl">
                          {getFilterIcon(activeFilter)}
                        </div>
                      </div>
                    )}
                    
                    {/* Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    
                    {/* Category Badge */}
                    <span className="absolute top-4 left-4 px-3 py-1.5 bg-white/90 backdrop-blur-sm text-rose-600 rounded-full text-xs font-semibold shadow-lg">
                      {activeFilter !== 'all' ? activeFilter : 'Lifestyle'}
                    </span>
                    
                    {/* Quick Actions */}
                    <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <button className="p-2 bg-white/90 backdrop-blur-sm rounded-full hover:bg-white transition-colors">
                        <Bookmark size={14} className="text-gray-700" />
                      </button>
                      <button className="p-2 bg-white/90 backdrop-blur-sm rounded-full hover:bg-white transition-colors">
                        <Share2 size={14} className="text-gray-700" />
                      </button>
                    </div>
                  </div>
                  
                  {/* Content */}
                  <div className="p-6">
                    <div className="flex items-center gap-3 text-xs text-gray-500 mb-3">
                      <span className="flex items-center gap-1">
                        <Calendar size={12} />
                        {new Date(post.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                      </span>
                      <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
                      <span className="flex items-center gap-1">
                        <Eye size={12} />
                        {post.views || 0} views
                      </span>
                    </div>
                    
                    <h4 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-rose-600 transition-colors">
                      {post.title}
                    </h4>
                    
                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                      {post.summary || post.content.substring(0, 100)}...
                    </p>
                    
                    {/* Pro Tip Alert */}
                    {post.tags && post.tags.includes('tip') && (
                      <div className="mb-4 p-3 bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-xl">
                        <div className="flex items-start gap-2">
                          <span className="text-amber-600 text-lg">💡</span>
                          <span className="text-xs text-amber-700 font-medium">
                            Pro Tip: Check the full article for expert advice
                          </span>
                        </div>
                      </div>
                    )}
                    
                    {/* Footer */}
                    <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                      <div className="flex items-center gap-2">
                        <img 
                          src={`https://ui-avatars.com/api/?name=${post.author?.fullName || 'User'}&background=f8f9fa&color=ff4d6d&bold=true&size=32`}
                          className="rounded-full w-6 h-6"
                          alt={post.author?.fullName}
                        />
                        <span className="text-xs text-gray-600 truncate max-w-[80px]">
                          {post.author?.fullName || 'Admin'}
                        </span>
                      </div>
                      
                      <div className="flex items-center gap-3">
                        {post.likes > 0 && (
                          <span className="flex items-center gap-1 text-xs text-rose-500">
                            <Heart size={12} fill="currentColor" />
                            {post.likes}
                          </span>
                        )}
                        <Link 
                          to={`/lifestyle/${post._id}`}
                          className="text-sm font-medium text-rose-600 hover:text-rose-700 transition-colors"
                        >
                          Read →
                        </Link>
                      </div>
                    </div>
                  </div>
                </article>
              ))}
            </div>

            {/* Modern Pagination */}
            {totalPages > 1 && (
              <nav className="mt-12">
                <div className="flex items-center justify-center gap-2">
                  <button
                    onClick={() => setPage(p => p - 1)}
                    disabled={page === 1}
                    className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-300 ${
                      page === 1 
                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                        : 'bg-white text-gray-700 hover:bg-rose-500 hover:text-white shadow-md hover:shadow-lg'
                    }`}
                  >
                    ←
                  </button>
                  
                  <div className="flex gap-2">
                    {[...Array(totalPages)].map((_, i) => (
                      <button
                        key={i + 1}
                        onClick={() => setPage(i + 1)}
                        className={`w-10 h-10 rounded-xl font-medium transition-all duration-300 ${
                          page === i + 1
                            ? 'bg-gradient-to-r from-rose-500 to-pink-500 text-white shadow-lg shadow-rose-500/25 scale-110'
                            : 'bg-white text-gray-700 hover:bg-rose-50 hover:text-rose-600 shadow-md'
                        }`}
                      >
                        {i + 1}
                      </button>
                    ))}
                  </div>
                  
                  <button
                    onClick={() => setPage(p => p + 1)}
                    disabled={page === totalPages}
                    className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-300 ${
                      page === totalPages 
                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                        : 'bg-white text-gray-700 hover:bg-rose-500 hover:text-white shadow-md hover:shadow-lg'
                    }`}
                  >
                    →
                  </button>
                </div>
              </nav>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default Lifestyle;