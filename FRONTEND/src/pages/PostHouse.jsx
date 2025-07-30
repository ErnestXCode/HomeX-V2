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
import { useTranslation } from "react-i18next";
// import {motion } from 'framer-motion'

// const containerVariants = {
//   hidden: {
//     opacity: 0,
//     x: '100vw'
//   },
//   visible: {
//     opacity: 1,
//     x: 0,
//     transition: {
//       type: 'spring',
//       delay: 0.5
//     }
//   }
// }

import Select from "react-select";
import { Dialog } from "@headlessui/react";

const houseTypeOptions = [
  { value: "Bedsitter", label: "Bedsitter" },
  { value: "1 Bedroom", label: "1 Bedroom" },
  { value: "2 Bedroom", label: "2 Bedroom" },
  { value: "3 Bedroom", label: "3 Bedroom" },
];

function compressImageCustom(file) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.src = URL.createObjectURL(file);
    img.onload = () => {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");

      // calculate new dimensions while maintaining aspect ratio
      let width = img.width;
      let height = img.height;
      if (width > 1024 || height > 1024) {
        if (width > height) {
          height = Math.round((1024 / width) * height);
          width = 1024;
        } else {
          width = Math.round((1024 / height) * width);
          height = 1024;
        }
      }

      canvas.width = width;
      canvas.height = height;
      ctx.drawImage(img, 0, 0, width, height);

      const compress = () => {
        const maxSize = 0.5 * 1024 * 1024;
        let quality = 0.8;

        canvas.toBlob(
          (blob) => {
            // check file size and adjust quality if needed

            if (blob.size <= maxSize) {
              // adjust quality
              const compressedFile = new File([blob], file.name, {
                type: "image/webp",
              });
              resolve(compressedFile);
            } else if (quality > 0.1) {
              quality -= 0.2;
              compress();
            } else {
              const compressedFile = new File([blob], file.name, {
                type: "image/webp",
              });
              resolve(compressedFile);
            }

            // convert blob to file
          },
          "image/webp",
          quality
        );
      };
      compress();
    };
    img.onerror = () => reject(new Error("Failed to load image"));
  });
}

