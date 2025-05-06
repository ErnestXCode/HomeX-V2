import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectCurrentUser } from "../features/users/userSlice";
const apiBaseUrl = import.meta.env.VITE_API_URL;

const PostHouse = () => {
  const navigate = useNavigate();
  const [err, setErr] = useState('')

  const dataDict = {
    area: "",
    image: "",
    pricing: "",
    landMarks: "",
  };
  const currentUser = useSelector(selectCurrentUser)

  const [inputData, setInputData] = useState(dataDict);

  const handleChange = (e) => {
    setInputData((prevData) => {
      return {
        ...prevData,
        [e.target.name]: e.target.value,
      };
    });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) {
      console.log("no file");
      return;
    }
    const reader = new FileReader();
    reader.readAsDataURL(file);

    reader.onloadend = async () => {
      setInputData((prevInput) => {
        return {
          ...prevInput,
          image: reader.result,
        };
      });
    };
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if(!currentUser) {
         setErr('Must be logged in')
         return
      }
      const res = await fetch(`${apiBaseUrl}/houses`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({...inputData, landLord: currentUser._id}),
      });
      const result = await res.json();
      console.log(result);
      if (result) navigate("/");
    } catch (err) {
      console.log("error posting house", err);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-black border-2 mt-2 p-3 flex flex-col mb-10 md:w-[700px] md:ml-auto md:mr-auto md:border-0 rounded-2xl"
    >
       <div className="m-2 rounded-2xl p-2 bg-blue-600 text-white font-bold">
        {err}
      </div>
      <label className="mt-2 mb-1 font-semibold" htmlFor="area">
        Area: {/* make it only accept valid areas */}
      </label>
      <input
        onChange={handleChange}
        value={inputData.area}
        name="area"
        type="text"
        id="area"
        className="bg-blue-300 text-black p-2 pl-3 font-bold rounded-2xl mb-3 border-2 border-white"
      />
      <label className="mt-2 mb-1 font-semibold" htmlFor="image">
        Image:{" "}
      </label>
      <input
        onChange={handleImageChange}
        accept="image/*"
        type="file"
        id="image"
        className="bg-blue-300 text-black p-2 pl-3 font-bold rounded-2xl mb-3 border-2 border-white"
      />
      <label className="mt-2 mb-1 font-semibold" htmlFor="pricing">
        Pricing:{" "}
      </label>
      <input
        onChange={handleChange}
        value={inputData.pricing}
        name="pricing"
        type="text"
        id="pricing"
        className="bg-blue-300 text-black p-2 pl-3 font-bold rounded-2xl mb-3 border-2 border-white"
      />
      <label className="mt-2 mb-1 font-semibold" htmlFor="landMarks">
        LandMarks:{" "}
      </label>
      <input
        onChange={handleChange}
        value={inputData.landMarks}
        name="landMarks"
        type="text"
        id="landMarks"
        className="bg-blue-300 text-black p-2 pl-3 font-bold rounded-2xl mb-3 border-2 border-white"
      />

      <button className="bg-white cursor-pointer active:border-3 hover:bg-blue-500 hover:text-white w-fit text-black border-2 border-black pt-2 pb-2 pr-3 pl-3 mr-auto ml-auto rounded-2xl font-bold">
        Create
      </button>
    </form>
  );
};

export default PostHouse;
