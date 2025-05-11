import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
// import { useSelector } from "react-redux";
// import { selectCurrentUser } from "../features/users/userSlice";
import axios from "axios";
import { useSelector } from "react-redux";
import { selectCurrentUser } from "../features/users/userSlice";
import CustomInputBox from "../components/CustomInputBox";
import SubmitButton from "../components/SubmitButton";
const apiBaseUrl = import.meta.env.VITE_API_URL;

const PostHouse = () => {
  const navigate = useNavigate();
  const [err] = useState("");
  // const currentUSer = useSelector(selectCurrentUser);
  const currentUser = useSelector(selectCurrentUser);

  const dataDict = {
    area: "",
    pricing: "",
    landMarks: "",
  };
  const [images, setImages] = useState([]);

  const [inputData, setInputData] = useState(dataDict);

  const handleChange = (e) => {
    setInputData((prevData) => {
      return {
        ...prevData,
        [e.target.name]: e.target.value,
      };
    });
  };
  console.log(inputData)

  const handleimagesChange = (e) => {
    e.preventDefault();
    if (e.target.files.length <= 3) {
      setImages(Array.from(e.target.files));
    } else {
      throw new Error("limit of 3 exceeded");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const form = new FormData();
    form.append("area", inputData?.area);
    form.append("pricing", inputData?.pricing);
    form.append("landMarks", inputData?.landMarks);
    form.append("landLord", currentUser._id);
    images.forEach((file) => form.append("images", file));
    try {
      const response = await axios.post(`${apiBaseUrl}/houses`, form);
      console.log(response);
      navigate("/");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-black mt-2 p-3 flex flex-col mb-10 md:w-[700px] md:ml-auto md:mr-auto md:border-0 rounded-2xl"
    >
      <div className="m-2 rounded-2xl p-2 bg-blue-600 text-white font-bold">
        {err}
      </div>
      <CustomInputBox
        id={"area"}
        value={inputData.area}
        name={"area"}
        type={"text"}
        onChange={(e) => handleChange(e)}
      >
        Area:
      </CustomInputBox>

      <label className="mt-2 mb-1 font-semibold" htmlFor="images">
        images:{" "}
      </label>
      <input
        onChange={handleimagesChange}
        accept="image/*"
        multiple={true}
        type="file"
        id="images"
        className="bg-gray-700 text-slate-50 p-2 pl-3 font-bold rounded-2xl mb-3 border-2 border-blue-600"
      />
      {/* style images input better */}

      <CustomInputBox
        id={"pricing"}
        name={"pricing"}
        value={inputData.pricing}
        type={"number"}
        onChange={(e) => handleChange(e)}
      >
        Pricing:
      </CustomInputBox>

      <CustomInputBox
        id={"landMarks"}
        value={inputData.landMarks}
        name={"landMarks"}
        type={"text"}
        onChange={(e) => handleChange(e)}
      >
        Landmarks:
      </CustomInputBox>

      <SubmitButton>Create</SubmitButton>
    </form>
  );
};

export default PostHouse;
