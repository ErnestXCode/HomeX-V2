import React, { memo } from "react";
import CarouselImage from "./CarouselImage";
import ListText from "./ListText";
import { useNavigate, Link } from "react-router-dom";
import {
  FaBookDead,
  FaBookOpen,
  FaCheckCircle,
  FaDumpster,
  FaEdit,
  FaTicketAlt,
  FaTimesCircle,
} from "react-icons/fa";
import { selectCurrentUser } from "../features/users/userSlice";
import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import { QueryClient, useMutation } from "@tanstack/react-query";
import axios from "../api/axios";

const apiBaseUrl = import.meta.env.VITE_API_URL;

const HouseCards = memo(({ data, posts, shortlists }) => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const userInfo = useSelector(selectCurrentUser);
  console.log(userInfo);

  const f = new Intl.NumberFormat(undefined, {
    style: "currency",
    currency: "KSH",
  });

  const handleTaken = async (id) => {
    try {
      // usemutation somehow
      const res = await fetch(`${apiBaseUrl}/verify?id=${id}`, {
        method: "GET",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${userInfo?.accessToken}`,
        },
      });

      const data = await res.json();
      console.log(data);
    } catch (err) {
      console.log("error", err);
    }
  };

  const handleRemoveShortlist = async (id) => {
    try {
      // usemutation somehow
      const res = await fetch(`${apiBaseUrl}/shortlists?id=${id}`, {
        method: "DELETE",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${userInfo?.accessToken}`,
        },
      });

      const data = await res.json();
      console.log("data ", data);
    } catch (err) {
      console.log("error", err);
    }
  };

  const queryClient = new QueryClient();

  useMutation({
    mutationFn: handleRemoveShortlist,
    onSuccess: () => {
      queryClient.invalidateQueries("shortlist");
    },
  });

  useMutation({
    mutationFn: handleTaken,
    onSuccess: () => {
      queryClient.invalidateQueries("houses");

      // not updating for some reason
      queryClient.invalidateQueries("landlordPosts");
      queryClient.invalidateQueries("shortlist");
    },
  });

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
              // onClick={
              //   !posts && !shortlists
              //     ? () => navigate(`house/${item._id}`)
              //     : null
              // }
            >
              <section className="">
                <CarouselImage
                  item={item}
                  showBookMark={!posts && !shortlists ? true : false}
                  showThumbnails={true}
                />
              </section>
              <section className="flex justify-between mt-4">
                <section>
                  <p className="pl-1  text-[0.95rem] text-gray-200">
                    {item?.area}
                  </p>
                  <p className="pl-1 font-semibold pt-1.5">
                    {f.format(item?.pricing)}
                  </p>
                  <ListText content={item?.numOfHouses}>
                    <span className="font-semibold text-gray-400">
                      {/* {t("roomsAvailable")}{" "} */}
                      {t("RoomsAvailable")}:
                    </span>{" "}
                  </ListText>
                </section>

                <div
                  className={`h-2 w-2 rounded-full animate-pulse mr-3 mt-2 ${
                    item?.status === "possibly_taken"
                      ? "bg-yellow-400"
                      : item?.status === "taken"
                      ? "bg-red-700"
                      : "bg-green-600"
                  }`}
                ></div>
                {/* <section className="flex justify-between m-3"> */}
              </section>
              {posts && (
                <div className="flex flex-col items-end gap-2  m-1 mt-2">
                  <div
                    // onClick set status to vacant
                    className="flex items-center  p-2 gap-2 w-fit justify-end rounded-xl active:bg-gray-800"
                  >
                    <Link to={`/verify-vacancy/${item?._id}`}>
                      Confirm Vacancy
                    </Link>
                    <FaCheckCircle />
                  </div>

                  <div className="flex items-center  p-2 gap-2 w-fit justify-end rounded-xl active:bg-gray-800">
                    <div onClick={() => handleTaken(item?._id)}>
                      {t("MarkAsTaken")}
                    </div>
                    <FaTimesCircle />
                  </div>
                  <div
                    // onClick set status to vacant
                    className="flex items-center  p-2 gap-2 w-fit justify-end rounded-xl active:bg-gray-800"
                  >
                    <Link to={`/edit-house/${item?._id}`}>
                      {t("EditDetails")}
                    </Link>
                    <FaEdit />
                  </div>
                </div>
              )}
              {shortlists && (
                <div
                  className="flex items-center gap-3 p-2 justify-end"
                  onClick={() => handleRemoveShortlist(item?._id)}
                >
                  <p>Remove</p>
                  <FaDumpster />
                </div>
              )}

              {/* make it so a landlord is the only gay who can delete his house, and make it not in the istings, make that in the personal info of a landlord */}
            </div>
          ))}
        </div>
      ))}
    </>
  );
});

export default HouseCards;
