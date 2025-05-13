import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import ViewButton from "./ViewButton";
import ListText from "./ListText";
import CarouselButton from "./CarouselButton";
import CarouselImage from "./CarouselImage";
const apiBaseUrl = import.meta.env.VITE_API_URL;

const DataList = ({ data, handleReset }) => {
  const navigate = useNavigate();
  const handleHouse = async (id) => {
    try {
      const res = await axios.get(`${apiBaseUrl}/houses/${id}`);
      console.log(res);
      navigate(`house/${id}`);
    } catch (err) {
      console.log("Error getting house", err);
    }
  };

  const handleDelete = async (id) => {
    try {
      const res = await axios.delete(`${apiBaseUrl}/houses/${id}`);
      console.log(res.data);
      handleReset();
    } catch (err) {
      console.log("error", err);
    }
  };

  const [index, setIndex] = useState(0);

  const carouselNext = (index, itemImages) => {
    if (index < itemImages.length - 1) {
      setIndex((prevIdx) => prevIdx + 1);
    }
  };
  const carouselPrev = (index, itemImages) => {
    if (index <= itemImages.length - 1 && index >= 1) {
      setIndex((prevIdx) => prevIdx - 1);
    }
  };

  const newData = data?.map((item) => {
    return (
      <div
        key={item._id}
        className="bg-gray-800 mt-3 p-3 rounded-2xl mb-10 md:w-[500px] md:h-auto"
      >
        <section className="">
          <CarouselImage item={item} apiBaseUrl={apiBaseUrl} index={index} />
          <CarouselButton onClick={() => carouselPrev(index, item.images)}>
            prev
          </CarouselButton>
          <CarouselButton onClick={() => carouselNext(index, item.images)}>
            next
          </CarouselButton>
        </section>

        <ListText content={item.landMarks}>Landmarks: </ListText>
        <ListText content={item.pricing}>Price: </ListText>
        <ListText content={item.area}>Area: </ListText>
        <ListText content={item.landMarks}>Landmarks: </ListText>

        <section className="flex justify-between m-3">
          {/* <ViewButton onClick={() => handleHouse(item._id)}>view</ViewButton> */}
          {/* create a modal for here */}
          <ViewButton onClick={() => handleDelete(item._id)}>delete</ViewButton>
        </section>
      </div>
    );
  });

  return <main className="md:flex md:gap-4 p-5">{newData}</main>;
};

export default DataList;
