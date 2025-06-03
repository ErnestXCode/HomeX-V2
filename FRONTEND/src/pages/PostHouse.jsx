import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import imageCompression from "browser-image-compression";
// import { useSelector } from "react-redux";
// import { selectCurrentUser } from "../features/users/userSlice";
import { useSelector } from "react-redux";
import { selectCurrentUser } from "../features/users/userSlice";
import CustomInputBox from "../components/CustomInputBox";
import SubmitButton from "../components/SubmitButton";
import { QueryClient, useMutation } from "@tanstack/react-query";
import BottomNav from "../components/BottomNav";
import CustomForm from "../components/CustomForm";
import axios from "../api/axios";
import SecondaryHeader from "../components/SecondaryHeader";

const PostHouse = () => {
  const navigate = useNavigate();
  // const [err] = useState("");
  const currentUser = useSelector(selectCurrentUser);
  if (!currentUser) navigate("/signup");

  const areaRef = useRef();

  useEffect(() => {
    areaRef?.current.focus();
  }, []);

  const dataDict = {
    area: "",
    pricing: "",
    landMarks: "",
    amenities: "",
  };
  const [images, setImages] = useState([]);

  const [inputData, setInputData] = useState(dataDict);

  const handleChange = (e) => {
    setInputData((prevData) => {
      return {
        ...prevData,
        [e.target?.name]: e.target?.value,
      };
    });
  };

  const handleimagesChange = async (e) => {
    e.preventDefault();
    if (e.target?.files?.length <= 3) {
      const files = Array.from(e.target.files);
      const compressedFiles = await Promise.all(
        files.map((file) => {
          console.log(file);
          const newImage = imageCompression(file, {
            maxSizeMB: 0.5,
            maxWidthOrHeight: 1024, //made it smaller from
            useWebWorker: true,
          });
          return newImage;
        })
      );
      setImages(compressedFiles);
    } else {
      throw new Error("limit of 3 exceeded");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const form = new FormData();

    const landMarkArray = [];
    const amenitiesArray = [];
    const splitLandMarks = inputData?.landMarks.split(",");
    const splitAmenities = inputData?.amenities.split(",");
    splitLandMarks.forEach((landMark) => landMarkArray.push(landMark));
    splitAmenities.forEach((amenity) => amenitiesArray.push(amenity));

    landMarkArray.forEach((landMark) => form.append("landMarks", landMark));
    amenitiesArray.forEach((amenity) => form.append("amenities", amenity));

    form.append("area", inputData?.area);
    form.append("pricing", inputData?.pricing);
    form.append("landLord", currentUser?._id);
    images.forEach((file) =>
      form.append(
        "images",
        new File([file], Date.now() + "--" + file.name, { type: file.type })
      )
    );
    try {
      const response = await axios.post(`/houses`, form, {
        withCredentials: true,
      });
      console.log(response);
      navigate("/");
    } catch (error) {
      console.log(error);
    }
  };

  // images[0] && console.log(URL.createObjectURL(images[0]))

  const queryClient = new QueryClient();

  useMutation({
    mutationFn: handleSubmit,
    onSuccess: () => {
      queryClient.invalidateQueries("houses");
    },
  });



  return (
    <section className="pb-10">
      <SecondaryHeader>Create</SecondaryHeader>
      <CustomForm onSubmit={(e) => handleSubmit(e)}>
        <CustomInputBox
          id={"area"}
          inputRef={areaRef}
          value={inputData?.area}
          name={"area"}
          type={"text"}
          onChange={(e) => handleChange(e)}
        >
          Location
        </CustomInputBox>

        {/* style images input better */}
        {images[0] ? (
          <div>
            <img
              className="w-[50%] h-32 object-cover rounded-2xl mb-2 m-2 mr-auto ml-auto"
              src={URL.createObjectURL(images[0])}
            />{" "}
            {images.length - 1 !== 0 && <p>and {images.length - 1} more</p>}
          </div>
        ) : (
          <CustomInputBox
            id={"images"}
            name={"images"}
            type={"file"}
            isFileInput={true}
            onChange={(e) => handleimagesChange(e)}
          >
            Images
          </CustomInputBox>
        )}

        <CustomInputBox
          id={"pricing"}
          name={"pricing"}
          value={inputData?.pricing}
          type={"number"}
          onChange={(e) => handleChange(e)}
        >
          Pricing
        </CustomInputBox>
        <CustomInputBox
          id={"amenities"}
          name={"amenities"}
          value={inputData?.amenities}
          type={"text"}
          onChange={(e) => handleChange(e)}
        >
          Amenities
        </CustomInputBox>

        <CustomInputBox
          id={"landMarks"}
          value={inputData?.landMarks}
          name={"landMarks"}
          type={"text"}
          onChange={(e) => handleChange(e)}
        >
          Landmarks
        </CustomInputBox>
        {/* i dont think we will need landmarks when we have maps */}
        <div className="mt-3">
          <SubmitButton>Create</SubmitButton>
        </div>
      </CustomForm>
      <BottomNav />
    </section>
  );
};

export default PostHouse;
