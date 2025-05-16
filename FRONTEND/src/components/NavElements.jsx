import React from "react";
import { Link } from "react-router-dom";

const NavElements = ({ side, onClick, link, children }) => {
  return (
    <li className="flex">
      <Link
      aria-label={'some stuff'}
        className={`p-2 w-[100%]
      ${side ? "active:bg-gray-800 rounded-2xl text-[0.75rem]" : "text-base"}
     `}
        to={link}
        onClick={onClick}
      >
        {children}
      </Link>
    </li>
  );
};

export default NavElements;
