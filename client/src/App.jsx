import React, { useEffect, useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { Toaster } from "react-hot-toast";
import axios from "axios";

// Components
import Navbar from "./components/Navbar";
import JoinForm from "./components/JoinForm";
import ComplaintForm from "./components/ComplaintForm";
import PostDetail from "./page/PostDetail";

// Pages
import Home from "./page/Home";
import News from "./page/News";
import Opportunities from "./page/Opportunities";
import Lifestyle from "./page/Lifestyle";
import Culture from "./page/Culture";
import Stories from "./page/Stories";
import Resources from "./page/Resources";
import AdminLogin from "./page/AdminLogin";
import AdminDashboard from "./page/AdminDashboard";
import Executives from "./page/Executives";
import Loader from "./components/Loader";
import AboutUs from "./page/AboutUs";

// Set axios base URL
axios.defaults.baseURL = "http://localhost:5000";

function App() {
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    // Check API connection
    axios
      .get(`${axios.defaults.baseURL}`)
      .then((response) => {
        console.log("API connection successful", response.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("API connection failed:", err);
        setLoading(false);
      });
  }, []);
  if (loading) {
    return (
      <div className="flex justify-center items-center h-[50vh]">
        <Loader />
      </div>
    );
  }

  return (
    <Router>
      <div className="App">
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: "#363636",
              color: "#fff",
            },
            success: {
              duration: 3000,
              iconTheme: {
                primary: "#10b981",
                secondary: "#fff",
              },
            },
            error: {
              duration: 4000,
              iconTheme: {
                primary: "#ef4444",
                secondary: "#fff",
              },
            },
          }}
        />

        <Navbar />

        <main className="w-full m-auto">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/news" element={<News />} />
            <Route path="/opportunities" element={<Opportunities />} />
            <Route path="/lifestyle" element={<Lifestyle />} />
            <Route path="/culture" element={<Culture />} />
            <Route path="/aboutus" element={<AboutUs />} />
            <Route path="/:category/:id" element={<PostDetail />} />
            <Route path="/stories" element={<Stories />} />
            <Route path="/resources" element={<Resources />} />
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
            <Route path="/executives" element={<Executives />} />
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </main>

        <JoinForm />
        <ComplaintForm />

        <footer className="bg-gradient-to-r from-green-800 to-emerald-800 text-white text-center py-8 mt-5 shadow-inner">
          <div className="container mx-auto px-4">
            <p className="mb-2 text-lg font-light tracking-wide">
              &copy; {new Date().getFullYear()} Umuahia South Youth Platform.
              All rights reserved.
            </p>
            <small className="text-green-200 text-sm opacity-90 italic">
              Empowering the youth of Umuahia South LGA
            </small>

            {/* Optional decorative element - you can remove this if you want */}
            <div className="w-16 h-0.5 bg-green-400/50 mx-auto mt-3 rounded-full"></div>
          </div>
        </footer>
      </div>
    </Router>
  );
}

export default App;
