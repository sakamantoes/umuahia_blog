import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { 
  Book, Calendar, Eye, Download, FileText, 
  Video, Link as LinkIcon, GraduationCap, Laptop, Users,
  Search, Filter, ChevronLeft, ChevronRight,
  BookOpen, Briefcase, Award, Clock, TrendingUp
} from 'lucide-react';

function Resources() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [resourceType, setResourceType] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredPosts, setFilteredPosts] = useState([]);

  const resourceTypes = [
    { id: 'all', name: 'All Resources', icon: <Book />, color: 'blue' },
    { id: 'educational', name: 'Educational', icon: <GraduationCap />, color: 'purple' },
    { id: 'skill', name: 'Skill Dev', icon: <Laptop />, color: 'green' },
    { id: 'career', name: 'Career Guide', icon: <Users />, color: 'orange' },
    { id: 'pdf', name: 'PDF Guides', icon: <FileText />, color: 'red' },
    { id: 'video', name: 'Videos', icon: <Video />, color: 'pink' }
  ];

  useEffect(() => {
    fetchPosts();
  }, [page]);

  useEffect(() => {
    filterPosts();
  }, [posts, resourceType, searchTerm]);

  const fetchPosts = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`/api/posts/category/Resources?page=${page}&limit=12`);
      setPosts(res.data.posts);
      setTotalPages(res.data.totalPages);
    } catch (error) {
      console.error('Error fetching resources:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterPosts = () => {
    let filtered = [...posts];
    
    if (resourceType !== 'all') {
      filtered = filtered.filter(post => 
        post.tags?.some(tag => tag.toLowerCase().includes(resourceType.toLowerCase())) ||
        post.category?.toLowerCase().includes(resourceType.toLowerCase())
      );
    }
    
    if (searchTerm) {
      filtered = filtered.filter(post =>
        post.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.content?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.tags?.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }
    
    setFilteredPosts(filtered);
  };

  const getResourceIcon = (post) => {
    if (post.image?.includes('.pdf')) return <FileText className="text-red-500" />;
    if (post.image?.includes('.mp4') || post.image?.includes('.avi')) return <Video className="text-blue-500" />;
    if (post.tags?.includes('video')) return <Video className="text-blue-500" />;
    if (post.tags?.includes('pdf')) return <FileText className="text-red-500" />;
    if (post.link) return <LinkIcon className="text-green-500" />;
    return <BookOpen className="text-amber-500" />;
  };

  const getTypeColor = (type) => {
    const colors = {
      educational: 'purple',
      skill: 'green',
      career: 'orange',
      pdf: 'red',
      video: 'blue'
    };
    return colors[type] || 'gray';
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center">
        <div className="relative">
          <div className="w-16 h-16 border-4 border-gray-200 border-t-blue-600 rounded-full animate-spin"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <Book className="w-6 h-6 text-blue-600 animate-pulse" />
          </div>
        </div>
        <p className="mt-4 text-gray-600 font-medium">Loading resources...</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-2xl p-8 mb-8 text-white">
        <div className="flex items-center gap-4">
          <div className="bg-white/20 backdrop-blur-sm p-4 rounded-xl">
            <Book className="w-10 h-10" />
          </div>
          <div>
            <h1 className="text-3xl font-bold mb-2">Resource Library</h1>
            <p className="text-blue-100 text-lg">Educational materials, skill development & career guidance</p>
          </div>
        </div>
      </div>

      {/* Search and Filter Section */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-8">
        <div className="grid md:grid-cols-3 gap-4">
          <div className="md:col-span-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                placeholder="Search resources by title, topic, or keyword..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          <div>
            <select
              className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition bg-white"
              value={resourceType}
              onChange={(e) => setResourceType(e.target.value)}
            >
              {resourceTypes.map(type => (
                <option key={type.id} value={type.id}>{type.name}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Quick Filter Chips */}
        <div className="flex flex-wrap gap-2 mt-4">
          {resourceTypes.map(type => (
            <button
              key={type.id}
              onClick={() => setResourceType(type.id)}
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                resourceType === type.id 
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-200' 
                  : 'bg-gray-50 text-gray-700 hover:bg-gray-100 border border-gray-200'
              }`}
            >
              <span className={`w-4 h-4 ${
                resourceType === type.id ? 'text-white' : `text-${type.color}-500`
              }`}>
                {type.icon}
              </span>
              {type.name}
            </button>
          ))}
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-4 border border-blue-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-blue-600 font-medium">Total Resources</p>
              <p className="text-2xl font-bold text-gray-900">{posts.length}</p>
            </div>
            <div className="bg-blue-600 p-3 rounded-lg">
              <Book className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>
        
        <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-4 border border-purple-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-purple-600 font-medium">Educational</p>
              <p className="text-2xl font-bold text-gray-900">
                {posts.filter(p => p.tags?.includes('educational')).length}
              </p>
            </div>
            <div className="bg-purple-600 p-3 rounded-lg">
              <GraduationCap className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-4 border border-green-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-green-600 font-medium">Skill Resources</p>
              <p className="text-2xl font-bold text-gray-900">
                {posts.filter(p => p.tags?.includes('skill')).length}
              </p>
            </div>
            <div className="bg-green-600 p-3 rounded-lg">
              <Laptop className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-xl p-4 border border-red-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-red-600 font-medium">PDF Downloads</p>
              <p className="text-2xl font-bold text-gray-900">
                {posts.filter(p => p.tags?.includes('pdf')).length}
              </p>
            </div>
            <div className="bg-red-600 p-3 rounded-lg">
              <FileText className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>
      </div>

      {/* Resources Grid */}
      {filteredPosts.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
          <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Book className="w-10 h-10 text-gray-400" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No resources found</h3>
          <p className="text-gray-500 mb-6">No resources match your current filters. Try adjusting your search.</p>
          <button 
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition shadow-lg shadow-blue-200"
            onClick={() => {
              setSearchTerm('');
              setResourceType('all');
            }}
          >
            Clear All Filters
          </button>
        </div>
      ) : (
        <>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPosts.map(post => (
              <article key={post._id} className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1 group">
                {/* Resource Type Header */}
                <div className={`px-4 py-2 bg-gradient-to-r from-${getTypeColor(post.tags?.[0])}-50 to-transparent border-b border-gray-100 flex items-center justify-between`}>
                  <div className="flex items-center gap-2">
                    <span className="text-lg">{getResourceIcon(post)}</span>
                    <span className="text-xs font-medium text-gray-600 uppercase tracking-wider">
                      {post.tags?.find(t => ['pdf', 'video', 'guide', 'tutorial'].includes(t)) || 'Resource'}
                    </span>
                  </div>
                  <span className="text-xs text-gray-400 flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {new Date(post.createdAt).toLocaleDateString()}
                  </span>
                </div>

                <div className="p-5">
                  {/* Title */}
                  <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2 group-hover:text-blue-600 transition">
                    {post.title}
                  </h3>
                  
                  {/* Description */}
                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                    {post.summary || post.content?.substring(0, 120)}...
                  </p>
                  
                  {/* Tags */}
                  {post.tags && post.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-4">
                      {post.tags.slice(0, 3).map(tag => (
                        <span 
                          key={tag} 
                          className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-md hover:bg-gray-200 transition cursor-default"
                        >
                          #{tag}
                        </span>
                      ))}
                      {post.tags.length > 3 && (
                        <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-md">
                          +{post.tags.length - 3}
                        </span>
                      )}
                    </div>
                  )}
                  
                  {/* Actions */}
                  <div className="flex items-center gap-2">
                    {post.link ? (
                      <a 
                        href={post.link} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition shadow-md shadow-blue-200"
                      >
                        <LinkIcon className="w-4 h-4" />
                        Access Resource
                      </a>
                    ) : (
                      <Link 
                        to={`/resources/${post._id}`} 
                        className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2 bg-gray-900 text-white text-sm font-medium rounded-lg hover:bg-gray-800 transition"
                      >
                        <BookOpen className="w-4 h-4" />
                        View Details
                      </Link>
                    )}
                    
                    {post.image?.includes('.pdf') && (
                      <a 
                        href={`http://localhost:5000${post.image}`}
                        download
                        className="inline-flex items-center gap-2 px-4 py-2 bg-red-50 text-red-600 text-sm font-medium rounded-lg hover:bg-red-100 transition border border-red-200"
                      >
                        <Download className="w-4 h-4" />
                        PDF
                      </a>
                    )}
                  </div>
                </div>

                {/* Footer Stats */}
                <div className="px-5 py-3 bg-gray-50 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500">
                  <div className="flex items-center gap-3">
                    <span className="flex items-center gap-1">
                      <Eye className="w-3 h-3" />
                      {post.views || 0} views
                    </span>
                    {post.downloads && (
                      <span className="flex items-center gap-1">
                        <Download className="w-3 h-3" />
                        {post.downloads} downloads
                      </span>
                    )}
                  </div>
                  {post.difficulty && (
                    <span className="px-2 py-1 bg-blue-100 text-blue-600 rounded-full text-xs font-medium">
                      {post.difficulty}
                    </span>
                  )}
                </div>
              </article>
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="mt-10 flex items-center justify-center gap-2">
              <button
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
                className={`p-2 rounded-lg border ${
                  page === 1 
                    ? 'border-gray-200 text-gray-300 cursor-not-allowed' 
                    : 'border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400'
                } transition`}
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              
              <div className="flex items-center gap-1">
                {[...Array(totalPages)].map((_, i) => {
                  const pageNum = i + 1;
                  const isActive = page === pageNum;
                  
                  // Show first page, last page, and pages around current
                  if (
                    pageNum === 1 ||
                    pageNum === totalPages ||
                    (pageNum >= page - 1 && pageNum <= page + 1)
                  ) {
                    return (
                      <button
                        key={pageNum}
                        onClick={() => setPage(pageNum)}
                        className={`w-10 h-10 rounded-lg font-medium transition ${
                          isActive
                            ? 'bg-blue-600 text-white shadow-md shadow-blue-200'
                            : 'text-gray-700 hover:bg-gray-100 border border-gray-200'
                        }`}
                      >
                        {pageNum}
                      </button>
                    );
                  } else if (
                    pageNum === page - 2 ||
                    pageNum === page + 2
                  ) {
                    return <span key={pageNum} className="text-gray-400">...</span>;
                  }
                  return null;
                })}
              </div>

              <button
                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className={`p-2 rounded-lg border ${
                  page === totalPages 
                    ? 'border-gray-200 text-gray-300 cursor-not-allowed' 
                    : 'border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400'
                } transition`}
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          )}

          {/* Results Info */}
          <div className="mt-4 text-center text-sm text-gray-500">
            Showing {filteredPosts.length} of {posts.length} resources
          </div>
        </>
      )}
    </div>
  );
}

export default Resources;