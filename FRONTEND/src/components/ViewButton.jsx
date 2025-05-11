import React from "react";

const ViewButton = ({ onClick, children }) => {
  return (
    <button
      onClick={onClick}
      className="bg-gray-600 
        pt-1 pb-1 pr-3 pl-3 text-center 
        font-serif rounded-[10px] hover:cursor-pointer"
    >
      {children}
    </button>
  );
};

export default ViewButton;
