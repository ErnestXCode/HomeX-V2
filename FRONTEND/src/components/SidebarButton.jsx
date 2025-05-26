import React from "react";
import { Link } from "react-router-dom";

const SidebarButton = ({ white, link, children }) => {
  return (
    <button className="w-[100%]">
      <Link
        to={link}
        className={`${
          white ? "bg-gray-100 active:bg-gray-400 text-black" : "bg-blue-600"}
          block p-1 pt-1.20 pb-1.20 mt-3 rounded-xl            `}
      >
        {children}
      </Link>
    </button>
  );
};

export default SidebarButton;
