import React from "react";
const apiBaseUrl = import.meta.env.VITE_API_URL;

const CarouselImage = ({ item }) => {
  // const images = item?.images 
  // const carouselImages = images.map(image => <img
  //     className="w-[100%] h-64 object-cover rounded-2xl mb-2"
  //     src={`${apiBaseUrl}/images/${image}`}
  //     alt=""
  //     loading="lazy"
  //     // pointerEvents='None' 
  //     // make sure its correct
  //     />)
  return (
    
    <img
      className="w-[100%] h-64 object-cover rounded-2xl mb-2"
      src={`${apiBaseUrl}/images/${item?.images[0]}`}
      alt=""
      loading="lazy"
      // pointerEvents='None' 
      // make sure its correct
      />
     
  );
};

export default CarouselImage;
