import React from "react";
import { Link } from "react-router-dom";
import { toggleBrowseListings, toggleSideNav } from "../features/stylings/styleSlice";
import { useDispatch } from "react-redux";

const Header = () => {
  const dispatch = useDispatch()


  return (
    <header className="bg-black text-white sticky top-0 z-20 p-2 ">
      <section className="flex items-center">
        <p className="mr-auto p-3 font-bold text-[1.3rem]">
          <Link onClick={() => dispatch(toggleBrowseListings())} to="/">Home<span
          className="text-blue-500">X</span></Link>
        </p>
        <button
        onClick={() => dispatch(toggleSideNav())}
          className="ml-auto md:hidden cursor-pointer active:bg-gray-600 p-3 rounded-2xl"
        >
          hamburger
          {/* hamburger haifanyi hii side ya althomepage i wonder why */}
        </button>
      </section>
    </header>
  );
};

export default Header;
