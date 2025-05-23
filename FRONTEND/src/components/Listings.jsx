import React, { lazy, Suspense } from "react";
import axios from "axios";
import Filter from "./Filter";
import Header from "./Header";
import BottomNav from "./BottomNav";
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { useRef } from "react";
import { useEffect } from "react";
import CarouselImage from "./CarouselImage";
import ListText from "./ListText";
import ViewButton from "./ViewButton";
import { Link, useNavigate } from "react-router-dom";
import InitialLoader from "./InitialLoader";
import ListingsPlaceholder from "./ListingsPlaceholder";
// import { useSelector } from "react-redux";
// import { selectCurrentUser } from "../features/users/userSlice";
const Footer = lazy(() => import("./Footer"));
const apiBaseUrl = import.meta.env.VITE_API_URL;

const fetchHouses = async ({ pageParam = 1 }) => {
  const { data } = await axios.get(`${apiBaseUrl}/houses?page=${pageParam}`);
  return data;
};

const Listings = () => {
  const navigate = useNavigate();
  // const user = useSelector(selectCurrentUser);

  const AreaQueryData = useQuery({
    queryKey: ["areas"],
    queryFn: async () => await axios.get(`${apiBaseUrl}/areas`),
  });

  const AreaData = AreaQueryData?.data?.data;

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useInfiniteQuery({
      queryKey: ["houses"],
      getNextPageParam: (lastPage) => {
        return lastPage.hasMore ? lastPage.nextPage : undefined;
      },
      queryFn: fetchHouses,
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

  // const handleFilter = async (area) => {
  //   try {
  //     const res = await axios.get(`${apiBaseUrl}/houses/area/${area}`);
  //     setFilteredHouseData(res.data);
  //   } catch (err) {
  //     console.log("ERROR:    ", err);
  //   }
  // };

  // const handleDelete = async (id) => {
  //   try {
  //     const res = await axios.delete(`${apiBaseUrl}/houses/${id}`);
  //     console.log(res.data);
  //   } catch (err) {
  //     console.log("error", err);
  //   }
  // };

  console.log(data?.pages);
  console.log(data);

  return (
    <main className="">
      <section className="bg-black">
        <Header />
        <Filter
          data={AreaData}
          // onHandleClick={handleFilter}
        />

        <Suspense fallback={<ListingsPlaceholder />}>
          {/* <DataList data={HouseData} /> */}
          
          {data?.pages.map((group, i) => (
            <div key={i} className="ml-3 mr-3">
              {group.data.map((item) => (
                <div
                  key={item._id}
                  className="bg-gray-800/50 mt-3 p-3 rounded-2xl mb-10"
                >
                  <section className="">
                    <CarouselImage item={item} />
                  </section>

                  <ListText content={item?.area}>Location: </ListText>
                  <ListText content={item?.pricing}>Price: </ListText>
                  <ListText content={item?.landMarks}>Landmarks: </ListText>

                  {/* <section className="flex justify-between m-3"> */}

                  <div className="flex justify-end m-1">
                    <ViewButton onClick={() => navigate(`house/${item._id}`)}>
                      view
                    </ViewButton>
                  </div>

                  {/* make it so a landlord is the only gay who can delete his house, and make it not in the istings, make that in the personal info of a landlord */}
                </div>
              ))}
            </div>
          ))}
          <div
            ref={loadMoreRef}
            className="bg-black text-white font-semibold mb-39"
          >
            {isFetchingNextPage && <ListingsPlaceholder />}
          </div>
        </Suspense>

        <Footer />
      </section>
      <BottomNav />
    </main>
  );
};

export default Listings;
