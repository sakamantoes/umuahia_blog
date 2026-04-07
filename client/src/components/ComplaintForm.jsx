import React, { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { MessageSquare, X, AlertCircle, Send, User, Mail, Phone, Tag } from "lucide-react";

function ComplaintForm() {
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    category: "General",
    message: "",
  });

const Api = 'http://localhost:5000/api/complaints'; // Update with your actual API URL

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await axios.post(`${Api}`, formData);

      toast.success("Complaint submitted successfully!");

      setFormData({
        name: "",
        email: "",
        phone: "",
        category: "General",
        message: "",
      });

      setShowForm(false);
    } catch (error) {
      toast.error(error.response?.data?.msg || "Error submitting complaint");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 pointer-events-none flex items-center justify-center z-50">
      {!showForm ? (
        <button
          onClick={() => setShowForm(true)}
          className="pointer-events-auto flex items-center gap-3 bg-gradient-to-r from-yellow-500 to-amber-500 hover:from-yellow-600 hover:to-amber-600 text-white font-medium px-8 py-4 rounded-full shadow-2xl hover:shadow-3xl transform hover:scale-110 transition-all duration-300 group animate-bounce-slow bottom-[5%] left-3 fixed"
        >
          <div className="relative">
            <MessageSquare size={24} className="group-hover:rotate-12 transition-transform" />
            <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-ping"></span>
            <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></span>
          </div>
          <span className="text-[12px] font-semibold">Contact Us</span>
          <div className="absolute inset-0 rounded-full bg-gradient-to-r from-yellow-500 to-amber-500 blur-xl opacity-50 group-hover:opacity-75 transition-opacity -z-10"></div>
        </button>
      ) : (
        <div className="pointer-events-auto w-[450px] bg-white rounded-2xl shadow-3xl border border-gray-100 overflow-hidden transform transition-all duration-500 scale-100 hover:shadow-4xl animate-slide-up relative flex flex-col min-h-[600px]">
          
          {/* Modern header with pattern */}
          <div className="bg-gradient-to-r from-yellow-500 to-amber-500 px-6 py-5 relative overflow-hidden flex-shrink-0">
            {/* Decorative pattern */}
            <div className="absolute inset-0 opacity-10">
              <div className="absolute -right-8 -top-8 w-24 h-24 bg-white rounded-full"></div>
              <div className="absolute -left-8 -bottom-8 w-32 h-32 bg-white rounded-full"></div>
              <svg className="absolute inset-0 w-full h-full" xmlns="http://www.w3.org/2000/svg">
                <defs>
                  <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
                    <path d="M 20 0 L 0 0 0 20" fill="none" stroke="white" strokeWidth="0.5" strokeOpacity="0.2"/>
                  </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#grid)" />
              </svg>
            </div>
            
            <div className="flex justify-between items-center relative">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-white/20 rounded-xl backdrop-blur-sm">
                  <MessageSquare size={22} className="text-white" />
                </div>
                <div>
                  <h2 className="font-bold text-xl text-white tracking-tight">
                    Contact Us
                  </h2>
                  <p className="text-xs text-white/80 mt-0.5">We value your feedback</p>
                </div>
              </div>

              <button
                onClick={() => setShowForm(false)}
                className="p-2 rounded-xl bg-white/20 hover:bg-white/30 text-white transition-all duration-200 hover:rotate-90 transform"
              >
                <X size={18} />
              </button>
            </div>
          </div>

          {/* Form with improved styling */}
          <form onSubmit={handleSubmit} className="p-6 bg-gray-50/50 flex-grow flex flex-col space-y-3">
            <div className="space-y-4 flex-grow">
              <div className="relative group">
                <User size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 group-focus-within:text-yellow-500 transition-colors" />
                <input
                  type="text"
                  name="name"
                  placeholder="Your Name *"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full border border-gray-200 rounded-xl pl-10 pr-3 py-3.5 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400/50 focus:border-transparent transition-all bg-white hover:border-yellow-200 shadow-sm"
                />
                <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-xs text-red-400 font-medium">Required</span>
              </div>

              <div className="relative group">
                <Mail size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 group-focus-within:text-yellow-500 transition-colors" />
                <input
                  type="email"
                  name="email"
                  placeholder="Email Address"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full border border-gray-200 rounded-xl pl-10 pr-3 py-3.5 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400/50 focus:border-transparent transition-all bg-white hover:border-yellow-200 shadow-sm"
                />
              </div>

              <div className="relative group">
                <Phone size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 group-focus-within:text-yellow-500 transition-colors" />
                <input
                  type="tel"
                  name="phone"
                  placeholder="Phone Number"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full border border-gray-200 rounded-xl pl-10 pr-3 py-3.5 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400/50 focus:border-transparent transition-all bg-white hover:border-yellow-200 shadow-sm"
                />
              </div>

              <div className="relative group">
                <Tag size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 z-10 group-focus-within:text-yellow-500 transition-colors" />
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="w-full border border-gray-200 rounded-xl pl-10 pr-10 py-3.5 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400/50 focus:border-transparent transition-all bg-white hover:border-yellow-200 appearance-none cursor-pointer shadow-sm"
                >
                  <option value="General">General Inquiry</option>
                  <option value="Technical">Technical Issue</option>
                  <option value="Content">Content Issue</option>
                  <option value="Harassment">Harassment Report</option>
                  <option value="Suggestion">Suggestion</option>
                  <option value="Other">Other</option>
                </select>
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
                  <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                  </svg>
                </div>
              </div>

              <div>
                <div className="relative group">
                  <textarea
                    name="message"
                    rows="4"
                    placeholder="Type your message here... *"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    maxLength="1000"
                    className="w-full border border-gray-200 rounded-xl px-4 py-3.5 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-yellow-400/50 focus:border-transparent transition-all bg-white hover:border-yellow-200 shadow-sm"
                  />
                </div>

                <div className="flex justify-between items-center mt-2">
                  <div className="flex items-center gap-1.5 text-xs">
                    <AlertCircle size={14} className="text-gray-400" />
                    <span className="text-gray-500">Max 1000 characters</span>
                  </div>
                  <span className={`text-xs font-semibold px-2 py-1 rounded-full ${
                    formData.message.length > 900 
                      ? 'bg-orange-100 text-orange-600' 
                      : 'bg-gray-100 text-gray-600'
                  }`}>
                    {formData.message.length}/1000
                  </span>
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="bg-gradient-to-r from-yellow-500 to-amber-500 hover:from-yellow-600 hover:to-amber-600 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-300 transform hover:scale-[1.02] hover:shadow-xl disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:scale-100 disabled:hover:shadow-none flex items-center justify-center gap-2 group relative overflow-hidden mt-auto"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
              
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Submitting...</span>
                </>
              ) : (
                <>
                  <Send size={18} className="group-hover:translate-x-1 transition-transform" />
                  <span>Submit Complaint</span>
                </>
              )}
            </button>

            <div className="flex flex-col gap-2 text-xs text-gray-400 pt-2 flex-shrink-0">
              <span className="text-gray-500">* Required fields</span>
              <span className="text-gray-500">We'll respond within 24hrs</span>
            </div>
          </form>

          {/* Modern decorative elements */}
          <div className="h-1.5 bg-gradient-to-r from-yellow-500 via-amber-500 to-orange-500 relative overflow-hidden flex-shrink-0">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/50 to-transparent animate-shimmer"></div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ComplaintForm;