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
import HouseCards from "../components/HouseCards";
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
      getNextPageParam: (lastPage) => {
        return lastPage.hasMore ? lastPage.nextPage : undefined;
      },
      staleTime: 1000 * 60 * 5,
      cacheTime: 1000 * 60 * 10,
      keepPreviousData: true,
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

  return (
    <>
      <HouseCards
        data={data}
        posts={true}
      />
      <div
        ref={loadMoreRef}
        className="bg-black text-white font-semibold mb-39"
      >
        {isFetchingNextPage && <InitialLoader notFullPage={true} />}
      </div>
    </>
  );
};

export default Posts;
