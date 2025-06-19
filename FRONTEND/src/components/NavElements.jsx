import React from "react";
import { Link, NavLink } from "react-router-dom";

const NavElements = ({ side, onClick, link, children }) => {
  return (
    <li className="flex">
      <NavLink
      style={({isActive}) => {
        return {
          color: isActive  ? 'cornflowerblue' : '', 
          scale: isActive && !side ? '1.1': ''
        }
      }}
     
        aria-label={"some stuff"}
        className={`p-2 w-[100%]
      ${
        side
          ? "active:bg-gray-800 rounded-2xl text-[0.8rem]"
          : "text-base flex flex-col items-center"
      }
     `}
        to={link}
        onClick={onClick}
      >
        {children}
      </NavLink>
    </li>
  );
};

export default NavElements;
