import React, { useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { selectCurrentUser } from "../features/users/userSlice";
import { FaAngleLeft, FaAngleRight, FaBookmark } from "react-icons/fa";
const apiBaseUrl = import.meta.env.VITE_API_URL;

const CarouselImage = ({ showMore, item }) => {
  const [index, setIndex] = useState(0);
  const [blueIcon, setBlueIcon] = useState(false);
  const userInfo = useSelector(selectCurrentUser);

  const handleShortLists = async (house) => {
    setBlueIcon((prevState) => !prevState);
    const response = await fetch(`${apiBaseUrl}/profile`, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${userInfo?.accessToken}`,
      },
      body: JSON.stringify({ houseId: house._id }),
    });
    const json = response.json();
    const data = json.data;
    console.log(data);
    console.log(data);
  };

  const navigate = useNavigate();

  return (
    <div className="relative">
      <div className="flex overflow-hidden">
        {item?.images.map((image) => (
          <img
            // make it stop responding to other images outside from listings
            onClick={showMore ? null : () => navigate(`house/${item._id}`)}
            className="w-[100%] grow-0 shrink-0 h-64 object-cover rounded-2xl mb-2 transition-transform duration-300 ease-in-out"
            style={{ translate: `${-100 * index}%` }}
            src={`${apiBaseUrl}/images/${image}`}
            alt=""
            // falback
            // pointerEvents='None'
          />
        ))}
      </div>
      {item?.images.length > 1 && (
        <div
          onClick={() => setIndex((prev) => (prev + 1) % item?.images?.length)}
          className="absolute bg-black/50 top-29 right-2 p-3 rounded-full"
        >
          <FaAngleRight />
        </div>
      )}
      {index > 0 && (
        <div
          onClick={() => setIndex((prev) => (prev - 1) % item?.images?.length)}
          className="absolute bg-black/50 top-29 left-2 p-3 rounded-full"
        >
          <FaAngleLeft />
        </div>
      )}
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

      <button
        onClick={() => handleShortLists(item)}
        className={`absolute top-5 right-5 text-xl ${
          blueIcon ? "text-blue-600" : "text-black"
        }`}
      >
        <FaBookmark />
      </button>
    </div>
  );
};

export default CarouselImage;
