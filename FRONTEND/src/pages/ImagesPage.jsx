import React from "react";
import { FaAngleLeft } from "react-icons/fa";
const apiBaseUrl = import.meta.env.VITE_API_URL;

const ImagesPage = ({ images, onClick }) => {
  return (
    <div className="flex flex-col">
      <button
        className="p-4 m-3 bg-black/50 rounded-full fixed "
        onClick={onClick}
      >
        <FaAngleLeft />
      </button>
      <section className="w-full flex-1 flex flex-col gap-2">
        {images.map((image) => (
          <img src={`${apiBaseUrl}/images/${image}`} alt="" />
        ))}
      </section>
    </div>
  );
};

export default ImagesPage;
