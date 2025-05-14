import React from "react";

const CarouselImage = ({ apiBaseUrl, index, item }) => {
  return (
    <img
      className="w-[100%] h-50 object-cover rounded-2xl mb-3"
      src={`${apiBaseUrl}/${item.images[index]}`}
      alt=""
    />
  );
};

export default CarouselImage;
