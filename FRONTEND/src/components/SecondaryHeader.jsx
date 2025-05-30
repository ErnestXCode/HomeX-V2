import React from "react";
import { FaAngleLeft } from "react-icons/fa";
import { Link } from "react-router-dom";

const SecondaryHeader = ({ children }) => {
  return (
    <div className=" sticky top-0">
      <h1 className="text-xl p-3 font-serif text-white/80 text-center">
        {children}
      </h1>
      <nav className="p-4 fixed top-0 text-xl text-white/80">
        <Link to={-1}>
          <FaAngleLeft />
        </Link>
      </nav>
    </div>
  );
};

export default SecondaryHeader;
