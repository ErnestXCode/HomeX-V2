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
      queryFn: async ({ pageParam = 1 }) => {
        const { data } = listState
          ? await axios.get(`/houses?page=${pageParam}&area=${listState}`)
          : await axios.get(`/houses?page=${pageParam}`);

        // list state is not updating in this place
        return data;
      },
    });

  const loadMoreRef = useRef();

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
    if (loadMoreRef.current) {
      observer.observe(loadMoreRef.current);
    }
    return () => {
      if (loadMoreRef.current) observer.unobserve(loadMoreRef.current);
    };
  });

  const handleReset = () => {
    setListState("All");
  };

  return (
    <main className="">
      <section className="bg-black">
        <Header />
        <section className=" overflow-x-auto no-scrollbar flex gap-3 m-3 mb-0 mt-0 p-2 sticky top-18 z-1">
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

        <HouseCards data={data} />
        <div
          ref={loadMoreRef}
          className="bg-black text-white font-semibold mb-39"
        >
          {isFetchingNextPage && <InitialLoader notFullPage={true} />}
        </div>

        <Footer />
      </section>
      <BottomNav />
    </main>
  );
};

export default Listings;
