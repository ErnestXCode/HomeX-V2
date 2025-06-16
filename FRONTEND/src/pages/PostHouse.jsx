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

const PostHouse = () => {
  const navigate = useNavigate();
  // const [err] = useState("");
  const currentUser = useSelector(selectCurrentUser);
  if (!currentUser) navigate("/signup");

  const areaRef = useRef();
  const cameraRef = useRef();
  const [cameraImage, setCameraImage] = useState(null);
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

  const activateCameraInput = () => {
    cameraRef.current.click();
  };

  const handleimagesChange = async (e) => {
    if (e.target?.files?.length <= 4) {
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

  function getUserCoords() {
    return new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(
        (pos) =>
          resolve({ lat: pos.coords.latitude, lon: pos.coords.longitude }),
        (err) => reject(err)
      );
    });
  }

  function getDistanceInMeters(lat1, lon1, lat2, lon2) {
    const R = 6371000; // radius of Earth in meters
    const toRad = (deg) => deg * (Math.PI / 180);
    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) ** 2 +
      Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;

    return R * (2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)));
  }

  function getGpsFromImage(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const buffer = e.target.result;
        EXIF.getData({ src: buffer }, function () {
          const lat = EXIF.getTag(this, "GPSLatitude");
          const lon = EXIF.getTag(this, "GPSLongitude");
          const latRef = EXIF.getTag(this, "GPSLatitudeRef");
          const lonRef = EXIF.getTag(this, "GPSLongitudeRef");

          if (lat && lon && latRef && lonRef) {
            const toDecimal = (dms, ref) => {
              const [d, m, s] = dms;
              let dec = d + m / 60 + s / 3600;
              return ref === "S" || ref === "W" ? -dec : dec;
            };

            resolve({
              lat: toDecimal(lat, latRef),
              lon: toDecimal(lon, lonRef),
            });
          } else {
            reject("No GPS data");
          }
        });
      };
      reader.readAsArrayBuffer(file);
    });
  }

  const handleCameraChange = async (e) => {
    const file = e.target.files[0];
    try {
      const [imageCoords, userCoords] = await Promise.all([
        getGpsFromImage(file),
        getUserCoords(),
      ]);

      const distance = getDistanceInMeters(
        imageCoords.lat,
        imageCoords.lon,
        userCoords.lat,
        userCoords.lon
      );

      if (distance > 100) {
        alert("Photo location is too far from your current location!");
      }
    } catch (err) {
      alert("Location verification failed: " + err);
      return;
    }

    const newImage = imageCompression(file, {
      maxSizeMB: 0.5,
      maxWidthOrHeight: 1024, //made it smaller from
      useWebWorker: true,
    });

    setCameraImage(newImage);

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
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);

    if (step !== 3) {
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
    form.append("thumbnails", images[0]);
    form.append("thumbnails", images[1]);
    images.forEach((file) => {
      console.log(file);
      form.append("images", file);
    });

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
              onChange={handleCameraChange}
              className="hidden pointer-events-none"
              accept="image/*"
              multiple
              name=""
              capture="environment"
              id=""
              ref={cameraRef}
            />

            <div className="flex items-center flex-col gap-5">
              <label htmlFor="" className="">
                Upload an Image
              </label>
              <div
                onClick={activateCameraInput}
                className="text-base bg-gray-800 p-4 rounded-full "
              >
                <FaCamera />
              </div>
              <ul className=" w-full list-disc p-2 pl-7 m-0 pb-0 text-[0.7rem]">
                <li>Turn on GPS</li>
                <li>Stay within 50 metres of the property</li>
                <li>Take a picture of the property from outside</li>
              </ul>
            </div>
            {cameraImage && (
              <div>
                <img
                  className="w-[50%] h-32 object-cover rounded-2xl mb-2 m-2 mr-auto ml-auto"
                  src={URL.createObjectURL(cameraImage)}
                />{" "}
              </div>
            )}
          </>
        ) : step === 2 ? (
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
                Upload extra Images
              </label>
              <div
                onClick={activateFileInput}
                className="text-base bg-gray-800 p-4 rounded-full "
              >
                <FaImages />
              </div>
              <ul className=" w-full list-disc p-2 pl-7 m-0 pb-0 text-[0.7rem]">
                <li>Pick upto 3 extra images of the property</li>
                <li>Images can be either from inside or outside the property</li>
                <li>Recommended atleast 2 images from inside the property</li>
              </ul>
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
            {step === 3 ? "Create" : "Next"}
          </SubmitButton>
        </div>
      </CustomForm>
      <BottomNav />
    </section>
  );
};

export default PostHouse;
