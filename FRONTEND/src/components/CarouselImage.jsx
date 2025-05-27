import React, { useState } from "react";
import ListingsPlaceholder from "./ListingsPlaceholder";
const apiBaseUrl = import.meta.env.VITE_API_URL;

const CarouselImage = ({ item }) => {
  const [index, setIndex] = useState(0);

  return (
    <div className="relative">
      <img
        onClick={() => setIndex((prev) => (prev + 1) % item?.images?.length)}
        // make it stop responding to other images outside from listings
        className="w-[100%] h-64 object-cover rounded-2xl mb-2"
        src={`${apiBaseUrl}/images/${item?.images[index]}`}
        alt=""
        // falback
        // pointerEvents='None'
      />
      <div className="flex absolute bottom-2 w-full justify-center gap-1">
        {item?.images?.length > 1 &&
          item?.images.map((_, idx) => (
            <div
              className={`h-1.5 w-1.5 rounded-full ${
                idx === index ? "bg-white" : "bg-white/50"
              }`}
            ></div>
          ))}
      </div>
    </div>
  );
};

export default CarouselImage;
