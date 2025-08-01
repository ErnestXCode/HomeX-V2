import React, { useEffect } from "react";

import ProfileInfScroll from "../components/ProfileInfScroll";
import { QueryClient } from "@tanstack/react-query";

const PurchasedListings = () => {


  
 

  return (
    <>
      <ProfileInfScroll
        backendRoute={"purchases"}
        queryName={"purchases"}
      />
    </>
  );
};

export default PurchasedListings;



