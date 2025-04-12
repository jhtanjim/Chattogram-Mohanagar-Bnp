import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaBars, FaTimes } from "react-icons/fa";
import { useAuth } from "../../contexts/AuthContext.jsx";
import { useUserData } from "../../hooks/useUserData";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const { isAuthenticated, logout } = useAuth();
  const { userData } = useUserData();
  const [isUserDataLoaded, setIsUserDataLoaded] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (userData) {
      setIsUserDataLoaded(true);
    }
  }, [userData]);

  const toggleMenu = () => {
    setMenuOpen((prev) => !prev);
  };

  const closeMenu = () => {
    setMenuOpen(false);
  };

  const handleLogout = () => {
    logout();
    closeMenu();
    navigate("/");
  };

  return (
    <nav className="sticky top-0 w-full bg-green-100 border-b border-gray-200 shadow-md z-50">
      <div className="container mx-auto flex items-center justify-between p-4">
        {/* Logo Section - Improved for all screen sizes */}
        <Link to="/" className="flex items-center space-x-2 shrink-0">
          <img
            src="https://upload.wikimedia.org/wikipedia/commons/c/cb/Flag_of_the_Bangladesh_Nationalist_Party.svg"
            alt="Logo"
            className="h-12 w-12 sm:h-14 sm:w-14 md:h-16 md:w-16"
          />
          <span className="text-sm sm:text-base md:text-lg font-bold text-green-800">
            চট্টগ্রাম মহানগর বিএনপি
          </span>
        </Link>

        {/* Mobile & Tablet Hamburger Icon */}
        <button
          className="text-green-800 lg:hidden text-2xl focus:outline-none"
          onClick={toggleMenu}
        >
          {menuOpen ? <FaTimes /> : <FaBars />}
        </button>

        {/* Navigation Links - Improved breakpoints */}
        <div
          className={`${
            menuOpen ? "flex" : "hidden"
          } lg:flex flex-col lg:flex-row items-start lg:items-center space-y-4 lg:space-y-0 lg:space-x-6 absolute lg:static top-16 left-0 w-full lg:w-auto bg-green-100 lg:bg-transparent p-4 lg:p-0 shadow-md lg:shadow-none z-10`}
        >
          <Link
            to="/"
            onClick={closeMenu}
            className="block w-full lg:w-auto text-green-800 hover:text-green-900 font-medium transition duration-200"
          >
            হোম
          </Link>
          <Link
            to="/about"
            onClick={closeMenu}
            className="block w-full lg:w-auto text-green-800 hover:text-green-900 font-medium transition duration-200"
          >
            আমাদের সম্পর্কে
          </Link>
          <Link
            to="/video"
            onClick={closeMenu}
            className="block w-full lg:w-auto text-green-800 hover:text-green-900 font-medium transition duration-200"
          >
            ভিডিও
          </Link>

          {isAuthenticated && (
            <Link
              to="/dashBoard"
              onClick={closeMenu}
              className="block w-full lg:w-auto text-green-800 hover:text-green-900 font-medium transition duration-200"
            >
              ড্যাশবোর্ড
            </Link>
          )}

          {/* Mobile & Tablet Auth Buttons */}
          <div className="lg:hidden w-full">
            {isAuthenticated ? (
              <div className="flex flex-col space-y-2">
                <span className="text-green-800 font-medium">
                  {userData?.fullName}
                </span>
                <button
                  onClick={handleLogout}
                  className="flex justify-center items-center w-full bg-red-500 text-white p-2 rounded-md hover:bg-red-600 transition duration-200"
                >
                  <span className="mr-2">লগআউট</span>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 12h14M12 5l7 7-7 7"
                    />
                  </svg>
                </button>
              </div>
            ) : (
              <Link
                to="/signIn"
                onClick={closeMenu}
                className="flex justify-center items-center w-full bg-green-600 text-white p-2 rounded-md hover:bg-green-700 transition duration-200"
              >
                <span className="mr-2">সাইন ইন</span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 12h14M12 5l7 7-7 7"
                  />
                </svg>
              </Link>
            )}
          </div>
        </div>

        {/* Desktop Auth Buttons */}
        <div className="hidden lg:flex items-center space-x-4">
          {isAuthenticated ? (
            <>
              <span className="text-green-800 font-medium">
                {userData?.fullName}
              </span>
              <button
                onClick={handleLogout}
                className="inline-flex items-center bg-red-500 hover:bg-red-600 text-white font-medium px-4 py-2 rounded-md transition duration-200"
              >
                <span className="mr-2">লগআউট</span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 12h14M12 5l7 7-7 7"
                  />
                </svg>
              </button>
            </>
          ) : (
            <Link
              to="/signIn"
              className="inline-flex items-center bg-green-600 hover:bg-green-700 text-white font-medium px-4 py-2 rounded-md transition duration-200"
            >
              <span className="mr-2">সাইন ইন</span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 12h14M12 5l7 7-7 7"
                />
              </svg>
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;