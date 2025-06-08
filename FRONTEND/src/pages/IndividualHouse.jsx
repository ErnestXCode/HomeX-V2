import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectCurrentUser } from "../features/users/userSlice";
import CarouselImage from "../components/CarouselImage";
import ListText from "../components/ListText";
import { FaAngleLeft, FaMap, FaPhoneAlt, FaWhatsapp } from "react-icons/fa";import ImagesPage from "./ImagesPage";
const apiBaseUrl = import.meta.env.VITE_API_URL;

const IndividualHouse = () => {
  const [data, setData] = useState(null);
  const { id } = useParams();
  console.log(id);
  const userInfo = useSelector(selectCurrentUser);

 useEffect(() => {
    const handleProfileData = async () => {
      try {
        const response = await fetch(`${apiBaseUrl}/houses/${id}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${userInfo?.accessToken}`,
          },
          credentials: "include",
        });

        const data = await response.json();
        console.log(data.shortLists);
        setData(data);
      } catch (err) {
        console.log("error", err);
      }
    };

    handleProfileData();
  }, [userInfo?.accessToken, id]);

  
  console.log(data);

  const [showImages, setShowImages] = useState(false);

  const createdAt = data?.createdAt 
  if(!createdAt) console.log('no created at')
  const updatedStatusAt = data?.updatedStatusAt 
  if(!updatedStatusAt) console.log('no created at')

  return (
    <>
      {showImages ? (
        <ImagesPage
          onClick={() => setShowImages(false)}
          images={data?.images}
        />
      ) : (
        <div className="bg-black pt-1 rounded-2xl min-h-screen flex flex-col">
          <button className="p-4 fixed top-0 z-70 bg-black/40 rounded-full m-2">
            <Link to={-1}>
              <FaAngleLeft />
            </Link>
          </button>
          <div onClick={() => setShowImages(true)}>
            <CarouselImage
              showMore={true}
              item={data?.images && data}
              apiBaseUrl={apiBaseUrl}
            />
          </div>
          <section className="flex  justify-between bg-gray-800 p-2 m-2 rounded-xl">
            <ListText content={data?.landLord?.name}>Hosted by </ListText>
            <section className="flex justify-center">
              <section className="flex items-center text-base justify-around w-20 ">
                <button className="pr-4">
                  {" "}
                  {userInfo ? (
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
          <section className="flex flex-col p-3 gap-1">
            <p>Location: {data?.area}</p>
            <p>Price: {data?.pricing}</p>

            <p>
              Posted on:
              {data?.createdAt}
            </p>

            <p>last verified on: {data?.updatedStatusAt} </p>
            <p>Status: {data?.status}</p>
            {/* <ListText content={data?.landLord?.email}>Email: </ListText> */}
            <div className="flex flex-col gap-2">
              <p className="m-4 mb-1 text-base">Amenities</p>
              <div className="flex flex-col p-3 rounded-xl gap-1 bg-gray-800/40">
                {/* {data?.amenities.map(amenity => <div className="">{amenity}</div>)} */}
                <p>
                  <span className="text-base text-gray-400 ">Lorem</span> ipsum.
                </p>
                <p>
                  <span className="text-base text-gray-400 ">Maxime</span> qui!
                </p>
                <p>
                  <span className="text-base text-gray-400 ">Quaerat</span>{" "}
                  consequatur.
                </p>
                <p>
                  <span className="text-base text-gray-400 ">Natus</span>{" "}
                  itaque!
                </p>
                <p>
                  <span className="text-base text-gray-400 ">Natus</span>{" "}
                  praesentium
                </p>
                <p>
                  {" "}
                  <span className="text-base text-gray-400 ">
                    Laudantium
                  </span>{" "}
                  sunt.
                </p>
                <p>
                  {" "}
                  <span className="text-base text-gray-400 ">Ullam</span> eius?
                </p>
                <p>
                  {" "}
                  <span className="text-base text-gray-400 ">Eos</span>{" "}
                  sapiente!
                </p>
                <p>
                  <span className="text-base text-gray-400 ">Maiores</span> aut.
                </p>
                <p>
                  {" "}
                  <span className="text-base text-gray-400 ">Quis</span>{" "}
                  tempore.
                </p>
              </div>
            </div>
          </section>
          <div className="text-base flex flex-1 items-end justify-center p-4 sticky bottom-0">
            <button className="bg-gray-800 p-2 rounded-xl w-20 flex justify-center items-center gap-2">
              <FaMap />
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default IndividualHouse;
