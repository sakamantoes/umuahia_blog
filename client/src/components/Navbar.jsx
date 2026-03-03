import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const Navbar = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    const userData = localStorage.getItem("user");
    if (token && userData) {
      setIsLoggedIn(true);
      setUser(JSON.parse(userData));
    }
  }, []);

  const handleToggle = () => {
    setIsOpen(!isOpen);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setIsLoggedIn(false);
    setUser(null);
    toast.success("Logged out successfully");
    navigate("/");
  };

  const categories = [
    { name: "News & Updates", path: "/posts/News & Updates" },
    { name: "Opportunities", path: "/posts/Opportunities" },
    { name: "Lifestyle", path: "/posts/Lifestyle" },
    { name: "Culture", path: "/posts/Culture" },
    { name: "Stories", path: "/posts/Stories" },
    { name: "Resources", path: "/posts/Resources" },
  ];

  return (
    <nav className="bg-white p-4 relative z-50 border-b border-red-100">
      <div className="container mx-auto flex justify-between items-center">
        
        {/* Logo */}
        <Link to="/" className="text-xl sm:text-3xl text-red-500 font-bold">
          Umuahia Youth
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center space-x-6">
          {categories.map((cat) => (
            <Link
              key={cat.name}
              to={cat.path}
              className="text-gray-800 hover:text-red-500 transition font-semibold"
            >
              {cat.name}
            </Link>
          ))}

          <Link
            to="/youth-directory"
            className="text-gray-800 hover:text-red-500 transition ml-5 font-semibold"
          >
            Youth Directory
          </Link>

          {isLoggedIn ? (
            <div className="flex items-center space-x-4">
              <span className="text-gray-700 text-sm">
                Hi, {user?.fullName?.split(" ")[0]}
              </span>
              <button
                onClick={handleLogout}
                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition"
              >
                Logout
              </button>
            </div>
          ) : (
            <div className="flex space-x-3">
              <Link
                to="/login"
                className="border border-red-500 text-red-500 px-4 py-2 rounded hover:bg-red-50 transition"
              >
                Login
              </Link>
              <Link
                to="/register"
                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition"
              >
                Register
              </Link>
            </div>
          )}
        </div>

        {/* Mobile Toggle */}
        <div className="md:hidden">
          {isOpen ? (
            <X size={28} onClick={handleToggle} className="text-red-500 cursor-pointer" />
          ) : (
            <Menu size={28} onClick={handleToggle} className="text-red-500 cursor-pointer" />
          )}
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ duration: 0.4 }}
            className="fixed top-0 right-0 w-full sm:w-1/2 h-screen bg-white text-gray-800 shadow-lg md:hidden"
          >
            <X
              size={28}
              onClick={handleToggle}
              className="cursor-pointer absolute top-4 left-4 text-red-500"
            />

            <div className="flex flex-col items-center justify-center h-full gap-8 text-lg font-semibold">
              {categories.map((cat) => (
                <Link
                  key={cat.name}
                  to={cat.path}
                  onClick={handleToggle}
                  className="hover:text-red-500 transition"
                >
                  {cat.name}
                </Link>
              ))}

              <Link
                to="/youth"
                onClick={handleToggle}
                className="hover:text-red-500 transition"
              >
                Youth Directory
              </Link>

              {isLoggedIn ? (
                <div className="flex flex-col items-center gap-4">
                  <span>
                    Hi, {user?.fullName?.split(" ")[0]}
                  </span>
                  <button
                    onClick={handleLogout}
                    className="bg-red-500 text-white px-6 py-2 rounded hover:bg-red-600 transition"
                  >
                    Logout
                  </button>
                </div>
              ) : (
                <div className="flex flex-col gap-4">
                  <Link
                    to="/login"
                    onClick={handleToggle}
                    className="border border-red-500 text-red-500 px-6 py-2 rounded text-center hover:bg-red-50 transition"
                  >
                    Login
                  </Link>
                  <Link
                    to="/register"
                    onClick={handleToggle}
                    className="bg-red-500 text-white px-6 py-2 rounded text-center hover:bg-red-600 transition"
                  >
                    Register
                  </Link>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;