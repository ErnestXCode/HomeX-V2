import React from "react";
import { useNavigate } from "react-router-dom";
const apiBaseUrl = import.meta.env.VITE_API_URL;

const CarouselImage = ({ index, item }) => {
 
  const navigate = useNavigate();
  return (
    <img
      onClick={() => navigate(`house/${item._id}`)}
      // make it stop responding to other images outside from listings
      className="w-[100%] h-64 object-cover rounded-2xl mb-2"
      src={`${apiBaseUrl}/images/${item?.images[index || 0]}`}
      alt=""
      loading="lazy"
      // pointerEvents='None'
    />
  );
};

export default CarouselImage;
