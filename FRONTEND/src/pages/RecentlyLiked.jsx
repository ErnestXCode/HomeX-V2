import React, { useEffect } from "react";

import ProfileInfScroll from "../components/ProfileInfScroll";
import { QueryClient } from "@tanstack/react-query";

const RecentlyLiked = () => {


  
 

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
