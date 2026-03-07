import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X } from "lucide-react";

function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 40);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setIsOpen(false);
  }, [location]);

  const navLinks = [
    { path: "/", label: "Home" },
    { path: "/news", label: "News" },
    { path: "/opportunities", label: "Opportunities" },
    { path: "/lifestyle", label: "Lifestyle" },
    { path: "/culture", label: "Culture" },
    { path: "/stories", label: "Stories" },
    { path: "/resources", label: "Resources" },
    {path: "/executives", label: "Executives" },
  ];

  return (
    <nav
      className={`fixed w-full z-50 transition-all duration-300 ${
        scrolled
          ? "bg-gradient-to-r from-gray-900/40 to-gray-600/40 shadow-2xl backdrop-blur-sm"
          : "bg-gradient-to-r from-white to-white"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="text-xl font-bold text-white transition-transform flex items-center gap-1.5 group-hover:scale-105">
              <img src="/nycn.png" alt="logo for nycn" className="w-[58px]" />
              <span className="text-yellow-400">Umuahia <span className="text-green-600">Youth</span></span>
             
            </div>
          </Link>

          {/* Desktop Menu */}
          <ul className="hidden md:flex space-x-8">
            {navLinks.map((link) => (
              <li key={link.path}>
                <Link
                  to={link.path}
                  className={`relative text-sm font-medium transition-colors duration-200 ${
                    location.pathname === link.path
                      ? "text-yellow-400"
                      : "text-green-600 hover:text-yellow-400"
                  } after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-yellow-400 after:transition-all after:duration-300 hover:after:w-full`}
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>

          {/* Mobile Toggle */}
          <button
            className="md:hidden p-2 rounded-lg hover:bg-green-600 transition-colors text-white"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X size={24} className="text-green-600 font-bold" /> : <Menu size={24} className="text-green-600 font-bold" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        className={`md:hidden overflow-hidden transition-all duration-300 ${
          isOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="bg-gradient-to-b from-green-700 to-green-800 px-6 py-4 space-y-1">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={`block px-4 py-2 rounded-lg transition-colors duration-200 ${
                location.pathname === link.path
                  ? "bg-green-600 text-yellow-400"
                  : "text-white hover:bg-green-600"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;