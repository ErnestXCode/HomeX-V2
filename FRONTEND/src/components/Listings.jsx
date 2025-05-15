import React, { lazy, Suspense } from "react";
import axios from "axios";
import Filter from "./Filter";
import Header from "./Header";
import BottomNav from "./BottomNav";
import { useQuery } from "@tanstack/react-query";const DataList = lazy(() => import("./DataList"));
const SideNav = lazy(() => import("./SideNav"));
const Footer = lazy(() => import("./Footer"));
const apiBaseUrl = import.meta.env.VITE_API_URL;

const Listings = () => {

 const AreaQueryData = useQuery({
  queryKey: ['areas'], 
  queryFn: async() => await axios.get(`${apiBaseUrl}/areas`)
 })

 const AreaData = AreaQueryData?.data?.data

const HouseQueryData = useQuery({ 
  queryKey:['houses'], 
  queryFn: async() => await axios.get(`${apiBaseUrl}/houses`)
})

const HouseData = HouseQueryData?.data?.data

  // const handleFilter = async (area) => {
  //   try {
  //     const res = await axios.get(`${apiBaseUrl}/houses/area/${area}`);
  //     setFilteredHouseData(res.data);
  //   } catch (err) {
  //     console.log("ERROR:    ", err);
  //   }
  // };

  return (
    <main className="">
      <section className="bg-black">
        <Header />
        <Filter
          data={AreaData}
          // onHandleClick={handleFilter}
        />
        
        <Suspense fallback={"loading..."}>
          <DataList data={HouseData}/>
        </Suspense>

        <Footer />
      </section>
      <BottomNav />
    </main>
  );
};

export default Listings;
