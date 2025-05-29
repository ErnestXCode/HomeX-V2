import React, { lazy, Suspense, useState } from "react";
import Filter from "./Filter";
import Header from "./Header";
import BottomNav from "./BottomNav";
import {
  QueryClient,
  useInfiniteQuery,
  useQuery,
} from "@tanstack/react-query";
import { useRef } from "react";
import { useEffect } from "react";
import CarouselImage from "./CarouselImage";
import ListText from "./ListText";
import ViewButton from "./ViewButton";
import { Link, useNavigate } from "react-router-dom";
import InitialLoader from "./InitialLoader";
import ListingsPlaceholder from "./ListingsPlaceholder";
import FilterButton from "./FilterButton";
import axios from "../api/axios";
import { FaBookmark, FaStreetView } from "react-icons/fa";
import { useSelector } from "react-redux";
import { selectCurrentUser } from "../features/users/userSlice";
// import { useSelector } from "react-redux";
// import { selectCurrentUser } from "../features/users/userSlice";
const Footer = lazy(() => import("./Footer"));
const apiBaseUrl = import.meta.env.VITE_API_URL;

// const fetchHouses = async ({ pageParam = 1 }) => {
//   const { data } = await axios.get(`/houses?page=${pageParam}`);
//   return data;
// };

const Listings = () => {
  const navigate = useNavigate();
  // const user = useSelector(selectCurrentUser);
  const [listState, setListState] = useState('All');

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
      { threshold: 0, rootMargin: "500px" }
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

  const userInfo = useSelector(selectCurrentUser);
  const [blueIcon, setBlueIcon] = useState(false)

  const handleShortLists = async (house) => {
    setBlueIcon(prevState => !prevState)
    const response = await fetch(`${apiBaseUrl}/profile`, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${userInfo?.accessToken}`,
      },
      body: JSON.stringify({houseId : house._id}),
    });
    const json = response.json();
    const data = json.data;
    console.log(data);
  };

  const handleReset = () => {
    setListState('All')
  }

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

        <Suspense fallback={<ListingsPlaceholder />}>
          {/* <DataList data={HouseData} /> */}

          {data?.pages.map((group, i) => (
            <div key={i} className="ml-3 mr-3">
              {group?.data?.map((item) => (
                <div
                  key={item._id}
                  className="bg-gray-800/50 mt-3 p-3 rounded-2xl mb-10"
                >
                  <section className="">
                    <CarouselImage item={item} />
                  </section>
                <section className="flex justify-between mt-4">
                  <section>

                  <ListText content={item?.area}>Location: </ListText>
                  <ListText content={item?.pricing}>Price: </ListText>
                  <ListText content={item?.landMarks}>Landmarks: </ListText>
                  </section>

                  {/* <section className="flex justify-between m-3"> */}
                  <section className="flex flex-col items-end gap-2  m-1 mt-2">
                    <button
                      onClick={() => handleShortLists(item)}
                    
                      className={`flex items-center p-2 gap-2 w-25 justify-end rounded-xl active:bg-gray-800 ${blueIcon ? 'text-blue-600' : 'text-white'}`}
                    >
                      <FaBookmark />
                      <p className="text-white">Shortlist</p>
                    </button>
                    <button
                      onClick={() => navigate(`house/${item._id}`)}
                      className="flex items-center  p-2 gap-2 w-25 justify-end rounded-xl active:bg-gray-800"
                    >
                      <FaStreetView />
                      <p>View</p>
                    </button>
                  </section>
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
        </Suspense>

        <Footer />
      </section>
      <BottomNav />
    </main>
  );
};

export default Listings;
