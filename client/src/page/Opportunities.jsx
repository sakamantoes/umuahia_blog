import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Briefcase, Calendar, Clock, MapPin, ExternalLink, Filter, Search } from 'lucide-react';

function Opportunities() {
  const [opportunities, setOpportunities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');

  useEffect(() => {
    fetchOpportunities();
  }, [page]);

  const fetchOpportunities = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`/api/posts/category/Opportunities?page=${page}&limit=9`);
      setOpportunities(res.data.posts);
      setTotalPages(res.data.totalPages);
    } catch (error) {
      console.error('Error fetching opportunities:', error);
    } finally {
      setLoading(false);
    }
  };

  const getOpportunityType = (title) => {
    const titleLower = title.toLowerCase();
    if (titleLower.includes('scholarship')) return 'Scholarship';
    if (titleLower.includes('job')) return 'Job';
    if (titleLower.includes('internship')) return 'Internship';
    if (titleLower.includes('competition')) return 'Competition';
    if (titleLower.includes('training')) return 'Training';
    return 'Opportunity';
  };

  const getTypeColor = (type) => {
    switch(type) {
      case 'Scholarship': return 'from-emerald-500 to-green-500';
      case 'Job': return 'from-blue-500 to-indigo-500';
      case 'Internship': return 'from-cyan-500 to-teal-500';
      case 'Competition': return 'from-amber-500 to-orange-500';
      case 'Training': return 'from-purple-500 to-pink-500';
      default: return 'from-gray-500 to-slate-500';
    }
  };

  const getTypeBgLight = (type) => {
    switch(type) {
      case 'Scholarship': return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'Job': return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'Internship': return 'bg-cyan-50 text-cyan-700 border-cyan-200';
      case 'Competition': return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'Training': return 'bg-purple-50 text-purple-700 border-purple-200';
      default: return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  const filteredOpportunities = opportunities.filter(opp => {
    const matchesSearch = opp.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         opp.content.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterType === 'all' || getOpportunityType(opp.title) === filterType;
    return matchesSearch && matchesFilter;
  });

   if (loading) {
      return (
        <div className="min-h-[60vh] flex flex-col items-center justify-center">
          <div className="relative">
            <div className="w-16 h-16 border-4 border-gray-200 border-t-emerald-600 rounded-full animate-spin"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <Briefcase className="w-6 h-6 text-emerald-600 animate-pulse" />
            </div>
          </div>
          <p className="mt-4 text-gray-600 font-medium">Loading opportunities...</p>
        </div>
      );
    }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center p-3 bg-gradient-to-r from-green-600 to-emerald-600 rounded-2xl shadow-lg mb-4">
            <Briefcase className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Opportunities
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Discover scholarships, jobs, internships, and training programs tailored for youth development
          </p>
        </div>

        {/* Search and Filter Bar */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search opportunities..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
              />
            </div>
            <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0">
              <button
                onClick={() => setFilterType('all')}
                className={`px-4 py-2 rounded-xl font-medium whitespace-nowrap transition-all ${
                  filterType === 'all' 
                    ? 'bg-gradient-to-r from-green-600 to-emerald-600 text-white shadow-md' 
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                All
              </button>
              {['Scholarship', 'Job', 'Internship', 'Competition', 'Training'].map((type) => (
                <button
                  key={type}
                  onClick={() => setFilterType(type)}
                  className={`px-4 py-2 rounded-xl font-medium whitespace-nowrap transition-all ${
                    filterType === type 
                      ? `bg-gradient-to-r ${getTypeColor(type)} text-white shadow-md` 
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>
        </div>

        {filteredOpportunities.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-2xl shadow-lg">
            <Briefcase className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-xl text-gray-500">No opportunities available at the moment.</p>
            <p className="text-gray-400 mt-2">Check back later for new opportunities</p>
          </div>
        ) : (
          <>
            {/* Results Count */}
            <div className="mb-6 text-gray-600">
              Showing <span className="font-semibold text-green-600">{filteredOpportunities.length}</span> opportunities
            </div>

            {/* Opportunities Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredOpportunities.map(opp => {
                const type = getOpportunityType(opp.title);
                return (
                  <div
                    key={opp._id}
                    className="group bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2"
                  >
                    {opp.image && (
                      <div className="relative h-48 overflow-hidden">
                        <img
                          src={`https://umuahia-blog-3.onrender.com/${opp.image}`}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                          alt={opp.title}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                        <div className="absolute top-4 right-4">
                          <span className={`px-3 py-1 rounded-full text-xs font-semibold bg-white/90 backdrop-blur-sm shadow-lg ${getTypeBgLight(type)}`}>
                            {type}
                          </span>
                        </div>
                      </div>
                    )}
                    
                    <div className="p-6">
                      {!opp.image && (
                        <div className="mb-4">
                          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getTypeBgLight(type)}`}>
                            {type}
                          </span>
                        </div>
                      )}

                      <h3 className="text-xl font-bold text-gray-800 mb-3 line-clamp-2 group-hover:text-green-600 transition-colors">
                        {opp.title}
                      </h3>

                      <p className="text-gray-600 mb-4 line-clamp-3">
                        {opp.summary || opp.content.substring(0, 120)}...
                      </p>

                      <div className="space-y-3 mb-6">
                        <div className="flex items-center text-sm text-gray-500">
                          <Calendar className="w-4 h-4 mr-2 text-green-500" />
                          Posted: {new Date(opp.createdAt).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric'
                          })}
                        </div>
                        
                        <div className="flex items-center text-sm text-gray-500">
                          <Clock className="w-4 h-4 mr-2 text-amber-500" />
                          Deadline: <span className="ml-1 font-medium text-amber-600">TBA</span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between pt-4 border-t border-gray-100">
              
                        <button className="text-sm text-gray-400 hover:text-green-600 transition-colors">
                          View Details →
                        </button>
                      </div>
                    </div>

                    {/* Type Indicator Line */}
                    <div className={`h-1 w-full bg-gradient-to-r ${getTypeColor(type)} transform origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-300`}></div>
                  </div>
                );
              })}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <nav className="mt-12">
                <ul className="flex justify-center items-center gap-2">
                  <li>
                    <button
                      onClick={() => setPage(p => p - 1)}
                      disabled={page === 1}
                      className={`px-4 py-2 rounded-xl font-medium transition-all ${
                        page === 1
                          ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                          : 'bg-white text-gray-700 hover:bg-green-50 hover:text-green-600 shadow-sm hover:shadow'
                      }`}
                    >
                      Previous
                    </button>
                  </li>
                  
                  {[...Array(totalPages)].map((_, i) => (
                    <li key={i + 1}>
                      <button
                        onClick={() => setPage(i + 1)}
                        className={`w-10 h-10 rounded-xl font-medium transition-all ${
                          page === i + 1
                            ? 'bg-gradient-to-r from-green-600 to-emerald-600 text-white shadow-md'
                            : 'bg-white text-gray-700 hover:bg-green-50 hover:text-green-600 shadow-sm hover:shadow'
                        }`}
                      >
                        {i + 1}
                      </button>
                    </li>
                  ))}
                  
                  <li>
                    <button
                      onClick={() => setPage(p => p + 1)}
                      disabled={page === totalPages}
                      className={`px-4 py-2 rounded-xl font-medium transition-all ${
                        page === totalPages
                          ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                          : 'bg-white text-gray-700 hover:bg-green-50 hover:text-green-600 shadow-sm hover:shadow'
                      }`}
                    >
                      Next
                    </button>
                  </li>
                </ul>
              </nav>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default Opportunities;