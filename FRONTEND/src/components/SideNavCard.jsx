import React from "react";

const SideNavCard = ({ children }) => {
  return (
    <ul
      className="bg-gray-700 p-2 mt-4 w-[100%] rounded-2xl flex flex-col
                     
    "
    >
      {children}
    </ul>
  );
};

export default SideNavCard;
