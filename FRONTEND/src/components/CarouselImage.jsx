import React from "react";
const apiBaseUrl = import.meta.env.VITE_API_URL;

const CarouselImage = ({ item }) => {
  console.log(item.images)
  return (
    <img
      className="w-[100%] h-64 object-cover rounded-2xl mb-2"
      src={`${apiBaseUrl}/images/${item.images[0]}`}
      alt=""
      loading="lazy"
    />
  );
};

export default CarouselImage;
