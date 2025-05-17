import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import imageCompression from "browser-image-compression";
// import { useSelector } from "react-redux";
// import { selectCurrentUser } from "../features/users/userSlice";
import axios from "axios";
import { useSelector } from "react-redux";
import { selectCurrentUser } from "../features/users/userSlice";
import CustomInputBox from "../components/CustomInputBox";
import SubmitButton from "../components/SubmitButton";
import { QueryClient, useMutation } from "@tanstack/react-query";
import BottomNav from "../components/BottomNav";
import CustomForm from "../components/CustomForm";
const apiBaseUrl = import.meta.env.VITE_API_URL;

const PostHouse = () => {
  const navigate = useNavigate();
  // const [err] = useState("");
  const currentUser = useSelector(selectCurrentUser);
  if (!currentUser) navigate("/signup");

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
            maxWidthOrHeight: 1024,
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
    form.append("area", inputData?.area);
    form.append("pricing", inputData?.pricing);
    form.append("landMarks", inputData?.landMarks);
    form.append("landLord", currentUser?._id);
    images.forEach((file) =>
      form.append(
        "images",
        new File([file], Date.now() + "--" + file.name, { type: file.type })
      )
    );
    try {
      const response = await axios.post(`${apiBaseUrl}/houses`, form);
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
  <>
    <CustomForm
      onSubmit={(e) => handleSubmit(e)}
    >
      <CustomInputBox
        id={"area"}
        value={inputData?.area}
        name={"area"}
        type={"text"}
        onChange={(e) => handleChange(e)}
      >
        Area:
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
          Images:
        </CustomInputBox>
      )}

      <CustomInputBox
        id={"pricing"}
        name={"pricing"}
        value={inputData?.pricing}
        type={"number"}
        onChange={(e) => handleChange(e)}
      >
        Pricing:
      </CustomInputBox>

      <CustomInputBox
        id={"landMarks"}
        value={inputData?.landMarks}
        name={"landMarks"}
        type={"text"}
        onChange={(e) => handleChange(e)}
      >
        Landmarks:
      </CustomInputBox>
      <div className="p-3 text">
      <SubmitButton>Create</SubmitButton>
      </div>
    </CustomForm>
    <BottomNav />
    </>
  );
};

export default PostHouse;
