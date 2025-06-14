import React, { lazy, Suspense, useState } from "react";
import Filter from "../components/Filter";
import Header from "../components/Header";
import BottomNav from "../components/BottomNav";
import { QueryClient, useInfiniteQuery } from "@tanstack/react-query";
import { useRef } from "react";
import { useEffect } from "react";
import CarouselImage from "../components/CarouselImage";
import ListText from "../components/ListText";
import ViewButton from "../components/ViewButton";
import { Link, useNavigate } from "react-router-dom";
import InitialLoader from "../components/InitialLoader";
import ListingsPlaceholder from "../components/ListingsPlaceholder";
import FilterButton from "../components//FilterButton";
import axios from "../api/axios";
import { useSelector } from "react-redux";
import { selectCurrentUser } from "../features/users/userSlice";

import HouseCards from "../components/HouseCards";
import { FaDumpster } from "react-icons/fa";

const Footer = lazy(() => import("../components/Footer"));
const apiBaseUrl = import.meta.env.VITE_API_URL;

const RecentlyLiked = () => {
  console.time("liked");
  const navigate = useNavigate();
  const userInfo = useSelector(selectCurrentUser);

  const loadMoreRef = useRef();

  const { data, fetchNextPage, isFetchingNextPage, hasNextPage } =
    useInfiniteQuery({
      queryKey: ["shortlist"],
      queryFn: async ({ pageParam = 1 }) => {
        try {
          const res = await fetch(
            `${apiBaseUrl}/shortlists?page=${pageParam}`,
            {
              method: "GET",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${userInfo.accessToken}`,
              },
              credentials: "include",
            }
          );
          const blah = await res.json();
          return blah;
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
      // strictly uses functions not constants
    });

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && hasNextPage) fetchNextPage();
    });

    if (loadMoreRef.current) {
      observer.observe(loadMoreRef.current);
    }

    return () => {
      if (loadMoreRef.current) observer.unobserve(loadMoreRef.current);
    };
  }, [loadMoreRef?.current]);

  console.timeEnd("liked");

  return (
    <>
      <HouseCards data={data} shortlist={true} />
      <div
        ref={loadMoreRef}
        className="bg-black text-white font-semibold mb-39"
      >
        {isFetchingNextPage && <InitialLoader notFullPage={true} />}
      </div>
    </>
  );
};

export default RecentlyLiked;
