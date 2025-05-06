import React, { useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { selectCurrentUser } from "../features/users/userSlice";

const Header = () => {
  const user = useSelector(selectCurrentUser);

  const [expandableNavStyle, setExpandableNavStyle] = useState(null);
  const [navActivator, setNavActivator] = useState(false);

  const toggleNav = () => {
    setNavActivator((prevStye) => !prevStye);
    setExpandableNavStyle(
      navActivator
        ? {
            display: "flex",
          }
        : {
            display: "none",
          }
    );
  };

  return (
    <header className="bg-black text-white sticky top-0 z-20 p-2">
      <section className="flex">
        <p className="m-2 mr-auto p-2">
          <Link to="/">LOGO</Link>
        </p>
        <button
          className="ml-auto md:hidden cursor-pointer"
          onClick={toggleNav}
        >
          hamburger
        </button>
      </section>

      <ul
        className="gap-2 border-b-2 border-blue-400 flex items-end p-3 flex-col bg-black  md:flex-row md:justify-end md:mt-0 text-white "
        style={expandableNavStyle}
      >
        <li>
          <Link
            className="hover:text-blue-300 block hover:bg-[#333] p-2 rounded-2xl hover:border-blue-500"
            to="/"
          >
            Home
          </Link>
        </li>
        <li>
          {user ? (
            <Link
              className="hover:text-blue-300 block hover:bg-[#333] p-2 rounded-2xl hover:border-blue-500"
              to="/profile"
            >
              Profile
            </Link>
            
          ) : (
            <Link
              className="hover:text-blue-300 block hover:bg-[#333] p-2 rounded-2xl hover:border-blue-500"
              to="/login"
            >
              Login
            </Link>
          )}
        </li>
        <li>
          <Link
            className="hover:text-blue-300 block hover:bg-[#333] p-2 rounded-2xl hover:border-blue-500"
            to="/help"
          >
            Help
          </Link>
        </li>
        <li>
          <Link
            className="hover:text-blue-300 block hover:bg-[#333] p-2 rounded-2xl hover:border-blue-500"
            to="/donate"
          >
            Donate
          </Link>
        </li>
        <li>
          <Link
            className="hover:text-blue-300 hidden md:block hover:bg-[#333] p-2 rounded-2xl hover:border-blue-500"
            to="/about-us"
          >
            About
          </Link>
        </li>
        <li>
          <Link
            className="hover:text-blue-300 hidden md:block hover:bg-[#333] p-2 rounded-2xl hover:border-blue-500"
            to="/contact-us"
          >
            Contact us
          </Link>
        </li>
        <li>
          <Link
            className="hover:text-blue-300 md:block hover:bg-[#333] p-2 rounded-2xl hover:border-blue-500"
            to="/post-house"
          >
            Post a House
          </Link>
        </li>
      </ul>
    </header>
    // get rid of some in the mobile view
  );
};

export default Header;
