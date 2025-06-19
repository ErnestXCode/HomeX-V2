import React, { useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
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
  FaCamera,
  FaDog,
  FaImages,
  FaLightbulb,
  FaShower,
  FaToilet,
  FaWater,
  FaWifi,
} from "react-icons/fa";
import { useEffect } from "react";
import EXIF from "exif-js";
import { useTranslation } from "react-i18next";

const EditHouse = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  // const [err] = useState("");
  const { t } = useTranslation();
  const currentUser = useSelector(selectCurrentUser);
  if (!currentUser) navigate("/signup");

  const initRef = useRef();
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(0);

  useEffect(() => {
    if (step === 0) initRef?.current.focus();
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
    pricing: "",
    numOfHouses: "",
  };

  const [inputData, setInputData] = useState(dataDict);

  const handleChange = (e) => {
    setInputData((prevData) => {
      return {
        ...prevData,
        [e.target?.name]: e.target?.value,
      };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);

    if (step !== 1) {
      setStep((prev) => prev + 1);
      return;
    }

    const form = new FormData();

    form.append("pricing", inputData?.pricing);
    form.append("numOfHouses", inputData?.numOfHouses);
    form.append("amenities", JSON.stringify(amenities));
    const roles = currentUser?.roles
    form.append('roles', roles)
    try {
      const res = await axios.put(`/houses/${id}`, form, {
        headers: {
            'Content-Type': 'application/json',
          Authorization: `Bearer ${currentUser?.accessToken}`,
        },
        withCredentials: true,
      });
      console.log(res.data)
      navigate("/");
    } catch (error) {
      console.log(error);
    }
  };


  const queryClient = new QueryClient();

  useMutation({
    mutationFn: handleSubmit,
    onSuccess: () => {
      queryClient.invalidateQueries("houses");
      queryClient.invalidateQueries("landlordPosts");
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
      <SecondaryHeader>Edit</SecondaryHeader>
      <CustomForm onSubmit={(e) => handleSubmit(e)}>
        {step === 0 ? (
          <>
            <CustomInputBox
              inputRef={initRef}
              id={"pricing"}
              name={"pricing"}
              value={inputData?.pricing}
              type={"number"}
              onChange={(e) => handleChange(e)}
            >
              {t("AverageRent")}
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
              {t("RoomsAvailable")}
            </CustomInputBox>{" "}
          </>
        ) : (
          <>
            <label htmlFor="" className="text-center">
              {t("Amenities")}
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
            {step === 1 ? "Edit" : "Next"}
          </SubmitButton>
        </div>
      </CustomForm>
    </section>
  );
};

export default EditHouse;
