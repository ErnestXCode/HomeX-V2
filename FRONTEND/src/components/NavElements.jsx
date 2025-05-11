import React from "react";
import { Link } from "react-router-dom";

const NavElements = ({ side, onClick, link, children }) => {
  return (
    <li className="flex">
      <Link
        className={`p-2 active:text-blue-600 w-[100%]
      ${side ? "bg-gray-800 rounded-2xl mt-1 pl-4 active:bg-gray-500" : ""}
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
