import React, { useEffect, useState } from "react";
import DataList from "./DataList";
import Filter from "./Filter";
import axios from "axios";
import Footer from "./Footer";
import Header from "./Header";
import SideNav from "./SideNav";
import BottomNav from "./BottomNav";
const apiBaseUrl = import.meta.env.VITE_API_URL;

const Listings = () => {
  const [AreaData, setAreaData] = useState(null);
  const [filteredHouseData, setFilteredHouseData] = useState(null);
  const [reloader, setReloader] = useState(false);

  useEffect(() => {
    axios
      .get(`${apiBaseUrl}/areas`)
      .then((res) => setAreaData(res.data))
      .catch((err) => console.log(err));
  }, []);

  useEffect(() => {
    axios
      .get(`${apiBaseUrl}/houses`)
      .then((res) => setFilteredHouseData(res.data))
      .catch((err) => console.log(err));
  }, [reloader]);

  const handleFilter = async (area) => {
    try {
      const res = await axios.get(`${apiBaseUrl}/houses/area/${area}`);
      setFilteredHouseData(res.data);
    } catch (err) {
      console.log("ERROR:    ", err);
    }
  };

  const handleReset = () => {
    setReloader((prevState) => !prevState);
  };

  return (
    <main className="">
    <section className="bg-black">
      <Header />
      <Filter
        data={AreaData}
        onHandleClick={handleFilter}
        handleReset={handleReset}
      />

      <DataList data={filteredHouseData} handleReset={handleReset} />
      <Footer />
    </section>
    <SideNav />
    <BottomNav />
    </main>
  );
};

export default Listings;
