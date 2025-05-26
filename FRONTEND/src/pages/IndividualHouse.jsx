import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectCurrentUser } from "../features/users/userSlice";
import CarouselImage from "../components/CarouselImage";
import ListText from "../components/ListText";
import {
  FaAngleLeft,
  FaArrowLeft,
  FaMap,
  FaPhoneAlt,
  FaUser,
  FaWhatsapp,
} from "react-icons/fa";
import { axiosPrivate } from "../api/axios";
const apiBaseUrl = import.meta.env.VITE_API_URL;

const IndividualHouse = () => {
  const [data, setData] = useState(null);
  const { id } = useParams();
  console.log(id);
  const user = useSelector(selectCurrentUser);

  useEffect(() => {
    const getData = async () => {
      const res = await axiosPrivate.get(`/houses/${id}`);
      setData(res.data);
    };
    getData();
  }, [id]);

  console.log(data);

  return (
    <div className="bg-black p-3 pt-1 rounded-2xl min-h-screen flex flex-col">
      <button className="p-4 fixed top-0 z-70 bg-black/40 rounded-full m-2">
        <Link to={"/"}>
          <FaAngleLeft />
        </Link>
      </button>
      <div>
        <CarouselImage item={data?.images && data} apiBaseUrl={apiBaseUrl} />
      </div>
      <section className="flex  justify-between bg-gray-800 p-2 m-2 rounded-xl">
        <ListText content={data?.landLord?.name}>Hosted by </ListText>
        <section className="flex justify-center">
          <section className="flex items-center text-base justify-around w-20 ">
            <button className="pr-4">
              {" "}
              {user ? (
                <a href={`tel:${data?.landLord?.phoneNumber}`}>
                  <FaPhoneAlt />
                </a>
              ) : (
                <Link to={"/login"}>
                  <FaPhoneAlt />
                </Link>
              )}
            </button>
            <div className="text-[1.1rem]">
              <FaWhatsapp />
            </div>
          </section>
        </section>
      </section>
      {/* image of the landlord or something */}
      <ListText content={data?.pricing}>Price: </ListText>
      <ListText content={data?.area}>Location: </ListText>
      {/* <ListText content={data?.landMarks}>Close to : </ListText> */}
      Close to:
      {/* <div className="flex justify-around">

      {data?.landMarks.map(landMark => <div className='bg-gray-800/40 p-2 rounded-xl'>{landMark}</div>)}
      </div> */}
      <ListText content={data?.createdAt}>Posted on: </ListText>
      <ListText>last verified on: N/A</ListText>
      {/* <ListText content={data?.landLord?.email}>Email: </ListText> */}
      <div>
        Amenities:
        <div className="flex flex-col p-2 pt-1 gap-1 bg-gray-800/40">
          {/* {data?.amenities.map(amenity => <div className="">{amenity}</div>)} */}
          some Array
        </div>
      </div>
      <div className="text-base flex flex-1 items-end justify-center p-4 sticky bottom-0">
        <button className="bg-gray-800 p-2 rounded-xl w-20 flex justify-center items-center gap-2">
          <FaMap />
        </button>
      </div>
    </div>
  );
};

export default IndividualHouse;
