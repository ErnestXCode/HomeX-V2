import React, { useState } from "react";
import { useSelector } from "react-redux";
import { selectCurrentUser } from "../features/users/userSlice";
import { FaBookmark } from "react-icons/fa";
const apiBaseUrl = import.meta.env.VITE_API_URL;

const CarouselImage = ({ item }) => {
  const [index, setIndex] = useState(0);
  const [blueIcon, setBlueIcon] = useState(false)
  const userInfo = useSelector(selectCurrentUser)


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


  return (
    <div className="relative">
      <div>

      <img
        onClick={() => setIndex((prev) => (prev + 1) % item?.images?.length)}
        // make it stop responding to other images outside from listings
        className="w-[100%] h-64 object-cover rounded-2xl mb-2"
        src={`${apiBaseUrl}/images/${item?.images[index]}`}
        alt=""
        // falback
        // pointerEvents='None'
        />
        </div>
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
        className={`absolute top-5 right-5 text-base ${
          blueIcon ? "text-blue-600" : "text-white/50"
        }`}
      >
        <FaBookmark />
      </button>
    </div>
  );
};

export default CarouselImage;
