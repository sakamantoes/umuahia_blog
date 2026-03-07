import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { Lock, Users, Shield, Eye, EyeOff } from 'lucide-react';

function AdminLogin() {
  const [credentials, setCredentials] = useState({
    username: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setCredentials({
      ...credentials,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await axios.post('/api/admin/login', credentials);
      localStorage.setItem('adminToken', res.data.token);
      localStorage.setItem('adminUser', JSON.stringify(res.data.admin));
      toast.success('Login successful! Welcome back.');
      navigate('/admin/dashboard');
    } catch (error) {
      toast.error(error.response?.data?.msg || 'Invalid credentials');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 flex items-center justify-center p-4">
      {/* Decorative Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-green-100 rounded-full blur-3xl opacity-50"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-orange-300 rounded-full blur-3xl opacity-50"></div>
      </div>

      <div className="w-full max-w-md relative">
        {/* Logo/Brand Area */}
        <div className="text-center mb-8">
          <div className="inline-flex p-4 bg-gradient-to-br from-green-600 to-green-700 rounded-2xl shadow-xl mb-4">
            <Shield className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900">Admin Portal</h1>
          <p className="text-gray-500 mt-2">Umuahia South Youth Platform</p>
        </div>

        <div className="col-md-5 w-full">
          <div className="card shadow-xl border-0 bg-white/80 backdrop-blur-sm rounded-2xl overflow-hidden">
            {/* Card Header Decoration */}
            <div className="h-2 bg-gradient-to-r from-green-600 via-orange-300 to-green-600"></div>
            
            <div className="card-body p-8">
              <div className="text-center mb-6">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-green-50 rounded-full mb-4">
                  <Users className="w-8 h-8 text-green-600" />
                </div>
                <h2 className="fw-bold text-2xl text-gray-800">Welcome Back</h2>
                <p className="text-gray-500 text-sm mt-1">Please enter your credentials to continue</p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="mb-4">
                  <label className="form-label fw-semibold text-sm text-gray-700 mb-2 block">
                    <Users className="me-2 inline w-4 h-4 text-green-500" />
                    Username
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      className="form-control form-control-lg w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 bg-white/50 backdrop-blur-sm"
                      name="username"
                      value={credentials.username}
                      onChange={handleChange}
                      placeholder="Enter your username"
                      required
                      autoFocus
                    />
                  </div>
                </div>

                <div className="mb-4">
                  <label className="form-label fw-semibold text-sm text-gray-700 mb-2 block">
                    <Lock className="me-2 inline w-4 h-4 text-green-500" />
                    Password
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      className="form-control form-control-lg w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 bg-white/50 backdrop-blur-sm pr-12"
                      name="password"
                      value={credentials.password}
                      onChange={handleChange}
                      placeholder="Enter your password"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>

                <button 
                  type="submit" 
                  className="btn btn-primary btn-lg w-full bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-semibold py-3 px-4 rounded-xl transition-all duration-200 transform hover:scale-[1.02] shadow-lg hover:shadow-xl disabled:opacity-70 disabled:cursor-not-allowed"
                  disabled={loading}
                >
                  {loading ? (
                    <div className="flex items-center justify-center gap-2">
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Logging in...</span>
                    </div>
                  ) : (
                    'Login to Dashboard'
                  )}
                </button>
              </form>

              <div className="text-center mt-6">
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-200"></div>
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-3 bg-white/80 text-gray-500">Demo Credentials</span>
                  </div>
                </div>
                {/* <small className="text-muted block mt-4 text-sm bg-green-50 p-3 rounded-lg border border-green-100">
                  <span className="font-medium text-green-700">Username:</span> admin<br />
                  <span className="font-medium text-green-700">Password:</span> admin123
                </small> */}
              </div>

              <div className="text-center mt-4">
                <p className="text-xs text-gray-400">
                  Secure access for authorized personnel only
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminLogin;