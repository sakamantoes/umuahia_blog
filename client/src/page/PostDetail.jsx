import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import { 
  Calendar,
  Eye,
  Heart,
  Share2,
  Facebook,
  Twitter,
  MessageSquare ,
  Link2,
  ArrowLeft,
  User,
  Tag,
  Bookmark,
  ThumbsUp,
  MessageCircle,
  Clock,
  ChevronRight,
  BookmarkPlus,
  HeartIcon
} from 'lucide-react';

function PostDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [relatedPosts, setRelatedPosts] = useState([]);
  const [liked, setLiked] = useState(false);
  const [bookmarked, setBookmarked] = useState(false);
  const [showShareOptions, setShowShareOptions] = useState(false);

  useEffect(() => {
    fetchPost();
    window.scrollTo(0, 0);
  }, [id]);

  const fetchPost = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`/api/posts/${id}`);
      setPost(res.data.post);
      
      const relatedRes = await axios.get(`/api/posts/category/${res.data.post.category}?limit=4`);
      const filtered = relatedRes.data.posts.filter(p => p._id !== id);
      setRelatedPosts(filtered.slice(0, 3));
      
      await axios.post(`/api/posts/${id}/view`);
    } catch (error) {
      console.error('Error fetching post:', error);
      toast.error('Post not found');
      navigate('/');
    } finally {
      setLoading(false);
    }
  };

  const handleLike = () => {
    setLiked(!liked);
    toast.success(liked ? 'Removed like' : 'Liked this post!');
  };

  const handleBookmark = () => {
    setBookmarked(!bookmarked);
    toast.success(bookmarked ? 'Removed from bookmarks' : 'Saved to bookmarks');
  };

  const handleShare = (platform) => {
    const url = window.location.href;
    const title = post.title;
    let shareUrl = '';

    switch(platform) {
      case 'facebook':
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
        break;
      case 'twitter':
        shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`;
        break;
      case 'MessageSquare ':
        shareUrl = `https://wa.me/?text=${encodeURIComponent(title + ' ' + url)}`;
        break;
      case 'copy':
        navigator.clipboard.writeText(url);
        toast.success('Link copied to clipboard!');
        return;
      default:
        return;
    }

    window.open(shareUrl, '_blank', 'width=600,height=400');
  };

  const getCategoryColor = (category) => {
    const colors = {
      'News & Updates': 'primary',
      'Opportunities': 'success',
      'Lifestyle': 'danger',
      'Culture': 'warning',
      'Stories': 'success',
      'Resources': 'secondary'
    };
    return colors[category] || 'primary';
  };

  const getCategoryIcon = (category) => {
    const icons = {
      'News & Updates': '📰',
      'Opportunities': '💼',
      'Lifestyle': '❤️',
      'Culture': '🏛️',
      'Stories': '📖',
      'Resources': '📚'
    };
    return icons[category] || '📄';
  };

  const formatDate = (dateString) => {
    const options = { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="relative">
            <div className="w-16 h-16 border-4 border-green-200 border-t-green-600 rounded-full animate-spin"></div>
          </div>
          <p className="mt-4 text-gray-600 font-medium">Loading post...</p>
        </div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-4">
          <div className="text-6xl mb-4">📄</div>
          <h3 className="text-2xl font-bold text-gray-900 mb-2">Post not found</h3>
          <p className="text-gray-600 mb-6">The post you're looking for doesn't exist or has been removed.</p>
          <Link 
            to="/" 
            className="inline-flex items-center px-6 py-3 bg-green-600 text-white font-medium rounded-xl hover:bg-green-700 transition-colors"
          >
            <ArrowLeft className="mr-2" size={14} />
            Back to Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Button */}
        <button 
          onClick={() => navigate(-1)} 
          className="group inline-flex items-center text-gray-600 hover:text-green-600 font-medium mb-6 transition-colors"
        >
          <ArrowLeft className="mr-2 group-hover:-translate-x-1 transition-transform" size={14} />
          Back
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-8">
            <article className="bg-white rounded-2xl shadow-sm overflow-hidden">
              {/* Header Image */}
              {post.image && (
                <div className="relative h-[400px] md:h-[500px]">
                  <img 
                    src={`https://umuahia-blog-3.onrender.com${post.image}`}
                    className="w-full h-full object-cover"
                    alt={post.title}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent"></div>
                  <div className="absolute top-6 left-6">
                    <span className={`inline-flex items-center px-4 py-2 bg-${getCategoryColor(post.category)}-600 text-white text-sm font-medium rounded-full shadow-lg`}>
                      <span className="mr-2">{getCategoryIcon(post.category)}</span>
                      {post.category}
                    </span>
                  </div>
                </div>
              )}

              <div className="p-6 md:p-8">
                {/* Title */}
                <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6 leading-tight">
                  {post.title}
                </h1>

                {/* Meta Info */}
                <div className="flex flex-wrap items-center gap-4 text-gray-600 mb-6 pb-6 border-b border-gray-100">
                  <div className="flex items-center">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center text-white text-sm font-semibold mr-2">
                      {post.author?.fullName?.charAt(0) || 'A'}
                    </div>
                    <span className="text-sm font-medium">{post.author?.fullName || 'Admin'}</span>
                  </div>
                  <div className="flex items-center text-sm">
                    <Calendar className="mr-2 text-gray-400" size={14} />
                    {formatDate(post.createdAt)}
                  </div>
                  <div className="flex items-center text-sm">
                    <Eye className="mr-2 text-gray-400" size={14} />
                    {post.views || 0} views
                  </div>
                </div>

                {/* Tags */}
                {post.tags && post.tags.length > 0 && (
                  <div className="flex flex-wrap items-center gap-2 mb-6">
                    <Tag className="text-gray-400" size={14} />
                    {post.tags.map(tag => (
                      <Link 
                        key={tag} 
                        to={`/${post.category.toLowerCase().replace(/ & /g, '-')}?tag=${tag}`}
                        className="px-3 py-1 bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm rounded-full transition-colors"
                      >
                        #{tag}
                      </Link>
                    ))}
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex flex-wrap items-center gap-3 mb-8">
                  <button 
                    className={`inline-flex items-center px-4 py-2 rounded-xl font-medium transition-all ${
                      liked 
                        ? 'bg-red-50 text-red-600 border-2 border-red-200' 
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200 border-2 border-transparent'
                    }`}
                    onClick={handleLike}
                  >
                    {liked ? <Heart className="mr-2 fill-current" /> : <HeartIcon className="mr-2" />}
                    {liked ? 'Liked' : 'Like'}
                  </button>
                  
                  <button 
                    className={`inline-flex items-center px-4 py-2 rounded-xl font-medium transition-all ${
                      bookmarked 
                        ? 'bg-yellow-50 text-yellow-700 border-2 border-yellow-200' 
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200 border-2 border-transparent'
                    }`}
                    onClick={handleBookmark}
                  >
                    {bookmarked ? <Bookmark className="mr-2 fill-current" /> : <BookmarkPlus className="mr-2" />}
                    {bookmarked ? 'Saved' : 'Save'}
                  </button>
                  
                  <div className="relative">
                    <button 
                      className="inline-flex items-center px-4 py-2 bg-gray-100 text-gray-700 rounded-xl font-medium hover:bg-gray-200 transition-all border-2 border-transparent"
                      onClick={() => setShowShareOptions(!showShareOptions)}
                    >
                      <Share2 className="mr-2" />
                      Share
                    </button>
                    
                    {showShareOptions && (
                      <div className="absolute top-full left-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-100 py-2 z-10">
                        <button 
                          className="w-full px-4 py-2 text-left hover:bg-gray-50 flex items-center text-gray-700 transition-colors"
                          onClick={() => handleShare('facebook')}
                        >
                          <Facebook className="text-blue-600 mr-3" size={16} />
                          Facebook
                        </button>
                        <button 
                          className="w-full px-4 py-2 text-left hover:bg-gray-50 flex items-center text-gray-700 transition-colors"
                          onClick={() => handleShare('twitter')}
                        >
                          <Twitter className="text-sky-500 mr-3" size={16} />
                          Twitter
                        </button>
                        <button 
                          className="w-full px-4 py-2 text-left hover:bg-gray-50 flex items-center text-gray-700 transition-colors"
                          onClick={() => handleShare('MessageSquare ')}
                        >
                          <MessageSquare  className="text-green-600 mr-3" size={16} />
                          MessageSquare 
                        </button>
                        <div className="border-t border-gray-100 my-2"></div>
                        <button 
                          className="w-full px-4 py-2 text-left hover:bg-gray-50 flex items-center text-gray-700 transition-colors"
                          onClick={() => handleShare('copy')}
                        >
                          <Link2 className="text-gray-500 mr-3" size={16} />
                          Copy Link
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                {/* Summary */}
                {post.summary && (
                  <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-6 mb-8 border border-green-100">
                    <p className="text-gray-700 italic leading-relaxed">{post.summary}</p>
                  </div>
                )}

                {/* Main Content */}
                <div className="prose prose-lg max-w-none">
                  {post.content.split('\n').map((paragraph, index) => (
                    <p key={index} className="text-gray-700 leading-relaxed mb-6">
                      {paragraph}
                    </p>
                  ))}
                </div>

                {/* Resource Specific Content */}
                {post.category === 'Resources' && post.link && (
                  <div className="mt-8 p-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-100">
                    <h5 className="text-lg font-semibold text-gray-900 mb-3">Resource Link:</h5>
                    <a 
                      href={post.link} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-medium rounded-xl hover:bg-blue-700 transition-colors"
                    >
                      Access Resource
                      <ChevronRight className="ml-2" size={14} />
                    </a>
                  </div>
                )}

                {/* Opportunity Specific Content */}
                {post.category === 'Opportunities' && (
                  <div className="mt-8 p-6 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border border-green-100">
                    <h5 className="text-lg font-semibold text-green-800 mb-3">Application Details</h5>
                    <p className="text-gray-700 mb-4">To apply for this opportunity, please contact the administrator or follow the instructions in the post above.</p>
                    <button className="inline-flex items-center px-6 py-3 bg-green-600 text-white font-medium rounded-xl hover:bg-green-700 transition-colors">
                      Apply Now
                      <ChevronRight className="ml-2" size={14} />
                    </button>
                  </div>
                )}
              </div>

              {/* Footer */}
              <div className="border-t border-gray-100 p-6 md:p-8 bg-gray-50/50">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <img 
                      src={`https://ui-avatars.com/api/?name=${post.author?.fullName || 'Admin'}&background=059669&color=fff&size=64`}
                      className="w-12 h-12 rounded-full mr-4 border-2 border-white shadow-sm"
                      alt="Author"
                    />
                    <div>
                      <h6 className="font-semibold text-gray-900">{post.author?.fullName || 'Admin'}</h6>
                      <p className="text-sm text-gray-500">Content Creator • Umuahia South Youth Platform</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="flex items-center text-gray-600">
                      <ThumbsUp className="mr-2 text-green-600" size={14} />
                      {post.likes || 0}
                    </span>
                    <span className="flex items-center text-gray-600">
                      <MessageCircle className="mr-2 text-blue-600" size={14} />
                      0
                    </span>
                  </div>
                </div>
              </div>
            </article>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-4 space-y-6">
            {/* Author Card */}
            <div className="bg-white rounded-2xl shadow-sm p-6">
              <div className="text-center">
                <img 
                  src={`https://ui-avatars.com/api/?name=${post.author?.fullName || 'Admin'}&background=059669&color=fff&size=128`}
                  className="w-24 h-24 rounded-full mx-auto mb-4 border-4 border-white shadow-lg"
                  alt="Author"
                />
                <h5 className="text-xl font-bold text-gray-900 mb-1">{post.author?.fullName || 'Admin'}</h5>
                <p className="text-green-600 font-medium text-sm mb-3">Content Creator</p>
                <p className="text-gray-600 text-sm leading-relaxed">
                  Sharing valuable information with the youth of Umuahia South.
                </p>
              </div>
            </div>

            {/* Related Posts */}
            {relatedPosts.length > 0 && (
              <div className="bg-white rounded-2xl shadow-sm p-6">
                <h5 className="text-lg font-bold text-gray-900 mb-4">Related Posts</h5>
                <div className="space-y-4">
                  {relatedPosts.map(related => (
                    <Link 
                      key={related._id} 
                      to={`/${related.category.toLowerCase().replace(/ & /g, '-')}/${related._id}`}
                      className="group block"
                    >
                      <div className="flex items-start space-x-3 p-3 rounded-xl hover:bg-gray-50 transition-colors">
                        {related.image ? (
                          <img 
                            src={`https://umuahia-blog-3.onrender.com${related.image}`}
                            alt={related.title}
                            className="w-16 h-16 rounded-lg object-cover flex-shrink-0"
                          />
                        ) : (
                          <div className="w-16 h-16 rounded-lg bg-gradient-to-br from-green-100 to-emerald-100 flex items-center justify-center text-2xl flex-shrink-0">
                            {getCategoryIcon(related.category)}
                          </div>
                        )}
                        <div className="flex-1 min-w-0">
                          <h6 className="text-sm font-semibold text-gray-900 group-hover:text-green-600 transition-colors line-clamp-2 mb-1">
                            {related.title}
                          </h6>
                          <div className="flex items-center text-xs text-gray-500">
                            <Clock className="mr-1" size={10} />
                            {new Date(related.createdAt).toLocaleDateString()}
                          </div>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* Quick Actions */}
            <div className="bg-white rounded-2xl shadow-sm p-6">
              <h5 className="text-lg font-bold text-gray-900 mb-4">Quick Actions</h5>
              <div className="space-y-3">
                <button 
                  className={`w-full inline-flex items-center justify-center px-4 py-3 rounded-xl font-medium transition-all ${
                    liked 
                      ? 'bg-red-50 text-red-600 border-2 border-red-200' 
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200 border-2 border-transparent'
                  }`}
                  onClick={handleLike}
                >
                  {liked ? <Heart className="mr-2 fill-current" /> : <HeartIcon className="mr-2" />}
                  {liked ? 'Unlike this post' : 'Like this post'}
                </button>
                
                <button 
                  className={`w-full inline-flex items-center justify-center px-4 py-3 rounded-xl font-medium transition-all ${
                    bookmarked 
                      ? 'bg-yellow-50 text-yellow-700 border-2 border-yellow-200' 
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200 border-2 border-transparent'
                  }`}
                  onClick={handleBookmark}
                >
                  {bookmarked ? <Bookmark className="mr-2 fill-current" /> : <BookmarkPlus className="mr-2" />}
                  {bookmarked ? 'Remove Bookmark' : 'Bookmark this post'}
                </button>
                
                <button 
                  className="w-full inline-flex items-center justify-center px-4 py-3 bg-green-600 text-white font-medium rounded-xl hover:bg-green-700 transition-all"
                  onClick={() => handleShare('MessageSquare ')}
                >
                  <MessageSquare  className="mr-2" />
                  Share on MessageSquare 
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PostDetail;