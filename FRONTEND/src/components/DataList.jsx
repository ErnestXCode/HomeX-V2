import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
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
        className="bg-gray-800 mt-3 p-3 rounded-2xl mb-10
        md:w-[500px] md:h-auto
        "
      >
        <section className="">
          <img
            className="w-[100%]
          h-70 object-cover
          rounded-2xl
          mb-3
          

"
            src={`${apiBaseUrl}/${item.images[index]}`}
            alt=""
          />
          <button
            onClick={() => carouselPrev(index, item.images)}
            className="p-4 rounded-2xl bg-black/70 text-white
            mr-5
             "
          >
            prev
          </button>
          <button
            onClick={() => carouselNext(index, item.images)}
            className="p-4 rounded-2xl bg-black/70 text-white
            
            "
          >
            next
          </button>
        </section>
        <h3 className="text-blue-400 font-bold p-1 text-[1rem]">
          Price:{" "}
          <span className="text-white font-semibold">{item.pricing}</span>
        </h3>
        <p className="text-blue-400 font-bold p-1 text-[1rem]">
          Area: <span className="text-white font-semibold">{item.area}</span>
        </p>
        <p className="text-blue-400 font-bold p-1 text-[1rem]">
          Landmarks:{" "}
          <span className="text-white font-semibold">{item.landMarks}</span>
        </p>

        <section className="flex">
          <button
            className="bg-gray-600 
        pt-1 pb-1 pr-3 pl-3 text-center 
        font-serif m-2 mt-3 ml-auto rounded-[10px] hover:cursor-pointer"
            onClick={() => handleHouse(item._id)}
          >
            view
          </button>
          <button
            onClick={() => handleDelete(item._id)}
            className="bg-red-600 pt-1 pb-1 pr-3 pl-3 text-center 
        font-serif m-2 mt-3 rounded-[10px] hover:cursor-pointer
       active:border-2"
          >
            delete
          </button>
        </section>
      </div>
    );
  });

  return (
    <main
      className="
  md:flex md:gap-4
  p-5
  "
    >
      {newData}
    </main>
  );
};

export default DataList;
