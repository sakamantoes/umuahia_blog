import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Building2, Calendar, Eye, Music, Film, Drama, ChevronLeft, ChevronRight, Clock, User, Tag, DramaIcon } from 'lucide-react';
import Loader from '../components/Loader';

function Culture() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedSubCategory, setSelectedSubCategory] = useState('all');

  const subCategories = [
    { id: 'all', name: 'All Culture', icon: Building2, color: 'from-gray-600 to-gray-700' },
    { id: 'music', name: 'Music', icon: Music, color: 'from-purple-500 to-purple-600' },
    { id: 'movies', name: 'Movies & Film', icon: Film, color: 'from-blue-500 to-blue-600' },
    { id: 'theatre', name: 'Theatre & Arts', icon: Drama, color: 'from-amber-500 to-amber-600' },
    { id: 'traditions', name: 'Traditions', icon: Building2, color: 'from-emerald-500 to-emerald-600' }
  ];

  useEffect(() => {
    fetchPosts();
  }, [page, selectedSubCategory]);

  const fetchPosts = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`/api/posts/category/Culture?page=${page}&limit=9`);
      let filteredPosts = res.data.posts;
      
      if (selectedSubCategory !== 'all') {
        filteredPosts = filteredPosts.filter(post => 
          post.tags?.some(tag => tag.toLowerCase().includes(selectedSubCategory.toLowerCase()))
        );
      }
      
      setPosts(filteredPosts);
      setTotalPages(res.data.totalPages);
    } catch (error) {
      console.error('Error fetching culture posts:', error);
    } finally {
      setLoading(false);
    }
  };

  const getCultureIcon = (tags) => {
    if (!tags) return <Building2 className="w-5 h-5" />;
    
    if (tags.some(tag => tag.toLowerCase().includes('music'))) 
      return <Music className="w-5 h-5 text-purple-500" />;
    if (tags.some(tag => tag.toLowerCase().includes('movie') || tag.toLowerCase().includes('film'))) 
      return <Film className="w-5 h-5 text-blue-500" />;
    if (tags.some(tag => tag.toLowerCase().includes('theatre') || tag.toLowerCase().includes('theater'))) 
      return <Drama className="w-5 h-5 text-amber-500" />;
    
    return <Building2 className="w-5 h-5 text-emerald-500" />;
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 12
      }
    }
  };

   if (loading) {
      return (
        <div className="min-h-[60vh] flex flex-col items-center justify-center">
          <div className="relative">
            <div className="w-16 h-16 border-4 border-gray-200 border-t-blue-600 rounded-full animate-spin"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <DramaIcon className="w-6 h-6 text-blue-600 animate-pulse" />
            </div>
          </div>
          <p className="mt-4 text-gray-600 font-medium">Loading Culture posts...</p>
        </div>
      );
    }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen bg-gradient-to-br from-amber-50 via-white to-orange-50 py-12"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6 }}
          className="relative mb-12"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-amber-200 to-orange-200 rounded-3xl blur-3xl opacity-30"></div>
          <div className="relative bg-white/80 backdrop-blur-xl rounded-3xl p-8 shadow-xl border border-white/20">
            <div className="flex items-center gap-6">
              <motion.div
                whileHover={{ rotate: 360 }}
                transition={{ duration: 0.6 }}
                className="bg-gradient-to-br from-amber-500 to-orange-500 p-5 rounded-2xl shadow-lg"
              >
                <Building2 className="w-10 h-10 text-white" />
              </motion.div>
              <div>
                <motion.h2 
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.2 }}
                  className="text-4xl font-bold bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent"
                >
                  Nigerian Culture & Arts
                </motion.h2>
                <motion.p 
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.3 }}
                  className="text-lg text-gray-600 mt-2"
                >
                  Celebrating our rich cultural heritage through stories, music, and traditions
                </motion.p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Sub-categories */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-12"
        >
          {subCategories.map((cat) => {
            const Icon = cat.icon;
            const isSelected = selectedSubCategory === cat.id;
            
            return (
              <motion.button
                key={cat.id}
                variants={itemVariants}
                whileHover={{ y: -4, scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setSelectedSubCategory(cat.id)}
                className={`relative group overflow-hidden rounded-2xl p-6 transition-all duration-300 ${
                  isSelected 
                    ? 'bg-gradient-to-br ' + cat.color + ' text-white shadow-xl' 
                    : 'bg-white hover:bg-gradient-to-br hover:' + cat.color + ' hover:text-white shadow-md hover:shadow-xl'
                }`}
              >
                <div className="absolute inset-0 bg-white/10 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
                <div className="relative z-10 flex flex-col items-center gap-3">
                  <Icon className={`w-8 h-8 ${isSelected ? 'text-white' : 'text-gray-600 group-hover:text-white'}`} />
                  <span className="text-sm font-semibold text-center">{cat.name}</span>
                </div>
              </motion.button>
            );
          })}
        </motion.div>

        {/* Featured Culture Story */}
        <AnimatePresence>
          {posts.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="mb-16"
            >
              <div className="relative group">
                <div className="absolute -inset-1 bg-gradient-to-r from-amber-400 to-orange-400 rounded-3xl blur opacity-25 group-hover:opacity-40 transition duration-1000"></div>
                <div className="relative bg-white rounded-2xl overflow-hidden shadow-2xl">
                  <div className="grid md:grid-cols-2 gap-0">
                    <div className="relative h-64 md:h-auto overflow-hidden">
                      <motion.img 
                        whileHover={{ scale: 1.05 }}
                        transition={{ duration: 0.6 }}
                        src={`https://umuahia-blog-3.onrender.com/${posts[0].image}`}
                        className="w-full h-full bg-red-600 object-cover"
                        alt={posts[0]?.title}
                      />
                      <div className="absolute top-4 left-4">
                        <motion.span 
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ delay: 0.5, type: "spring" }}
                          className="px-4 py-2 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-full text-sm font-semibold shadow-lg"
                        >
                          Featured Story
                        </motion.span>
                      </div>
                    </div>
                    <div className="p-8 md:p-12 flex flex-col justify-center">
                      <motion.h3 
                        initial={{ x: 20, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ delay: 0.3 }}
                        className="text-3xl font-bold text-gray-900 mb-4"
                      >
                        {posts[0]?.title}
                      </motion.h3>
                      <motion.p 
                        initial={{ x: 20, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ delay: 0.4 }}
                        className="text-gray-600 mb-6 leading-relaxed"
                      >
                        {posts[0]?.content.substring(0, 200)}...
                      </motion.p>
                      <motion.div 
                        initial={{ x: 20, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ delay: 0.5 }}
                        className="flex items-center gap-4"
                      >
                        <motion.div 
                          whileHover={{ scale: 1.1 }}
                          className="relative"
                        >
                          <img 
                            src={`https://ui-avatars.com/api/?name=${posts[0]?.author?.fullName || 'Admin'}&background=amber&color=fff&bold=true`}
                            className="w-12 h-12 rounded-full ring-4 ring-amber-100"
                            alt="Author"
                          />
                        </motion.div>
                        <div>
                          <p className="font-semibold text-gray-900">{posts[0]?.author?.fullName || 'Admin'}</p>
                          <div className="flex items-center gap-3 text-sm text-gray-500">
                            <span className="flex items-center gap-1">
                              <Calendar className="w-4 h-4" />
                              {new Date(posts[0]?.createdAt).toLocaleDateString()}
                            </span>
                            <span className="flex items-center gap-1">
                              <Clock className="w-4 h-4" />
                              5 min read
                            </span>
                          </div>
                        </div>
                      </motion.div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Culture Grid */}
        {posts.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-20"
          >
            <motion.div
              animate={{
                y: [0, -10, 0],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
              }}
            >
              <Building2 className="w-20 h-20 text-gray-300 mx-auto mb-4" />
            </motion.div>
            <p className="text-xl text-gray-500">No culture posts available at the moment.</p>
            <p className="text-gray-400 mt-2">Check back soon for new stories!</p>
          </motion.div>
        ) : (
          <>
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            >
              {posts.map((post, index) => (
                <motion.div
                  key={post._id}
                  variants={itemVariants}
                  whileHover={{ y: -8 }}
                  className="group"
                >
                  <div className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 h-full flex flex-col">
                    <div className="relative overflow-hidden">
                      {post.image ? (
                        <motion.img 
                          whileHover={{ scale: 1.1 }}
                          transition={{ duration: 0.6 }}
                          src={`https://umuahia-blog-3.onrender.com/${post.image}`}
                          className="w-full h-56 object-cover"
                          alt={post.title}
                        />
                      ) : (
                        <div className="w-full h-56 bg-gradient-to-br from-amber-100 to-orange-100 flex items-center justify-center">
                          <motion.div
                            animate={{
                              rotate: [0, 10, -10, 0],
                            }}
                            transition={{
                              duration: 4,
                              repeat: Infinity,
                            }}
                          >
                            {getCultureIcon(post.tags)}
                          </motion.div>
                        </div>
                      )}
                      <div className="absolute top-4 right-4">
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ delay: index * 0.1 }}
                          className="px-3 py-1 bg-white/90 backdrop-blur-sm rounded-full text-xs font-semibold text-gray-700 shadow-lg"
                        >
                          Culture
                        </motion.div>
                      </div>
                    </div>
                    
                    <div className="p-6 flex-1 flex flex-col">
                      <div className="flex items-center gap-2 mb-3">
                        <span className="text-sm text-gray-500 flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          {new Date(post.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      
                      <h5 className="text-xl font-bold text-gray-900 mb-2 line-clamp-2">
                        {post.title}
                      </h5>
                      
                      <p className="text-gray-600 mb-4 line-clamp-3">
                        {post.summary || post.content.substring(0, 150)}...
                      </p>
                      
                      {/* Tags */}
                      {post.tags && post.tags.length > 0 && (
                        <div className="flex flex-wrap gap-2 mb-4">
                          {post.tags.slice(0, 3).map(tag => (
                            <span 
                              key={tag} 
                              className="px-2 py-1 bg-amber-50 text-amber-700 rounded-lg text-xs font-medium"
                            >
                              #{tag}
                            </span>
                          ))}
                        </div>
                      )}
                      
                      <div className="flex items-center justify-between mt-auto pt-4 border-t border-gray-100">
                        <motion.div
                          whileHover={{ x: 5 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          <Link 
                            to={`/culture/${post._id}`} 
                            className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-xl hover:shadow-lg transition-all duration-300 text-sm font-semibold"
                          >
                            Read Story
                            <ChevronRight className="w-4 h-4" />
                          </Link>
                        </motion.div>
                        
                        <div className="flex items-center gap-1 text-sm text-gray-500">
                          <Eye className="w-4 h-4" />
                          <span>{post.views || 0}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>

            {/* Pagination */}
            {totalPages > 1 && (
              <motion.nav 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="mt-12"
              >
                <div className="flex justify-center items-center gap-2">
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className={`p-3 rounded-xl ${
                      page === 1 
                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                        : 'bg-white text-amber-600 hover:bg-amber-50 shadow-md'
                    }`}
                    onClick={() => setPage(p => p - 1)}
                    disabled={page === 1}
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </motion.button>
                  
                  <div className="flex gap-2">
                    {[...Array(totalPages)].map((_, i) => (
                      <motion.button
                        key={i + 1}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => setPage(i + 1)}
                        className={`w-10 h-10 rounded-xl font-semibold transition-all duration-300 ${
                          page === i + 1
                            ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-lg'
                            : 'bg-white text-gray-600 hover:bg-amber-50 shadow-md'
                        }`}
                      >
                        {i + 1}
                      </motion.button>
                    ))}
                  </div>
                  
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className={`p-3 rounded-xl ${
                      page === totalPages 
                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                        : 'bg-white text-amber-600 hover:bg-amber-50 shadow-md'
                    }`}
                    onClick={() => setPage(p => p + 1)}
                    disabled={page === totalPages}
                  >
                    <ChevronRight className="w-5 h-5" />
                  </motion.button>
                </div>
              </motion.nav>
            )}
          </>
        )}
      </div>
    </motion.div>
  );
}

export default Culture;