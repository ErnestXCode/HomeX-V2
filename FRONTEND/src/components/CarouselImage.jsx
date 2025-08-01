import React, { memo, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { selectCurrentUser } from "../features/users/userSlice";
import { FaAngleLeft, FaAngleRight, FaBookmark } from "react-icons/fa";
import { useQueryClient, useMutation } from "@tanstack/react-query";
import axios from "../api/axios";

const apiBaseUrl = import.meta.env.VITE_API_URL;

const CarouselImage = ({
  showMore,
  item,
  showThumbnails,
  showBookMark,
  userShortlists,
}) => {
  const [loaded, setLoaded] = useState(false);
  const [index, setIndex] = useState(0);
  const [blueIcon, setBlueIcon] = useState(
    userShortlists?.includes(item._id) ?? false
  );

  const userInfo = useSelector(selectCurrentUser);
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const handleShortLists = async (house) => {
    setBlueIcon((prev) => !prev); // toggle icon state
    const response = await axios.post(
      `/profile`,
      JSON.stringify({ houseId: house._id }),
      {
        withCredentials: true,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${userInfo?.accessToken}`,
        },
      }
    );
    return response.data;
  };

  const { mutate: toggleShortlist } = useMutation({
    mutationFn: handleShortLists,
    onSuccess: () => {
      queryClient.invalidateQueries(["shortlist"]);
    },
  });

  const data = showThumbnails ? item?.thumbnails : item?.images;
  if (!data) return <div>No thumbnails or images</div>;

  return (
    <div className="relative">
      <div className="flex overflow-hidden">
        {data.map((image, idx) => (
          <img
            key={idx}
            onClick={showMore ? null : () => navigate(`house/${item?._id}`)}
            className="w-[100%] grow-0 shrink-0 h-64 object-cover rounded-2xl mb-2 transition-transform duration-300 ease-in-out"
            style={{ translate: `${-100 * index}%` }}
            src={
              loaded
                ? `${apiBaseUrl}/images/${image}`
                : item?.placeholderThumbnail
            }
            onLoad={() => setLoaded(true)}
            alt="House card image"
            loading="lazy"
            decoding="async"
          />
        ))}
      </div>

      {data.length > 1 && (
        <>
          <div
            onClick={() => setIndex((prev) => (prev + 1) % data.length)}
            className="absolute bg-black/50 top-29 right-2 p-3 rounded-full"
          >
            <FaAngleRight />
          </div>
          <div
            onClick={() => setIndex((prev) => (prev - 1 + data.length) % data.length)}
            className="absolute bg-black/50 top-29 left-2 p-3 rounded-full"
          >
            <FaAngleLeft />
          </div>
        </>
      )}

      <div className="flex absolute bottom-3 w-full justify-center gap-1">
        {data?.length > 1 &&
          data.map((_, idx) => (
            <div
              key={idx}
              className={`h-1.5 w-1.5 rounded-full ${
                idx === index ? "bg-white" : "bg-white/50"
              }`}
            ></div>
          ))}
      </div>

      {showBookMark && (
        <button
          onClick={() => toggleShortlist(item)}
          className={`absolute top-5 right-5 text-xl ${
            blueIcon ? "text-blue-600" : "text-black"
          }`}
        >
          <FaBookmark
            style={{
              stroke: "white",
              strokeWidth: 2,
            }}
          />
        </button>
      )}
    </div>
  );
};

export default CarouselImage;
