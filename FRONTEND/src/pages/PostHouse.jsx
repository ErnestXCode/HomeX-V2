import React, { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import imageCompression from "browser-image-compression";
// import { useSelector } from "react-redux";
// import { selectCurrentUser } from "../features/users/userSlice";
import { useSelector } from "react-redux";
import { selectCurrentUser } from "../features/users/userSlice";
import CustomInputBox from "../components/CustomInputBox";
import CustomCheckBox from "../components/CustomCheckBox";
import SubmitButton from "../components/SubmitButton";
import { QueryClient, useMutation } from "@tanstack/react-query";
import BottomNav from "../components/BottomNav";
import CustomForm from "../components/CustomForm";
import axios from "../api/axios";
import SecondaryHeader from "../components/SecondaryHeader";
import {
  FaDog,
  FaImages,
  FaLightbulb,
  FaShower,
  FaToilet,
  FaWater,
  FaWifi,
} from "react-icons/fa";
import { useEffect } from "react";

const PostHouse = () => {
  const navigate = useNavigate();
  // const [err] = useState("");
  const currentUser = useSelector(selectCurrentUser);
  if (!currentUser) navigate("/signup");

  const areaRef = useRef();
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(0);

  useEffect(() => {
    if (step === 0) areaRef?.current.focus();
  }, [step]);

  const amenitiesObj = {
    wifi: false,
    water: false,
    bathroom: false,
    shower: false,
    security: false,
    electricity: false,
  };

  const [amenities, setAmenities] = useState(amenitiesObj);

  const dataDict = {
    area: "",
    pricing: "",
    numOfHouses: "",
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

  const [coords, setCoords] = useState(null);
  const uploadRef = useRef();

  const activateFileInput = () => {
    uploadRef.current.click();
  };

  const handleimagesChange = async (e) => {
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

      const success = (pos) => {
        const coordinates = {
          lat: pos.coords.latitude,
          long: pos.coords.longitude,
        };
        console.log(pos);
        setCoords(coordinates);
      };
      const error = (err) => {
        console.log(err);
      };

      navigator.geolocation.getCurrentPosition(success, error, {
        enableHighAccuracy: true,
      });
    } else {
      throw new Error("limit of 3 exceeded");
    }
  };
  // console.log('files', URL.createObjectURL(images[0]))

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);

    if (step !== 2) {
      setStep((prev) => prev + 1);
      return;
    }

    const form = new FormData();

    form.append("area", inputData?.area);
    form.append("pricing", inputData?.pricing);
    form.append("landLord", currentUser?._id);
    form.append("numOfHouses", inputData?.numOfHouses);
    form.append("coords", JSON.stringify(coords));
    form.append("amenities", JSON.stringify(amenities));
    images.forEach((file) =>
      form.append(
        "images",
        new File([file], Date.now() + "--" + file.name, { type: file.type })
      )
    );
    try {
      await axios.post(`/houses`, form, {
        headers: {
          Authorization: `Bearer ${currentUser?.accessToken}`,
        },
        withCredentials: true,
      });

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

  const handleCheckBoxChange = (e) => {
    setAmenities((prevData) => {
      return {
        ...prevData,

        [e.target.value]: e.target.checked,
      };
    });
  };

  const AmenitiesArray = [
    <FaWifi />,
    <FaWater />,
    <FaToilet />,
    <FaShower />,
    <FaDog />,
    <FaLightbulb />,
  ];

  console.log("inputData", inputData);

   const [isOnline, setIsOnline] = useState(navigator.onLine);
  
    useEffect(() => {
      const goOnline = () => setIsOnline(true);
      const goOffline = () => setIsOnline(false);
  
      window.addEventListener("online", goOnline);
      window.addEventListener("offline", goOffline);
  
      return () => {
        window.removeEventListener("online", goOnline);
        window.removeEventListener("offline", goOffline);
      };
    }, []);
  
    if (!isOnline) {
      return (
        <div className="h-screen w-full flex flex-col">
               <SecondaryHeader>Create</SecondaryHeader>

          <div className="flex flex-col flex-1 justify-center items-center">

          <h1 className="text-2xl mb-4">You're offline</h1>
          <p className="mb-4">Check your internet connection.</p>
          <button
            className="bg-blue-600 px-4 py-2 rounded-lg"
            onClick={() => window.location.reload()}
            >
            Retry
          </button>
            </div>
            <BottomNav />
        </div>
      );
    }

  return (
    <section className="pb-10">
      <SecondaryHeader>Create</SecondaryHeader>
      <CustomForm onSubmit={(e) => handleSubmit(e)}>
        {step === 0 ? (
          <>
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
            <CustomInputBox
              id={"pricing"}
              name={"pricing"}
              value={inputData?.pricing}
              type={"number"}
              onChange={(e) => handleChange(e)}
            >
              Average Rent
            </CustomInputBox>
            {/* add a minimum and a maximum for these two*/}
            <CustomInputBox
              id={"numOfHouses"}
              name={"numOfHouses"}
              value={inputData?.numOfHouses}
              type={"number"}
              onChange={(e) => handleChange(e)}
              // put a maximum amount of rooms a landlord can post or something
            >
              Number of houses available
            </CustomInputBox>{" "}
          </>
        ) : step === 1 ? (
          <>
            <input
              type="file"
              onChange={handleimagesChange}
              className="hidden pointer-events-none"
              accept="image/*"
              multiple
              name=""
              id=""
              ref={uploadRef}
            />

            <div className="flex items-center flex-col gap-5">
              <label htmlFor="" className="">
                Upload Images
              </label>
              <div
                onClick={activateFileInput}
                className="text-base bg-gray-800 p-4 rounded-full "
              >
                <FaImages />
              </div>
            </div>
            {images[0] && (
              <div>
                <img
                  className="w-[50%] h-32 object-cover rounded-2xl mb-2 m-2 mr-auto ml-auto"
                  src={URL.createObjectURL(images[0])}
                />{" "}
                {images.length - 1 !== 0 && <p>and {images.length - 1} more</p>}
              </div>
            )}
          </>
        ) : (
          <>
            <label htmlFor="" className="text-center">
              Amenities
            </label>
            <div className="flex flex-col gap-2 p-3 ml-5">
              {Object.keys(amenities).map((amenity, i) => (
                <CustomCheckBox
                  key={i}
                  onChange={(e) => handleCheckBoxChange(e)}
                  id={amenity}
                  name={amenity}
                  value={amenity}
                  type={"checkbox"}
                >
                  <div className="flex items-center gap-3">
                    {AmenitiesArray[i]}
                    {amenity}
                  </div>
                </CustomCheckBox>
              ))}
            </div>
          </>
        )}

        {/* i dont think we will need landmarks when we have maps */}
        <div className="mt-3">
          <SubmitButton isDisabled={loading}>
            {step === 2 ? "Create" : "Next"}
          </SubmitButton>
        </div>
      </CustomForm>
      <BottomNav />
    </section>
  );
};

export default PostHouse;
