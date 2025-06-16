import React from "react";

import { QueryClient, useInfiniteQuery } from "@tanstack/react-query";
import { useRef } from "react";
import { useEffect } from "react";

import { useSelector } from "react-redux";
import { selectCurrentUser } from "../features/users/userSlice";
import HouseCards from "./HouseCards";
import InitialLoader from "./InitialLoader";

// import { useSelector } from "react-redux";
// import { selectCurrentUser } from "../features/users/userSlice";

const apiBaseUrl = import.meta.env.VITE_API_URL;

// const fetchHouses = async ({ pageParam = 1 }) => {
//   const { data } = await axios.get(`/houses?page=${pageParam}`);
//   return data;
// };

const ProfileInfScroll = ({
  backendRoute,
  queryName,
  showPosts,
  showShortlists,
}) => {
  const userInfo = useSelector(selectCurrentUser);

  const loadMoreRef = useRef();

  const { data, isFetchingNextPage, hasNextPage, fetchNextPage } =
    useInfiniteQuery({
      queryKey: [queryName],
      queryFn: async ({ pageParam = 1 }) => {
        try {
          const res = await fetch(
            `${apiBaseUrl}/${backendRoute}?page=${pageParam}`,
            {
              method: "GET",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${userInfo?.accessToken}`,
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

  const loader = loadMoreRef?.current;
  const queryClient = new QueryClient()

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasNextPage) {
          fetchNextPage();
          queryClient.invalidateQueries(queryName)
        }
      },
      { threshold: 0, rootMargin: "1000px" }
    );
    if (loader) {
      observer.observe(loader);
    }
    return () => {
      if (loader) observer.unobserve(loader);
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
      <HouseCards data={data} posts={showPosts} shortlists={showShortlists} />
      <div
        ref={loadMoreRef}
        className="bg-black text-white font-semibold mb-39"
      >
        {hasNextPage && isFetchingNextPage && (
          <InitialLoader notFullPage={true} />
        )}
      </div>
    </>
  );
};

export default ProfileInfScroll;
