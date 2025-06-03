import React, { lazy, Suspense, useState } from "react";
import Filter from "../components/Filter";
import Header from "../components/Header";
import BottomNav from "../components/BottomNav";
import { QueryClient, useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { useRef } from "react";
import { useEffect } from "react";
import CarouselImage from "../components/CarouselImage";
import ListText from "../components/ListText";
import ViewButton from "../components/ViewButton";
import { Link, useNavigate } from "react-router-dom";
import InitialLoader from "../components/InitialLoader";
import ListingsPlaceholder from "../components/ListingsPlaceholder";
import FilterButton from "../components/FilterButton";
import axios from "../api/axios";
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

const LandLordPOsts = () => {
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

  const [data, setData] = useState(null);

  useEffect(() => {
console.log('userInfo shortlists')
console.log(userInfo)
    const fetchShortLists = async() => {
   try {
       const res = await fetch(`${apiBaseUrl}/landlordHouses`, {
        method: 'GET',
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${userInfo.accessToken}`,
        },
        credentials: "include",
      })
      setData((await res.json()).reverse())
   } catch (err) {
    console.log(err)
   }
    }
    fetchShortLists()
  }, []);

  console.log(data);

  // useEffect(() => {
  //   const observer = new IntersectionObserver(
  //     (entries) => {
  //       if (entries[0].isIntersecting && hasNextPage) {
  //         fetchNextPage();
  //       }
  //     },
  //     { threshold: 0, rootMargin: "500px" }
  //     // check how to make it better
  //   );
  //   if (loadMoreRef.current) {
  //     observer.observe(loadMoreRef.current);
  //   }
  //   return () => {
  //     if (loadMoreRef.current) observer.unobserve(loadMoreRef.current);
  //   };
  // });

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
    <main className="">
      <section className="bg-black">
        <SecondaryHeader>Posts</SecondaryHeader>

        <Suspense fallback={<ListingsPlaceholder />}>
          {/* <DataList data={HouseData} /> */}

          <div className="ml-3 mr-3">
            {data?.map((item) => (
              <div
                key={item?._id}
                className="bg-gray-800/50 mt-3 p-3 rounded-2xl mb-10"
              >
                <section className="">
                  <CarouselImage item={item} />
                </section>

                <ListText content={item?.area}>Location: </ListText>
                <ListText content={item?.pricing}>Price: </ListText>
                <ListText content={item?.landMarks}>Landmarks: </ListText>

                {/* <section className="flex justify-between m-3"> */}
                <div className="flex flex-col items-end gap-2  m-1 mt-2">
                  <button
                    onClick={() => navigate(`../house/${item._id}`)}
                    className="flex items-center  p-2 gap-2 w-fit justify-end rounded-xl active:bg-gray-800"
                  >
                    <FaStreetView />
                    <p>View</p>
                  </button>
                  <button 
                  // onClick set status to vacant
                  className="flex items-center  p-2 gap-2 w-fit justify-end rounded-xl active:bg-gray-800">
                    <FaTicketAlt />
                    <p>Verify vacancy</p>
                  </button>
                  <button 
                  // onClick set status to taken
                  className="flex items-center  p-2 gap-2 w-fit justify-end rounded-xl active:bg-gray-800">
                    <FaBookDead />
                    <p>Mark as taken</p>
                  </button>
                </div>

                {/* make it so a landlord is the only gay who can delete his house, and make it not in the istings, make that in the personal info of a landlord */}
              </div>
            ))}
          </div>

          <div
            ref={loadMoreRef}
            className="bg-black text-white font-semibold mb-39"
          >
            {/* {isFetchingNextPage && <InitialLoader notFullPage={true} />} */}
          </div>
        </Suspense>

        <Footer />
      </section>
      <BottomNav />
    </main>
  );
};

export default LandLordPOsts;
