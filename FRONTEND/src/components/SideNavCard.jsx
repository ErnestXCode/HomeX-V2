import React from "react";

const SideNavCard = ({ children }) => {
  return (
    <ul
      className="bg-gray-900 p-2.5 mt-4 w-[100%] rounded-3xl flex flex-col
                     
    "
    >
      {children}
    </ul>
  );
};

export default SideNavCard;
