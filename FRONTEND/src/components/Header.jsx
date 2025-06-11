import React from "react";
import { Link } from "react-router-dom";
import { openSideNav, toggleBrowseListings } from "../features/stylings/styleSlice";
import { useDispatch } from "react-redux";
import SideNav from "./SideNav";
import { FaBars, FaCog, FaCogs, FaFilter, FaSearch, FaSearchDollar, FaSearchengin, FaSearchLocation, FaSearchMinus } from "react-icons/fa";

const Header = () => {
  const dispatch = useDispatch()


  return (
    <>
    <header className="bg-black text-white sticky top-0 z-20 p-2 ">
      <section className="flex items-center">
        <p className="mr-auto p-3 font-bold text-[1.3rem]">
          <Link onClick={() => dispatch(toggleBrowseListings())} to="/">Home<span
          className="text-blue-500">X</span></Link>
        </p>
        <section className="flex items-center gap-4">

        <button className="text-white/70">
          {/* <FaCogs /> filter */}
        </button>
        <button
        onClick={() => dispatch(openSideNav())}
          className="text-base pr-4"
          aria-label="menu"
        >
          <FaBars />
          {/* hamburger haifanyi hii side ya althomepage i wonder why */}
        </button>
        </section>
      </section>
    </header>
    <SideNav />

    </>
  );
};

export default Header;
