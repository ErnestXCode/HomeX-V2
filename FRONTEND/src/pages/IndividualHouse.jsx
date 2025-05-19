import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectCurrentUser } from "../features/users/userSlice";
import CarouselImage from "../components/CarouselImage";
import ListText from "../components/ListText";
const apiBaseUrl = import.meta.env.VITE_API_URL;

const IndividualHouse = () => {
  const [data, setData] = useState(null);
  const { id } = useParams();
  console.log(id)
  const user = useSelector(selectCurrentUser);

  useEffect(() => {
    const getData = async () => {
      const res = await axios.get(`${apiBaseUrl}/houses/${id}`);
      setData(res.data);
    };
    getData();
  }, [id]);

  
 
  return (
    <div
      className="bg-black mt-3 p-3 rounded-2xl min-h-30 mb-10
        md:w-[500px] md:h-auto mr-auto ml-auto"
    >

        <section className="">
          <CarouselImage item={data?.images && data} apiBaseUrl={apiBaseUrl} index={0} />
        </section>

        <ListText content={data?.landMarks}>Landmarks: </ListText>
        <ListText content={data?.pricing}>Price: </ListText>
        <ListText content={data?.area}>Area: </ListText>
        <ListText content={data?.landMarks}>Landmarks: </ListText>
        <ListText content={data?.landLord?.name}>Landlord: </ListText>
        <ListText content={data?.landLord?.email}>Email: </ListText>

      <section className="w-screen mt-4 mb-4">
        <button className="bg-blue-700 p-2 rounded-2xl pr-3 pl-3">
          <Link to={"/"}>GO BACK</Link>
        </button>
        <button className="bg-blue-700 text-black font-bold p-2 pr-4 pl-4 ml-[200px] rounded-2xl text-2xl active:bg-blue-500 active:border-2">
          {user ? (
            <a href={`tel:${data?.landLord?.phoneNumber}`}>Call</a>
          ) : (
            <Link to={"/login"}>Call</Link>
          )}
        </button>
      </section>
    </div>
  );
};

export default IndividualHouse;
