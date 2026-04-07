import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { Newspaper, Calendar, Eye, Clock, ArrowRight } from 'lucide-react';

function News() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    fetchPosts();
  }, [page]);

  const fetchPosts = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`/api/posts/category/News%20&%20Updates?page=${page}&limit=9`);
      setPosts(res.data.posts);
      setTotalPages(res.data.totalPages);
    } catch (error) {
      console.error('Error fetching news:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
     return (
       <div className="min-h-[60vh] flex flex-col items-center justify-center">
         <div className="relative">
           <div className="w-16 h-16 border-4 border-gray-200 border-t-emerald-600 rounded-full animate-spin"></div>
           <div className="absolute inset-0 flex items-center justify-center">
             <Newspaper className="w-6 h-6 text-emerald-600 animate-pulse" />
           </div>
         </div>
         <p className="mt-4 text-gray-600 font-medium">Loading news...</p>
       </div>
     );
   }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Header */}
      <div className="relative mb-12">
        <div className="absolute inset-0 flex items-center" aria-hidden="true">
          <div className="w-full border-t border-gray-200"></div>
        </div>
        <div className="relative flex justify-center">
          <div className="bg-white px-6 py-3 rounded-full shadow-sm flex items-center gap-3">
            <div className="bg-gradient-to-r from-green-600 to-emerald-600 p-2 rounded-full">
              <Newspaper className="text-white" size={24} />
            </div>
            <h2 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
              News & Updates
            </h2>
          </div>
        </div>
      </div>

      {posts.length === 0 ? (
        <div className="text-center py-16">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gray-100 rounded-full mb-4">
            <Newspaper className="w-10 h-10 text-gray-400" />
          </div>
          <h3 className="text-xl font-semibold text-gray-700 mb-2">No News Available</h3>
          <p className="text-gray-500">Check back later for the latest updates and announcements.</p>
        </div>
      ) : (
        <>
          {/* News Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {posts.map((post, index) => (
              <article 
                key={post._id} 
                className="group bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 hover:border-green-100"
              >
                {/* Image Container */}
                <div className="relative overflow-hidden h-48 bg-gray-100">
                  {post.image ? (
                    <img 
                      src={`http://localhost:5000${post.image}`}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      alt={post.title}
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-green-50 to-emerald-50 flex items-center justify-center">
                      <Newspaper className="w-12 h-12 text-green-300" />
                    </div>
                  )}
                  
                  {/* Category Badge */}
                  <div className="absolute top-4 left-4">
                    <span className="px-3 py-1.5 bg-white/95 backdrop-blur-sm text-green-700 text-xs font-semibold rounded-full shadow-sm">
                      News
                    </span>
                  </div>
                  
                  {/* Date Badge */}
                  <div className="absolute top-4 right-4">
                    <div className="px-3 py-1.5 bg-white/95 backdrop-blur-sm rounded-full shadow-sm flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-green-600" />
                      <span className="text-xs font-medium text-gray-600">
                        {new Date(post.createdAt).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric'
                        })}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6">
                  {/* Title */}
                  <h3 className="text-xl font-bold text-gray-800 mb-3 line-clamp-2 group-hover:text-green-700 transition-colors">
                    {post.title}
                  </h3>
                  
                  {/* Summary */}
                  <p className="text-gray-600 mb-4 line-clamp-3 text-sm leading-relaxed">
                    {post.summary || post.content.substring(0, 150)}...
                  </p>

                  {/* Footer */}
                  <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                    {/* Views */}
                    <div className="flex items-center gap-1.5 text-sm text-gray-500">
                      <Eye className="w-4 h-4" />
                      <span>{post.views || 0} views</span>
                    </div>

                    {/* Read More Link */}
                  <Link to={`/${post.category.toLowerCase().replace(/ & /g, '-')}/${post._id}`} className="btn btn-outline-primary btn-sm flex items-center gap-1 text-green-600 hover:text-green-800 transition-colors group-hover/link:translate-x-1"> 
                      <p> Read More</p>
                      <ArrowRight className="w-4 h-4 group-hover/link:translate-x-1 transition-transform" />
                    </Link>
                  </div>
                </div>

                {/* Hover Gradient Overlay */}
                <div className="absolute inset-0 border-2 border-transparent group-hover:border-green-200 rounded-2xl transition-colors pointer-events-none"></div>
              </article>
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="mt-12">
              <nav className="flex justify-center" aria-label="Pagination">
                <div className="flex items-center gap-2 bg-white px-4 py-3 rounded-xl shadow-sm border border-gray-100">
                  {/* Previous Button */}
                  <button
                    onClick={() => setPage(p => p - 1)}
                    disabled={page === 1}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                      page === 1
                        ? 'text-gray-400 cursor-not-allowed'
                        : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                    }`}
                  >
                    Previous
                  </button>

                  {/* Page Numbers */}
                  <div className="flex items-center gap-1 px-2">
                    {[...Array(totalPages)].map((_, i) => (
                      <button
                        key={i + 1}
                        onClick={() => setPage(i + 1)}
                        className={`w-10 h-10 rounded-lg text-sm font-medium transition-all ${
                          page === i + 1
                            ? 'bg-gradient-to-r from-green-600 to-emerald-600 text-white shadow-md shadow-green-200'
                            : 'text-gray-700 hover:bg-gray-100'
                        }`}
                      >
                        {i + 1}
                      </button>
                    ))}
                  </div>

                  {/* Next Button */}
                  <button
                    onClick={() => setPage(p => p + 1)}
                    disabled={page === totalPages}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                      page === totalPages
                        ? 'text-gray-400 cursor-not-allowed'
                        : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                    }`}
                  >
                    Next
                  </button>
                </div>
              </nav>

              {/* Page Info */}
              <p className="text-center text-sm text-gray-500 mt-4">
                Page {page} of {totalPages}
              </p>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default News;

