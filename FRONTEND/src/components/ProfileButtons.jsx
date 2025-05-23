import React from "react";
import { FaAlignRight, FaAngleRight, FaArrowRight } from "react-icons/fa";
import { Link } from "react-router-dom";

const ProfileButton = ({ onClick, link, children }) => {
  return (
    <Link
      to={link}
      onClick={onClick}
      className="w-[100%] p-3 flex items-center justify-between"
    >
      <div>{children}</div>
      <p className="text-white/50">
        <FaAngleRight />
      </p>
    </Link>
  );
};

export default ProfileButton;
