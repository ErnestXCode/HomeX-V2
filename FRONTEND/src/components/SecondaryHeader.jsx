import React from "react";
import { FaAngleLeft } from "react-icons/fa";
import { Link } from "react-router-dom";

const SecondaryHeader = ({ children }) => {
  return (
    <div className="bg-gray-900 sticky top-0">
      <h1 className="text-xl p-3 font-semibold text-center">
        {children}
      </h1>
      <nav className="p-4 fixed top-0 text-xl text-white/80">
        <Link to={"/"}>
          <FaAngleLeft />
        </Link>
      </nav>
    </div>
  );
};

export default SecondaryHeader;
