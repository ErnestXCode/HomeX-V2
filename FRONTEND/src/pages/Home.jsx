import React, { useEffect, useState } from "react";
import DataList from "../components/DataList";
import Filter from "../components/Filter";
import axios from "axios";
import Footer from "../components/Footer";

const Home = () => {
  const [AreaData, setAreaData] = useState(null);
  const [filteredHouseData, setFilteredHouseData] = useState(null);
  const [reloader, setReloader] = useState(false);

  useEffect(() => {
    axios
      .get(" http://localhost:5000/areas")
      .then((res) => setAreaData(res.data))
      .catch((err) => console.log(err));
  }, []);

  useEffect(() => {
    axios
      .get(" http://localhost:5000/houses")
      .then((res) => setFilteredHouseData(res.data))
      .catch((err) => console.log(err));
  }, [reloader]);

  const handleFilter = async (area) => {
    try {
      const res = await axios.get(`http://localhost:5000/houses/area/${area}`);
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
      <Filter
        data={AreaData}
        onHandleClick={handleFilter}
        handleReset={handleReset}
      />

      <DataList data={filteredHouseData} handleReset={handleReset} />
      <Footer />
    </main>
  );
};

export default Home;
