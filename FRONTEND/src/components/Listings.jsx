import React, { lazy, useState } from "react";
import Header from "./Header";
import BottomNav from "./BottomNav";
import { QueryClient, useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { useRef } from "react";
import { useEffect } from "react";
import CarouselImage from "./CarouselImage";
import ListText from "./ListText";
import { useNavigate } from "react-router-dom";
import InitialLoader from "./InitialLoader";
import FilterButton from "./FilterButton";
import axios from "../api/axios";
import { FaStreetView } from "react-icons/fa";
// import { useSelector } from "react-redux";
// import { selectCurrentUser } from "../features/users/userSlice";
const Footer = lazy(() => import("./Footer"));

// const fetchHouses = async ({ pageParam = 1 }) => {
//   const { data } = await axios.get(`/houses?page=${pageParam}`);
//   return data;
// };

const Listings = () => {
  const navigate = useNavigate();
  // const user = useSelector(selectCurrentUser);
  const [listState, setListState] = useState("All");

  useEffect(() => {
    console.log("stuff");
  }, [listState]);

  const queryClient = new QueryClient();

  const handleFilter = async (area) => {
    try {
      setListState(area);
      queryClient.invalidateQueries("houses");
      console.log("fucker clicked");
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

  // const HouseData = HouseQueryData?.data?.data;

  // const handleDelete = async (id) => {
  //   try {
  //     const res = await axios.delete(`${apiBaseUrl}/houses/${id}`);
  //     (res.data);
  //   } catch (err) {
  //     ("error", err);
  //   }
  // };

  const handleReset = () => {
    setListState("All");
  };

  const f = new Intl.NumberFormat(undefined, {
    style: 'currency',
    currency: "KSH",
  });

  const f_2 = new Intl.DateTimeFormat(undefined, {
    dateStyle: 'medium', 
    timeStyle: 'short',
   
  })

  return (
    <main className="">
      <section className="bg-black">
        <Header />
        {/* <Filter data={AreaData} onHandleClick={handleFilter} /> */}
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

        {/* <DataList data={HouseData} /> */}

        {data?.pages.map((group, i) => (
          <div key={i} className="ml-3 mr-3">
            {group?.data?.map((item) => (
              <div
                key={item._id}
                className="bg-gray-800/50 mt-3 p-3 rounded-2xl mb-10"
          // onClick={() => navigate(`house/${item._id}`)} 
          

              >
                <section className="">
                  <CarouselImage item={item} />
                </section>
                <section className="flex justify-between mt-4">
                  <section>
                    <ListText content={item?.area}></ListText>
                    <ListText content={f.format(item?.pricing)}>
                     
                    </ListText>
                    <ListText content={item?.numOfHouses}>
                      <span className="font-semibold text-gray-400">
                        Rooms available:{" "}
                      </span>{" "}
                    </ListText>
                  </section>
              <p className={`flex items-center h-fit pt-1.5 pb-1.5 pr-4 pl-4 text-center rounded-2xl  ${item?.status === 'possibly_taken' ? 'bg-yellow-400/50' : item?.status === 'taken' ? 'bg-red-700/50' : 'bg-green-600/50'}`}>
                    {item?.status}
              </p>
                  {/* <section className="flex justify-between m-3"> */}
                 
                </section>

                {/* make it so a landlord is the only gay who can delete his house, and make it not in the istings, make that in the personal info of a landlord */}
              </div>
            ))}
          </div>
        ))}
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
