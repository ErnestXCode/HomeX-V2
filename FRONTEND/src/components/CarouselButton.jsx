import React from "react";

const CarouselButton = ({ onClick, children }) => {
  return (
    <button
      onClick={onClick}
      className="p-4 rounded-2xl bg-black/70 text-white"
    >
      {children}
    </button>
  );
};

export default CarouselButton;
