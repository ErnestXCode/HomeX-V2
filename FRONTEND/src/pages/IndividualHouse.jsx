import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectCurrentUser } from "../features/users/userSlice";

const IndividualHouse = () => {
  const [data, setData] = useState(null);
  const { id } = useParams();
  const user = useSelector(selectCurrentUser);

  useEffect(() => {
    const getData = async () => {
      const res = await axios.get(`http://localhost:5000/houses/${id}`);
      setData(res.data);
    };
    getData();
  }, [id]);

  return (
    <div
      className="bg-black mt-3 p-3 rounded-2xl min-h-30 mb-10
        md:w-[500px] md:h-auto mr-auto ml-auto"
    >
      <img
        className="w-screen"
        src={`http://localhost:5000/${data?.image}`}
        alt=""
      />
      <h3 className="text-blue-400 font-bold p-1 text-[1rem]">
        Price: <span className="text-white font-semibold">{data?.pricing}</span>
      </h3>
      <p className="text-blue-400 font-bold p-1 text-[1rem]">
        Area: <span className="text-white font-semibold">{data?.area}</span>
      </p>
      <p className="text-blue-400 font-bold p-1 text-[1rem]">
        Landmarks:{" "}
        <span className="text-white font-semibold">{data?.landMarks}</span>
      </p>
      <p className="text-blue-400 font-bold p-1 text-[1rem]">
        Landlord:{" "}
        <span className="text-white font-semibold">{data?.landLord.name}</span>
      </p>
      <p className="text-blue-400 font-bold p-1 text-[1rem]">
        Email:{" "}
        <span className="text-white font-semibold">{data?.landLord.email}</span>
      </p>

      <section className="w-screen mt-4 mb-4">
        <button className="bg-blue-700 p-2 rounded-2xl pr-3 pl-3">
          <Link to={"/"}>GO BACK</Link>
        </button>
        <button className="bg-blue-700 text-black font-bold p-2 pr-4 pl-4 ml-[200px] rounded-2xl text-2xl active:bg-blue-500 active:border-2">
          {user ? (
            <a href={`tel:${data?.landLord.phoneNumber}`}>Call</a>
          ) : (
            <Link to={"/login"}>Call</Link>
          )}
        </button>
      </section>
    </div>
  );
};

export default IndividualHouse;
