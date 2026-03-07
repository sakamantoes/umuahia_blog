import React, { useState, useEffect } from "react";
import { X } from "lucide-react";
import toast from "react-hot-toast";

function JoinForm() {
  const [showForm, setShowForm] = useState(false);
  const [email, setEmail] = useState("");
  const [isRegistered, setIsRegistered] = useState(false);
  const [loading, setLoading] = useState(false);
  const [communities, setCommunities] = useState([]);

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    community: "",
    village: "",
    age: "",
    gender: "",
    occupation: "",
  });

  useEffect(() => {
    fetchCommunities();
    const savedEmail = localStorage.getItem("youthEmail");

    if (savedEmail) {
      setEmail(savedEmail);
      checkRegistration(savedEmail);
    }
  }, []);

  const Api = 'https://umuahia-blog-2.onrender.com/api/youth'; // Update with your actual API URL

  const fetchCommunities = async () => {
    try {
      const res = await fetch(`${Api}/communities`);
      const data = await res.json();
      setCommunities(data.communities || []);
    } catch (error) {
      console.error(error);
    }
  };

  const checkRegistration = async (email) => {
    try {
      const res = await fetch(`${Api}/check/${email}`);
      const data = await res.json();
      setIsRegistered(data.exists);
    } catch (error) {
      console.error(error);
    }
  };

  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await checkRegistration(email);

      localStorage.setItem("youthEmail", email);

      setFormData((prev) => ({
        ...prev,
        email,
      }));

      setShowForm(true);
    } catch {
      toast.error("Error checking email");
    }

    setLoading(false);
  };

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
      const res = await fetch(`${Api}/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.msg);

      toast.success("Successfully joined Umuahia South Youth List 🎉");

      setIsRegistered(true);
      setShowForm(false);
    } catch (error) {
      toast.error(error.message || "Registration failed");
    }

    setLoading(false);
  };

  if (isRegistered) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {!showForm ? (
        <div className="bg-white/90 backdrop-blur-md shadow-2xl rounded-2xl w-80 p-6 border border-green-100 relative overflow-hidden group hover:shadow-green-200/50 transition-shadow duration-300">
          {/* Decorative Elements */}
          <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-green-400 to-emerald-300 rounded-bl-full opacity-10 group-hover:opacity-20 transition-opacity"></div>
          <div className="absolute bottom-0 left-0 w-16 h-16 bg-gradient-to-tr from-emerald-400 to-green-300 rounded-tr-full opacity-10 group-hover:opacity-20 transition-opacity"></div>
          
          <h3 className="text-lg font-semibold mb-4 text-gray-800 relative">
            <span className="bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
              Join Youth List
            </span>
          </h3>

          <form onSubmit={handleEmailSubmit} className="space-y-3 relative">
            <input
              type="email"
              placeholder="Enter your email"
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 transition-all bg-white/50 backdrop-blur-sm"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={loading}
            />

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white py-3 rounded-xl text-sm font-medium transition-all transform hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-green-500/25"
            >
              {loading ? "Checking..." : "Continue →"}
            </button>
          </form>
          
          <p className="text-xs text-gray-400 mt-3 text-center">
            Join 500+ young leaders in our community
          </p>
        </div>
      ) : (
        <div className="bg-white/95 backdrop-blur-md shadow-2xl rounded-2xl w-96 p-6 border border-green-100 relative overflow-y-auto max-h-[90vh]">
          {/* Decorative Header Gradient */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-green-400 via-emerald-500 to-green-400"></div>
          
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-semibold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
              Complete Registration
            </h3>

            <button
              onClick={() => setShowForm(false)}
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors group"
            >
              <X size={18} className="text-gray-400 group-hover:text-gray-600" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              name="fullName"
              placeholder="Full Name *"
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 transition-all bg-gray-50/50 hover:bg-white"
              value={formData.fullName}
              onChange={handleChange}
              required
            />

            <input
              name="email"
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm bg-gray-100/50 text-gray-600 cursor-not-allowed"
              value={formData.email}
              readOnly
            />

            <input
              name="phone"
              placeholder="Phone Number *"
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 transition-all bg-gray-50/50 hover:bg-white"
              value={formData.phone}
              onChange={handleChange}
              required
            />

            <select
              name="community"
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 transition-all bg-gray-50/50 hover:bg-white appearance-none"
              value={formData.community}
              onChange={handleChange}
              required
            >
              <option value="">Select Community *</option>
              {communities.map((comm) => (
                <option key={comm} value={comm}>
                  {comm}
                </option>
              ))}
            </select>

            <input
              name="village"
              placeholder="Village Name *"
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 transition-all bg-gray-50/50 hover:bg-white"
              value={formData.village}
              onChange={handleChange}
              required
            />

            <div className="grid grid-cols-2 gap-3">
              <input
                type="number"
                name="age"
                placeholder="Age *"
                min="15"
                max="45"
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 transition-all bg-gray-50/50 hover:bg-white"
                value={formData.age}
                onChange={handleChange}
                required
              />

              <select
                name="gender"
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 transition-all bg-gray-50/50 hover:bg-white appearance-none"
                value={formData.gender}
                onChange={handleChange}
                required
              >
                <option value="">Gender *</option>
                <option>Male</option>
                <option>Female</option>
                <option>Other</option>
              </select>
            </div>

            <input
              name="occupation"
              placeholder="Occupation (Optional)"
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 transition-all bg-gray-50/50 hover:bg-white"
              value={formData.occupation}
              onChange={handleChange}
            />

            <button
              disabled={loading}
              className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white py-3 rounded-xl text-sm font-medium transition-all transform hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-green-500/25 disabled:opacity-50 disabled:cursor-not-allowed mt-2"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Registering...
                </span>
              ) : (
                "Join List →"
              )}
            </button>

            <p className="text-xs text-gray-400 text-center mt-2">
              * Required fields
            </p>
          </form>
        </div>
      )}
    </div>
  );
}

export default JoinForm;