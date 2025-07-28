import React, { lazy, useState } from "react";
import Header from "./Header";
import BottomNav from "./BottomNav";
import { QueryClient, useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { useRef } from "react";
import { useEffect } from "react";
import InitialLoader from "./InitialLoader";
import FilterButton from "./FilterButton";
import axios from "../api/axios";
import HouseCards from "./HouseCards";
import { FaExchangeAlt, FaFilter, FaSlidersH, FaSort } from "react-icons/fa";
import { MdCompareArrows } from "react-icons/md";

const Footer = lazy(() => import("./Footer"));

const Listings = () => {
  const queryClient = new QueryClient();

  const [listState, setListState] = useState("All");

  useEffect(() => {
    console.log("stuff");
  }, [listState]);

  const handleFilter = async (area) => {
    try {
      setListState(area);
    } catch (err) {
      console.log(err);
    }
  };

  const AreaQueryData = useQuery({
    queryKey: ["areas"],
    queryFn: async () => await axios.get(`/areas`),
  });

  const AreaData = AreaQueryData?.data?.data;

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useInfiniteQuery({
      queryKey: ["houses", listState],
      getNextPageParam: (lastPage) => {
        return lastPage.hasMore ? lastPage.nextPage : undefined;
      },
      keepPreviousData: true, //new prop added
      queryFn: async ({ pageParam = 1 }) => {
        const { data } = listState
          ? await axios.get(`/houses?page=${pageParam}&area=${listState}`)
          : await axios.get(`/houses?page=${pageParam}`);

        // list state is not updating in this place
        return data;
      },
    });

  const loadMoreRef = useRef();

  const loader = loadMoreRef.current;

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasNextPage) {
          fetchNextPage();
          queryClient.invalidateQueries("houses");
        }
      },
      { threshold: 0, rootMargin: "2000px" }
      // check how to make it better
    );
    if (loader) {
      observer.observe(loader);
    }
    return () => {
      if (loader) observer.unobserve(loader);
    };
  });

  const handleReset = () => {
    setListState("All");
  };

  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    const goOnline = () => setIsOnline(true);
    const goOffline = () => setIsOnline(false);

    window.addEventListener("online", goOnline);
    window.addEventListener("offline", goOffline);

    return () => {
      window.removeEventListener("online", goOnline);
      window.removeEventListener("offline", goOffline);
    };
  }, []);

  if (!isOnline) {
    return (
      <div className="h-screen w-full flex flex-col">
        <Header />
        <div className="flex flex-col flex-1 justify-center items-center">
          <h1 className="text-2xl mb-4">You're offline</h1>
          <p className="mb-4">Check your internet connection.</p>
          <button
            className="bg-blue-600 px-4 py-2 rounded-lg"
            onClick={() => window.location.reload()}
          >
            Retry
          </button>
        </div>
        {/* <BottomNav /> */}
      </div>
    );
  }
  return (
    <main className="">
      <section className="bg-black">
        <Header />
<section className="flex sticky top-18 z-1">

        <section className=" overflow-x-auto no-scrollbar flex gap-3 m-3 mb-0 mt-0 p-2 w-80">
          <FilterButton onClick={() => handleReset()}>All</FilterButton>
          {AreaData?.map((area) => {
            return (
              <FilterButton
                onClick={() => handleFilter(area?.area)}
                key={area?._id}
              >
                {area?.area}
              </FilterButton>
            );
          })}
        </section>
        <button>
          <FaExchangeAlt />
        </button>
</section>

        <HouseCards data={data} />
        <div
          ref={loadMoreRef}
          className="bg-black text-white font-semibold mb-39"
        >
          {hasNextPage && isFetchingNextPage && (
            <InitialLoader notFullPage={true} />
          )}
        </div>
      </section>
      {/* <BottomNav /> */}
    </main>
  );
};

export default Listings;
