import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Linkedin, 
  Twitter,
  Award,
  Calendar,
  Users
} from 'lucide-react';

function Executives() {
  const [executives, setExecutives] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all');

  useEffect(() => {
    fetchExecutives();
  }, []);

  const fetchExecutives = async () => {
    setLoading(true);
    try {
      const res = await axios.get('/api/executives');
      setExecutives(res.data.executives);
    } catch (error) {
      console.error('Error fetching executives:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white flex items-center justify-center">
        <div className="text-center">
          <div className="relative">
            <div className="w-20 h-20 border-4 border-gray-200 border-t-blue-600 rounded-full animate-spin mx-auto"></div>
            <Users className="w-8 h-8 text-blue-600 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 animate-pulse" />
          </div>
          <p className="mt-4 text-gray-600 font-medium">Loading leadership team...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-16 px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="text-center max-w-4xl mx-auto mb-16">
        <div className="inline-flex items-center gap-2 bg-blue-50 text-blue-600 px-4 py-2 rounded-full text-sm font-medium mb-6">
          <Users className="w-4 h-4" />
          <span>Executive Committee {new Date().getFullYear()}</span>
        </div>
        
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
          Our{' '}
          <span className="relative">
            <span className="relative z-10 text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
              Leadership
            </span>
            <svg 
              className="absolute -bottom-2 left-0 w-full h-3 text-blue-200 -z-10" 
              viewBox="0 0 100 12" 
              preserveAspectRatio="none"
            >
              <path 
                d="M0,0 Q25,8 50,8 T100,0" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="4"
                strokeLinecap="round"
              />
            </svg>
          </span>
        </h1>
        
        <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
          Meet the dedicated executives steering the Umuahia South Youth Platform toward 
          innovation, empowerment, and community development.
        </p>

        {/* Stats Bar */}
        <div className="flex flex-wrap justify-center gap-8 mt-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
              <Award className="w-5 h-5 text-blue-600" />
            </div>
            <div className="text-left">
              <div className="text-2xl font-bold text-gray-900">{executives.length}</div>
              <div className="text-sm text-gray-500">Executive Members</div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
              <Calendar className="w-5 h-5 text-purple-600" />
            </div>
            <div className="text-left">
              <div className="text-2xl font-bold text-gray-900">2024-2025</div>
              <div className="text-sm text-gray-500">Tenure</div>
            </div>
          </div>
        </div>
      </div>

      {executives.length === 0 ? (
        <div className="text-center py-20 max-w-md mx-auto">
          <div className="bg-gray-50 rounded-2xl p-12">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <User className="w-12 h-12 text-gray-400" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-3">No executives added yet</h3>
            <p className="text-gray-500 mb-6">
              Our leadership team is being assembled. Check back soon for updates.
            </p>
            <div className="flex justify-center gap-2">
              <div className="w-2 h-2 bg-gray-300 rounded-full animate-pulse"></div>
              <div className="w-2 h-2 bg-gray-300 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
              <div className="w-2 h-2 bg-gray-300 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
            </div>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {executives.map((exec, index) => (
            <div
              key={exec._id}
              className="group relative bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden animate-fade-in-up"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              {/* Image Container */}
              <div className="relative h-80 overflow-hidden">
                <img
                  src={`https://umuahia-blog-3.onrender.com/${exec.image}`}
                  alt={exec.name}
                  className="w-full h-full object-cover object-top group-hover:scale-110 transition-transform duration-500"
                />
                
                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-60 group-hover:opacity-70 transition-opacity"></div>
                
                {/* Name and Title Overlay */}
                <div className="absolute bottom-0 left-0 right-0 p-6 text-white transform translate-y-2 group-hover:translate-y-0 transition-transform">
                  <h3 className="text-2xl font-bold mb-1">{exec.name}</h3>
                  <div className="flex items-center gap-2">
                    <Award className="w-4 h-4 text-yellow-400" />
                    <p className="text-sm font-medium text-gray-200">{exec.title}</p>
                  </div>
                </div>

                {/* Social Links Overlay - Appears on Hover */}
                <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-4 group-hover:translate-x-0">
                  <button className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-blue-600 hover:scale-110 transition-all">
                    <Mail className="w-4 h-4" />
                  </button>
                  <button className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-green-600 hover:scale-110 transition-all">
                    <Phone className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Content */}
              <div className="p-6">
                {exec.description && (
                  <p className="text-gray-600 text-sm leading-relaxed mb-4">
                    {exec.description}
                  </p>
                )}

                {/* Contact Icons - Bottom Row */}
                <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                  <div className="flex gap-2">
                    <button className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center text-gray-600 hover:bg-blue-100 hover:text-blue-600 transition-colors">
                      <Mail className="w-4 h-4" />
                    </button>
                    <button className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center text-gray-600 hover:bg-green-100 hover:text-green-600 transition-colors">
                      <Phone className="w-4 h-4" />
                    </button>
                  </div>
                  
                  {/* Role Badge */}
                  <span className="px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-xs font-medium">
                    Executive
                  </span>
                </div>
              </div>

              {/* Decorative Elements */}
              <div className="absolute top-0 left-0 w-20 h-20 bg-gradient-to-br from-blue-500/10 to-transparent rounded-br-3xl"></div>
            </div>
          ))}
        </div>
      )}

      {/* CSS for animations */}
      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-fade-in-up {
          animation: fadeInUp 0.6s ease-out forwards;
          opacity: 0;
        }
      `}</style>
    </div>
  );
}

export default Executives;