import React, { useEffect } from "react";

import ProfileInfScroll from "../components/ProfileInfScroll";
import { QueryClient } from "@tanstack/react-query";

const RecentlyLiked = () => {

  const queryClient = new QueryClient();
  
  useEffect(() => {
    queryClient.invalidateQueries("shortlist");
  }, []);

  return (
    <>
      <ProfileInfScroll
        backendRoute={"shortlists"}
        queryName={"shortlist"}
        showShortlists={true}
      />
    </>
  );
};

export default RecentlyLiked;
