import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Toaster from "react-hot-toast";

import Home from "./page/Home";
import Login from "./page/Login";
import Register from "./page/Register";
import Post from "./page/Posts";
import YouthDirectory from "./page/YouthDirectory";

import AdminDashboard from "./admin/AdminDashboard";
import AdminLogin from "./admin/AdminLogin";
import Navbar from "./components/Navbar";

const App = () => {
  return (
    <>
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/post" element={<Post />} />
          <Route path="/youth-directory" element={<YouthDirectory />} />
          <Route path="/admin-login" element={<AdminLogin />} />
          <Route path="/admin-dashboard" element={<AdminDashboard />} />
        </Routes>
      </Router>
    </>
  );
};

export default App;
