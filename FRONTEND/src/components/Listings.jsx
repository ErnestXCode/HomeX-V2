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
const Footer = lazy(() => import("./Footer"));
const apiBaseUrl = import.meta.env.VITE_API_URL;

const fetchHouses = async ({ pageParam = 1 }) => {
  const { data } = await axios.get(`${apiBaseUrl}/houses?page=${pageParam}`);
  return data;
};

const Listings = () => {

  const navigate = useNavigate()

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
      { threshold: 0, rootMargin: '500px'  } 
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

  const handleDelete = async (id) => {
    try {
      const res = await axios.delete(`${apiBaseUrl}/houses/${id}`);
      console.log(res.data);
    } catch (err) {
      console.log("error", err);
    }
  };
 

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

        <Suspense fallback={"loading..."}>
          {/* <DataList data={HouseData} /> */}
          {data?.pages.map((group, i) => (
            <div key={i} className="ml-3 mr-3">
              {group.data.map((item) => (
                <div
                  key={item._id}
                  className="bg-gray-800/50 mt-3 p-3 rounded-2xl mb-10 md:w-[500px] md:h-auto"
                >
                  <section className="">
                    <CarouselImage
                      item={item}
                    />
              
                  </section>

                  <ListText content={item?.landMarks}>Landmarks: </ListText>
                  <ListText content={item?.pricing}>Price: </ListText>
                  <ListText content={item?.area}>Area: </ListText>
                  <ListText content={item?.landMarks}>Landmarks: </ListText>

                  <section className="flex justify-between m-3">
                    <Link to={`/house/${item?._id}`}>view</Link>
                    {/* create a modal for here */}
                    <ViewButton onClick={() => handleDelete(item?._id)}>
                      delete
                    </ViewButton>
                  </section>
                </div>
              ))}
            </div>
          ))}
          <div ref={loadMoreRef} className="h-20 text-red-600 font-bold mb-39">
            {isFetchingNextPage && <p>Loading...</p>}
          </div>
        </Suspense>

        <Footer />
      </section>
      <BottomNav />
    </main>
  );
};

export default Listings;
