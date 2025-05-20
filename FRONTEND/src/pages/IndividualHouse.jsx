import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectCurrentUser } from "../features/users/userSlice";
import CarouselImage from "../components/CarouselImage";
import ListText from "../components/ListText";
import { FaArrowLeft, FaMap, FaPhone } from "react-icons/fa";
const apiBaseUrl = import.meta.env.VITE_API_URL;

const IndividualHouse = () => {
  const [data, setData] = useState(null);
  const { id } = useParams();
  console.log(id);
  const user = useSelector(selectCurrentUser);

  useEffect(() => {
    const getData = async () => {
      const res = await axios.get(`${apiBaseUrl}/houses/${id}`);
      setData(res.data);
    };
    getData();
  }, [id]);

  return (
    <div className="bg-black mt-3 p-3 rounded-2xl min-h-screen flex flex-col">
      <button className="p-4 sticky top-0">
        <Link to={"/"}>
          <FaArrowLeft />
        </Link>
      </button>

      <CarouselImage
        item={data?.images && data}
        apiBaseUrl={apiBaseUrl}
        index={0}
      />
      <section className="flex  justify-between bg-gray-800 p-2 m-2 rounded-xl">
        <ListText content={data?.landLord?.name}>Hosted by </ListText>
        <section className="flex justify-center">
          <button className="pr-4">
            {" "}
            {user ? (
              <a href={`tel:${data?.landLord?.phoneNumber}`}>
                <FaPhone />
              </a>
            ) : (
              <Link to={"/login"}>
                <FaPhone />
              </Link>
            )}
          </button>
        </section>
      </section>
      {/* image of the landlord or something */}
      <ListText content={data?.pricing}>Price: </ListText>
      <ListText content={data?.area}>Location: </ListText>
      <ListText content={data?.landMarks}>Close to : </ListText>
      <ListText>last verified: </ListText>
      <ListText>Created on: </ListText>
      {/* <ListText content={data?.landLord?.email}>Email: </ListText> */}
            <div>
              Abunch of amenities here
            </div>
      <div className="text-base flex flex-1 items-end justify-center p-4">
        <button className="bg-gray-800 p-2 rounded-xl w-20 flex justify-center items-center gap-2">
        <FaMap /> 
        </button>
      </div>
    </div>
  );
};

export default IndividualHouse;
