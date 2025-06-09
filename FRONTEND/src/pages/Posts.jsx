import React, { lazy, Suspense, useState } from "react";
import Filter from "../components/Filter";
import Header from "../components/Header";
import BottomNav from "../components/BottomNav";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useRef } from "react";
import { useEffect } from "react";
import CarouselImage from "../components/CarouselImage";
import ListText from "../components/ListText";
import ViewButton from "../components/ViewButton";
import { Link, useNavigate } from "react-router-dom";
import InitialLoader from "../components/InitialLoader";
import ListingsPlaceholder from "../components/ListingsPlaceholder";
import FilterButton from "../components/FilterButton";
import {
  FaBookDead,
  FaBookmark,
  FaDumpster,
  FaRemoveFormat,
  FaStreetView,
  FaTicketAlt,
} from "react-icons/fa";
import { useSelector } from "react-redux";
import { selectCurrentUser } from "../features/users/userSlice";
import SecondaryHeader from "../components/SecondaryHeader";
// import { useSelector } from "react-redux";
// import { selectCurrentUser } from "../features/users/userSlice";
const Footer = lazy(() => import("../components/Footer"));
const apiBaseUrl = import.meta.env.VITE_API_URL;

// const fetchHouses = async ({ pageParam = 1 }) => {
//   const { data } = await axios.get(`/houses?page=${pageParam}`);
//   return data;
// };

const Posts = () => {
  const navigate = useNavigate();
  const userInfo = useSelector(selectCurrentUser);

  // const { data, fetchNextPage, hasNextPage, isFetchingNextPage } =
  //   useInfiniteQuery({
  //     queryKey: ["houses"],
  //     getNextPageParam: (lastPage) => {
  //       return lastPage.hasMore ? lastPage.nextPage : undefined;
  //     },
  //     queryFn: async ({ pageParam = 1 }) => {
  //       const { data } = await axios.post(`/shortlists?page=${pageParam}`, userInfo?.shortLists);
  //       console.log('fetched data', data)
  //       return data;
  //     },
  //   });

  const loadMoreRef = useRef();

  const { data, isFetchingNextPage, hasNextPage, fetchNextPage } =
    useInfiniteQuery({
      queryKey: ["landlordPosts"],
      getNextPageParam: (lastPage) => {
        return lastPage.hasMore ? lastPage.nextPage : undefined;
      },
      queryFn: async ({ pageParam = 1 }) => {
        try {
          const res = await fetch(
            `${apiBaseUrl}/landlordHouses?page=${pageParam}`,
            {
              method: "GET",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${userInfo.accessToken}`,
              },
              credentials: "include",
            }
          );
          const data = await res.json();
          return data;
        } catch (err) {
          console.log(err);
        }
      },
    });

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasNextPage) {
          fetchNextPage();
        }
      },
      { threshold: 0, rootMargin: "2000px" }
    );
    if (loadMoreRef.current) {
      observer.observe(loadMoreRef.current);
    }
    return () => {
      if (loadMoreRef.current) observer.unobserve(loadMoreRef.current);
    };
  });

  // const HouseData = HouseQueryData?.data?.data;

  // const handleDelete = async (id) => {
  //   try {
  //     const res = await axios.delete(`${apiBaseUrl}/houses/${id}`);
  //     (res.data);
  //   } catch (err) {
  //     ("error", err);
  //   }
  // };

  const handleTaken = async (id) => {
    // make an api call
    try {
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
      navigate(-1);
    } catch (err) {
      console.log("error", err);
    }
  };

  return (
    <main className="">
      <section className="bg-black">
        <Suspense fallback={<ListingsPlaceholder />}>
          {/* <DataList data={HouseData} /> */}

          <div className="ml-3 mr-3">
            {data?.pages.map((group, i) => {
              return (
                <div key={i}>
                  {group?.data.map((item) => {
                    return (
                      <div
                        key={item?._id}
                        className="bg-gray-800/50 mt-3 p-3 rounded-2xl mb-10"
                      >
                        <section className="">
                          <CarouselImage item={item} />
                        </section>

                        <ListText content={item?.area}>Location: </ListText>
                        <ListText content={item?.pricing}>Price: </ListText>
                        <ListText content={item?.landMarks}>
                          Landmarks:{" "}
                        </ListText>

                        {/* <section className="flex justify-between m-3"> */}
                        <div className="flex flex-col items-end gap-2  m-1 mt-2">
                          <div
                            onClick={() => navigate(`../house/${item._id}`)}
                            className="flex items-center  p-2 gap-2 w-fit justify-end rounded-xl active:bg-gray-800"
                          >
                            <FaStreetView />
                            <p>View</p>
                          </div>
                          <div
                            // onClick set status to vacant
                            className="flex items-center  p-2 gap-2 w-fit justify-end rounded-xl active:bg-gray-800"
                          >
                            <FaTicketAlt />
                            <Link to={`/verify-vacancy/${item?._id}`}>
                              Verify vacancy
                            </Link>
                          </div>
                          <div
                            // onClick set status to taken
                            className="flex items-center  p-2 gap-2 w-fit justify-end rounded-xl active:bg-gray-800"
                          >
                            <FaBookDead />
                            <div onClick={() => handleTaken(item._id)}>
                              Mark as taken
                            </div>
                          </div>
                        </div>

                        {/* make it so a landlord is the only guy who can delete his house, and make it not in the istings, make that in the personal info of a landlord */}
                      </div>
                    );
                  })}
                </div>
              );
            })}
          </div>

          <div
            ref={loadMoreRef}
            className="bg-black text-white font-semibold mb-39"
          >
            {isFetchingNextPage && <InitialLoader notFullPage={true} />}
          </div>
        </Suspense>

        <Footer />
      </section>
      <BottomNav />
    </main>
  );
};

export default Posts;
