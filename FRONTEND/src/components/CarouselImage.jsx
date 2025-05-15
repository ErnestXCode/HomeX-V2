import React from "react";

const CarouselImage = ({ apiBaseUrl, index, item }) => {
  return (
    <img
      className="w-[100%] h-64 object-cover rounded-2xl mb-2"
      src={`${apiBaseUrl}/${item.images[index]}`}
      alt=""
      loading="lazy"
    />
  );
};

export default CarouselImage;
