import React from "react";
import { FaArrowRight } from "react-icons/fa";
import { Link } from "react-router-dom";

const ProfileButton = ({ onClick, link, children }) => {
  return (
    <Link
      to={link}
      onClick={onClick}
      className="border-b border-white/30 w-[100%] pt-2 pb-2 pl-0 flex items-center justify-between"
    >
      <div>{children}</div>
      <p className="text-white/50">
        <FaArrowRight />
      </p>
    </Link>
  );
};

export default ProfileButton;