const PostHouse = () => {
  const navigate = useNavigate();
  // const [err] = useState("");
  const { t } = useTranslation();
  const currentUser = useSelector(selectCurrentUser);
  if (currentUser) console.log("uyu msee ni ka ako", currentUser);
  const [selectedTypes, setSelectedTypes] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [stepIndex, setStepIndex] = useState(0);
  const [typeDetails, setTypeDetails] = useState({});
  const [formData, setFormData] = useState({ min: "", max: "", units: "" });
  if (!currentUser) navigate("/signup");

  const plotNameRef = useRef();
  const cameraRef = useRef();
  const [cameraImage, setCameraImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(0);

  useEffect(() => {
    if (step === 0) plotNameRef?.current.focus();
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
    plotName: ''
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
    console.time("images");
    if (e.target?.files?.length <= 4) {
      const files = Array.from(e.target.files);
      console.time("promiseCompress");

      const compressedFiles = await Promise.all(
        // make it faster tho
        files.map((file) => {
          const compressedImage = compressImageCustom(file);

          console.log("finished processing image, ", file.name);
          return compressedImage;
        })
      );
      console.timeEnd("promiseCompress");
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
    console.timeEnd("images");
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
        console.log(e, "e yetu");
        const buffer = e.target.result;
        EXIF.getData({ src: buffer }, function () {
          const metadata = EXIF.getAllTags(this);
          console.log("imeingia huku", metadata);
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
  //   const getGpsFromImage = (file) => {
  //   const reader = new FileReader();

  //   reader.onload = function (e) {
  //     const img = new Image();
  //     img.onload = function () {
  //       EXIF.getData(img, function () {
  //         const allTags = EXIF.getAllTags(this);
  //         console.log('All EXIF tags:', allTags);

  //         if (allTags.GPSLatitude && allTags.GPSLongitude) {
  //           console.log('GPS:', allTags.GPSLatitude, allTags.GPSLongitude);
  //         } else {
  //           console.log('No GPS data found');
  //         }
  //       });
  //     };
  //     img.src = e.target.result;
  //   };

  //   reader.readAsDataURL(file);
  // };

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
    console.time("form");
    form.append("area", inputData?.area);
    form.append("plotName", inputData?.plotName);

    form.append("typeData", JSON.stringify(typeDetails));
    // form.append("landLord", currentUser?._id);

    form.append("coords", JSON.stringify(coords));
    form.append("amenities", JSON.stringify(amenities));
    form.append("thumbnails", images[0]);
    form.append("thumbnails", images[1]);
    images.forEach((file) => {
      form.append("images", file);
    });
    console.timeEnd("form");

    console.time("submit");
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
    console.timeEnd("submit");
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

  const handleTypeChange = (selected) => {
    setSelectedTypes(selected || []);
  };

  const openModal = () => {
    if (selectedTypes.length > 0) {
      setModalOpen(true);
      setStepIndex(0);
    }
  };

  const handleContinue = () => {
    const currentType = selectedTypes[stepIndex]?.value;
    if (currentType) {
      setTypeDetails((prev) => ({
        ...prev,
        [currentType]: { ...formData },
      }));
    }
    setFormData({ min: "", max: "", units: "" });

    if (stepIndex + 1 < selectedTypes.length) {
      setStepIndex(stepIndex + 1);
    } else {
      setModalOpen(false);
      console.log("All entries:", typeDetails); // Final data here
    }
  };

  const currentLabel = selectedTypes[stepIndex]?.label;

  console.log("currentUser", currentUser);

  return (
    <section className="pb-10">
      <SecondaryHeader>Create</SecondaryHeader>
      <CustomForm onSubmit={(e) => handleSubmit(e)}>
        {step === 0 ? (
          <>
            <CustomInputBox
              id={"plotName"}
              inputRef={plotNameRef}
              value={inputData?.plotName}
              name={"plotName"}
              type={"text"}
              onChange={(e) => handleChange(e)}
            >
              Plot Name
            </CustomInputBox>
            <CustomInputBox
              id={"area"}
              value={inputData?.area}
              name={"area"}
              type={"text"}
              onChange={(e) => handleChange(e)}
            >
              {t("Location")}
            </CustomInputBox>

            <div className="p-4 max-w-md mx-auto">
              <label className="block text-white mb-2">
                Select House Types
              </label>
              <Select
                isMulti
                options={houseTypeOptions}
                value={selectedTypes}
                onChange={handleTypeChange}
                className="mb-4 text-black"
              />

              <section
                onClick={openModal}
                disabled={selectedTypes.length === 0}
                className="bg-blue-600 text-white px-4 py-2 rounded text-center"
              >
                Next
              </section>

              <Dialog
                open={modalOpen}
                onClose={() => setModalOpen(false)}
                className="relative z-50"
              >
                <div className="fixed inset-0 bg-black/50" aria-hidden="true" />
                <div className="fixed inset-0 flex items-center justify-center p-4">
                  <Dialog.Panel className="bg-gray-950 text-white rounded-2xl p-6 w-full max-w-sm">
                    <Dialog.Title className="text-lg font-bold mb-4 ">
                      {`Enter Details for ${currentLabel}`}
                    </Dialog.Title>

                    <div className="space-y-3 placeholder:text-white">
                      <input
                        type="number"
                        placeholder="Minimum Rent"
                        value={formData.min}
                        onChange={(e) =>
                          setFormData({ ...formData, min: e.target.value })
                        }
                        className="w-full px-3 py-2 border rounded"
                      />
                      <input
                        type="number"
                        placeholder="Maximum Rent"
                        value={formData.max}
                        onChange={(e) =>
                          setFormData({ ...formData, max: e.target.value })
                        }
                        className="w-full px-3 py-2 border rounded"
                      />
                      <input
                        type="number"
                        placeholder="Units Available"
                        value={formData.units}
                        onChange={(e) =>
                          setFormData({ ...formData, units: e.target.value })
                        }
                        className="w-full px-3 py-2 border rounded"
                      />
                    </div>

                    <button
                      onClick={handleContinue}
                      className="mt-5 w-full bg-blue-600 text-white py-2 rounded"
                    >
                      {stepIndex + 1 === selectedTypes.length
                        ? "Finish"
                        : "Continue"}
                    </button>
                  </Dialog.Panel>
                </div>
              </Dialog>
            </div>
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
                {t("UploadImage")}
              </label>
              <div
                onClick={activateCameraInput}
                className="text-base bg-gray-800 p-4 rounded-full "
              >
                <FaCamera />
              </div>
              <ul className=" w-full list-disc p-2 pl-7 m-0 pb-0 text-[0.7rem]">
                <p className="text-center font-bold">
                  SKIP , THIS FEATURE IS INCOMPLETE
                </p>
                <li>{t("TurnOnGps")}</li>
                <li>{t("AllowedDistance")}</li>
                <li>{t("TakePictureOutside")}</li>
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
                {t("UploadExtraImages")}
              </label>
              <div
                onClick={activateFileInput}
                className="text-base bg-gray-800 p-4 rounded-full "
              >
                <FaImages />
              </div>
              <ul className=" w-full list-disc p-2 pl-7 m-0 pb-0 text-[0.7rem]">
                <li>{t("ExtrasAllowed")}</li>
                <li>{t("FromWhereExtrasTaken")}</li>
                <li>{t("RecommendedAmtOfExtras")}</li>
              </ul>
            </div>
            {images[0] && (
              <div>
                <img
                  className="w-[50%] h-32 object-cover rounded-2xl mb-2 m-2 mr-auto ml-auto"
                  src={URL.createObjectURL(images[0])}
                  onLoad={null} //placeholder image
                />{" "}
                {images.length - 1 !== 0 && (
                  <p>
                    {t("and")} {images.length - 1} {t("more")}
                  </p>
                )}
              </div>
            )}
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
            {step === 3 ? "Create" : "Next"}
          </SubmitButton>
        </div>
      </CustomForm>
    </section>
  );
};

export default PostHouse;
