import React from "react";
import { FaArrowRight } from "react-icons/fa";
import { Link } from "react-router-dom";

const ProfileButton = ({link, children}) => {
  return (
    <Link to={link} className="border-b border-white/30 w-[100%] p-1 pb-2 flex items-center justify-between">
      <p>{children}</p>
      <p className="text-white/50">
      <FaArrowRight />
      </p>
    </Link>
  );
};

export default ProfileButton;
