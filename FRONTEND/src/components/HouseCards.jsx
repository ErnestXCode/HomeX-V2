import React, { memo } from "react";
import CarouselImage from "./CarouselImage";
import ListText from "./ListText";
import { useNavigate, Link } from "react-router-dom";
import {
  FaCheckCircle,
  FaDumpster,
  FaEdit,
  FaPen,
  FaTimesCircle,
} from "react-icons/fa";
import { selectCurrentUser } from "../features/users/userSlice";
import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import { useQueryClient, useMutation } from "@tanstack/react-query";
import axios from "../api/axios";

const apiBaseUrl = import.meta.env.VITE_API_URL;

const f = (value) => {
  if (value >= 1000000) return `${(value / 1000000).toFixed(0)}M`;
  if (value >= 1000) return `${(value / 1000).toFixed(0)}K`;
  return `${value}`;
};

const HouseCards = memo(({ data, posts, shortlists }) => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const queryClient = useQueryClient();

  const userInfo = useSelector(selectCurrentUser);

  // ---------------- HANDLE MUTATIONS ----------------

  const handleTaken = async (id) => {
    const res = await fetch(`${apiBaseUrl}/verify?id=${id}`, {
      method: "GET",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${userInfo?.accessToken}`,
      },
    });
    return res.json();
  };

  const handleRemoveShortlist = async (id) => {
    const res = await fetch(`${apiBaseUrl}/shortlists?id=${id}`, {
      method: "DELETE",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${userInfo?.accessToken}`,
      },
    });
    return res.json();
  };

  const { mutate: markAsTaken } = useMutation({
    mutationFn: handleTaken,
    onSuccess: () => {
      queryClient.invalidateQueries(["houses"]);
      queryClient.invalidateQueries(["landlordPosts"]);
      queryClient.invalidateQueries(["shortlist"]);
    },
  });

  const { mutate: removeShortlist } = useMutation({
    mutationFn: handleRemoveShortlist,
    onSuccess: () => {
      queryClient.invalidateQueries(["shortlist"]);
    },
  });

  // ---------------- RENDER ----------------

  return (
    <>
      {data?.pages.map((group, i) => (
        <div
          key={i}
          className="ml-3 mr-3 md:grid md:grid-cols-2 md:gap-3 lg:grid-cols-5"
        >
          {group?.data?.map((item) => (
            <div
              key={item?._id}
              className="bg-gray-800/50 mt-3 p-3 rounded-2xl mb-10"
            >
              <section>
                <CarouselImage
                  item={item}
                  showBookMark={!posts && !shortlists}
                  showThumbnails={true}
                  userShortlists={userInfo?.shortLists}
                />
              </section>

              <section className="mt-4 relative">
                <section className="text-sm text-gray-100 space-y-2">
                  {/* Plot Name */}
                  <section>
                    <h2 className="text-lg font-semibold text-white">
                      {item?.plotName}
                    </h2>
                    <p className="text-[0.7rem] text-gray-400 mt-0 ">
                      {item?.area}
                    </p>
                  </section>

                  {/* Unit Overview */}
                  <div className="grid gap-2 text-[0.85rem]">
                    {Object.entries(item?.units || {})
                      .filter(([_, val]) => val !== null)
                      .map(([unitKey, unitValue]) => {
                        const labelMap = {
                          bedSitter: "Bedsitter",
                          oneBR: "1 Bedroom",
                          twoBR: "2 Bedroom",
                        };
                        return (
                          <div
                            key={unitKey}
                            className="flex items-center justify-between border-b border-white/10 pb-1"
                          >
                            <div className="text-blue-400 font-medium">
                              {labelMap[unitKey] || unitKey}
                            </div>
                            <div className="text-gray-300 text-right">
                              <span>
                                Ksh {f(unitValue?.minRent)} -{" "}
                                {f(unitValue?.maxRent)}
                              </span>
                              <span className="ml-2 text-xs text-gray-400">
                                ({unitValue?.unitsVacant} vacant)
                              </span>
                            </div>
                          </div>
                        );
                      })}
                  </div>
                </section>

                <div
                  className={`h-2 w-2 rounded-full animate-pulse ml-auto absolute top-2 right-0 ${
                    item?.status === "possibly_taken"
                      ? "bg-yellow-400"
                      : item?.status === "taken"
                      ? "bg-red-700"
                      : "bg-green-600"
                  }`}
                ></div>
              </section>

              {/* Landlord Controls */}
              {posts && (
                <div className="flex flex-col items-end gap-2  m-1 mt-2">
                  <div className="flex items-center p-2 gap-2 w-fit justify-end rounded-xl active:bg-gray-800">
                    <Link to={`/verify-vacancy/${item?._id}`}>
                      Update Listing
                    </Link>
                    <FaPen size={12} />
                  </div>
                </div>
              )}

              {/* Shortlist Controls */}
              {shortlists && (
                <div className="flex flex-col items-end gap-2  m-1 mt-2">
                  <div
                    className="flex items-center p-2 gap-2 w-fit rounded-xl active:bg-gray-800"
                    onClick={() => removeShortlist(item?._id)}
                  >
                    <p>Remove</p>
                    <FaTimesCircle size={12}/>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      ))}
    </>
  );
});

export default HouseCards;
