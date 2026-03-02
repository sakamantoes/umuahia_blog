import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Menu, X } from "lucide-react";

const Navbar = () => {
  const categories = [
    { name: "News & Updates", path: "/posts/News & Updates" },
    { name: "Opportunities", path: "/posts/Opportunities" },
    { name: "Lifestyle", path: "/posts/Lifestyle" },
    { name: "Culture", path: "/posts/Culture" },
    { name: "Stories", path: "/posts/Stories" },
    { name: "Resources", path: "/posts/Resources" },
  ];

  const [isMenuOpen, setIsMenuOpen] = useState(false);
 
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className="bg-blue-600 text-white p-4 relative">
      <div className="container mx-auto flex items-center justify-between">
        <Link to="/" className="md:text-2xl text-xl font-bold">
          Umuahia South Youth
        </Link>

        <div className="sm:flex md:flex hidden items-center space-x-4">
          {categories.map((cat) => (
            <Link key={cat.name} to={cat.path} className="hover:text-blue-200 ">
              {cat.name}
            </Link>
          ))}
          <Link to="/youth" className="hover:text-blue-200">
            Youth Directory
          </Link>
          <Link
            to="/register"
            className="bg-white text-blue-600 px-4 py-2 rounded"
          >
            Register
          </Link>
        </div>

        <div className="md:hidden">
          {isMenuOpen ? (
            <X className="w-6 h-6 cursor-pointer" onClick={toggleMenu} />
          ) : (
            <Menu className="w-6 h-6 cursor-pointer" onClick={toggleMenu} />
          )}
        </div>

        {/* Mobile Menu */}
        {/* Overlay */}
        {isMenuOpen && (
          <div
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 transition-opacity duration-500"
            onClick={toggleMenu}
          />
        )}

        {/* Mobile Glass SideNav */}
        <div
          className={`md:hidden fixed top-0 right-0 h-full w-80 
  bg-white/10 backdrop-blur-xl border-l border-white/20 
  shadow-2xl z-50 transform transition-all duration-500 ease-in-out
  ${isMenuOpen ? "translate-x-0 opacity-100" : "translate-x-full opacity-0"}
  `}
        >
          <div className="p-6 flex justify-between items-center border-b border-white/20">
            <h2 className="text-white font-bold text-lg">Menu</h2>
            <X
              className="w-6 h-6 cursor-pointer text-white"
              onClick={toggleMenu}
            />
          </div>

          <div className="flex flex-col space-y-2 mt-6 px-6">
            {categories.map((cat) => (
              <Link
                key={cat.name}
                to={cat.path}
                onClick={() => setIsMenuOpen(false)}
                className="text-white py-3 font-bold px-4 rounded-lg hover:bg-white/20 transition-all duration-300"
              >
                {cat.name}
              </Link>
            ))}

            <div className="border-t border-white/20 my-4"></div>

            <Link
              to="/youth"
              onClick={() => setIsMenuOpen(false)}
              className="text-white py-3 px-4 rounded-lg hover:bg-white/20 transition-all duration-300"
            >
              Youth Directory
            </Link>

            <Link
              to="/register"
              onClick={() => setIsMenuOpen(false)}
              className="mt-4 bg-gradient-to-r from-blue-500 to-blue-700 text-white py-3 rounded-xl text-center font-semibold shadow-lg hover:scale-105 transition-all duration-300"
            >
              Register Now
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
