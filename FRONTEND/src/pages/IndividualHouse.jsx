import React, { useEffect, useState, useRef } from "react";
import { Link, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectCurrentUser } from "../features/users/userSlice";
import ListText from "../components/ListText";
import {
  FaAngleLeft,
  FaCheckCircle,
  FaDog,
  FaLightbulb,
  FaMap,
  FaPaypal,
  FaPhoneAlt,
  FaShower,
  FaTimes,
  FaTimesCircle,
  FaToilet,
  FaWater,
  FaWhatsapp,
  FaWifi,
} from "react-icons/fa";
import ImagesPage from "./ImagesPage";
import CarouselImage from "../components/CarouselImage";
import Modal from "../components/Modal";
import CustomInputBox from "../components/CustomInputBox";
import SubmitButton from "../components/SubmitButton";
import CustomForm from "../components/CustomForm";
import { useTranslation } from "react-i18next";
import axios from "../api/axios";
const apiBaseUrl = import.meta.env.VITE_API_URL;

const IndividualHouse = () => {
  const [data, setData] = useState(null);
  const { t } = useTranslation();
  const { id } = useParams();
  const [mpesaModalIsOpen, setMpesaModalIsOpen] = useState(false);
  const [mpesaNumber, setMpesaNumber] = useState("");
  const mpesaRef = useRef();
  const [paidHouseType, setPaidHouseType] = useState(null);

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
        setData(data);
      } catch (err) {
        console.log("error", err);
      }
    };

    handleProfileData();
  }, [userInfo?.accessToken, id]);

  console.log(data);

  const [showImages, setShowImages] = useState(false);

  const createdAt = data?.createdAt;
  if (!createdAt) return;
  const updatedStatusAt = data?.updatedStatusAt;
  if (!updatedStatusAt) return;
  const amenities = data?.amenities;
  if (!amenities) return;

  const f_2 = new Intl.DateTimeFormat(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  });

  const handleWhatsappRedirect = (phone) => {
    let cleanedPhone = phone.replace(/\D/g, ""); // Remove non-digits

    // If it starts with 0, replace with 254
    if (cleanedPhone.startsWith("0")) {
      cleanedPhone = "254" + cleanedPhone.slice(1);
    }

    // If it doesn’t start with 254 and isn’t already a full number, warn user
    if (!cleanedPhone.startsWith("254")) {
      alert(
        "Please enter a valid Kenyan phone number (starting with 07 or 254)"
      );
      return;
    }

    window.open(
      `https://wa.me/${cleanedPhone}`,
      "_blank",
      "noopener,noreferrer"
    );
  };
  const AmenitiesArray = [
    <FaWifi />,
    <FaWater />,
    <FaToilet />,
    <FaShower />,
    <FaDog />,
    <FaLightbulb />,
  ];

  console.log(data);

  const f = new Intl.NumberFormat(undefined, {
    style: "currency",
    currency: "KSH",
  });

  const handlePayment = async () => {
    try {
      await axios.post(
        "/stkpush",
        { phone: mpesaNumber, houseId: id, unitType: paidHouseType },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${userInfo?.accessToken}`,
          },
        }
      );
    } catch (error) {
      console.log(error);
    }

    setMpesaModalIsOpen(false);
  };

  const openMpesaModal = (unitKey) => {
    setMpesaModalIsOpen(true);
    mpesaRef.current.focus();
    setPaidHouseType(unitKey);
  };
  console.log(paidHouseType);

  const handleMpesaChange = (e) => {
    setMpesaNumber(e.target.value);
  };

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
            <CarouselImage showMore={true} item={data?.images && data} />
          </div>
          <section>
            <p className="m-2 pl-4 text-[0.9rem] mt-3">Host</p>

            <section className="flex  justify-between bg-gray-950 p-2 m-2 rounded-xl">
              <ListText content={data?.landLord?.name}>Hosted by </ListText>
              <section className="flex justify-center">
                <section className="flex items-center text-base justify-around w-20 ">
                  <section>
                    <Modal
                      isOpen={mpesaModalIsOpen}
                      onClick={() => setMpesaModalIsOpen(false)}
                    >
                      <CustomForm onSubmit={handlePayment}>
                        <CustomInputBox
                          inputRef={mpesaRef}
                          value={mpesaNumber}
                          onChange={handleMpesaChange}
                          id="mpesa"
                        >
                          Mpesa Number
                        </CustomInputBox>
                        <SubmitButton>Pay</SubmitButton>
                      </CustomForm>
                    </Modal>
                  </section>

                  {/* <button className="pr-4">
                    {" "}
                    {userInfo ? (
                      <a
                        className="text-gray-300"
                        href={`tel:${data?.landLord?.phoneNumber}`}
                      >
                        <FaPhoneAlt />
                      </a>
                    ) : (
                      <Link className="text-gray-300" to={"/login"}>
                        <FaPhoneAlt />
                      </Link>
                    )}
                  </button> */}
                  {/* <button
                    onClick={() =>
                      handleWhatsappRedirect(data?.landLord?.phoneNumber)
                    }
                    className="text-[1.15rem] text-green-500"
                  >
                    <FaWhatsapp />
                  </button> */}
                </section>
              </section>
            </section>
          </section>
          {/* image of the landlord or something */}
          <section>
            <p className="m-2 pl-4 text-[0.9rem] mt-3">Details</p>

            <section className="flex flex-col p-3 pt-0 gap-3">
              <section className="flex flex-col bg-gray-950 p-3 rounded-xl gap-3">
                <div className="flex items-center justify-between">
                  <p>Name</p> <p>Sunrise Court</p>
                </div>
                <div className="flex items-center justify-between">
                  <p>Location</p> <p>{data?.area}</p>
                </div>

                {/* <section className="flex gap-2">
                  <p>Status:</p>
                  <section className="flex gap-2">
                    <p>{data?.status}</p>
                    <div
                      className={`h-2 w-2 rounded-full animate-pulse mt-2 ${
                        data?.status === "possibly_taken"
                          ? "bg-yellow-400"
                          : data?.status === "taken"
                          ? "bg-red-700"
                          : "bg-green-600"
                      }`}
                    ></div>
                  </section>
                </section> */}
              </section>
              <section className="">
                <p className="m-2 text-[0.9rem] mt-3">House Types</p>
                <section className="bg-gray-950 p-2 flex flex-col gap-2">
                  <div className="grid gap-2 text-[0.85rem] ">
                    {Object.entries(data?.units || {})
                      .filter(([_, val]) => val !== null)
                      .map(([unitKey, unitValue]) => {
                        const labelMap = {
                          bedSitter: "Bedsitter",
                          oneBR: "1 Bedroom",
                          twoBR: "2 Bedroom",
                        };
                        console.log(unitKey, unitValue);

                        return (
                          <div
                            key={unitKey}
                            onClick={() => openMpesaModal(unitKey)}
                            className="flex items-center justify-between border-b border-white/10  p-1 rounded-xl pb-1 active:bg-gray-900 "
                          >
                            <div className="text-blue-400 font-medium">
                              {labelMap[unitKey] || unitKey}
                            </div>
                            <div className="text-gray-300 text-right">
                              <span>
                                Ksh {unitValue?.minRent} - {unitValue?.maxRent}
                              </span>
                              <span className="ml-2 text-xs text-gray-400">
                                ({unitValue?.unitsVacant} vacant)
                              </span>
                            </div>
                          </div>
                        );
                      })}
                  </div>
                </section>
              </section>

              {/* <ListText content={data?.landLord?.email}>Email: </ListText> */}
              <section className="">
                <p className="m-2 text-[0.9rem] mt-3">Timestamps</p>
                <section className="bg-gray-950 p-2 flex flex-col gap-2">
                  <div className="flex items-center justify-between">
                    <p>Listed on</p>{" "}
                    <p>{f_2.format(new Date(createdAt.toString()))}</p>
                  </div>

                  <div className="flex justify-between items-center">
                    <p>Last updated on </p>
                    <p
                      className={`${
                        data?.status === "vacant"
                          ? "text-green-500"
                          : data?.status === "taken"
                          ? "text-red-500"
                          : "text-yellow-500"
                      }`}
                    >
                      {f_2.format(new Date(updatedStatusAt.toString()))}{" "}
                    </p>
                  </div>
                  {/* <ul className="text-[0.7rem] list-disc flex flex-col ml-auto mr-auto gap-1 mt-2">
                    <li>
                      Green date, status was updated within a week
                    </li>
                    <li>
                      Yellow date, status was updated more than a week ago
                    </li>
                  </ul> */}
                </section>
              </section>
              <div className="flex flex-col gap-2">
                <p className="m-2 text-[0.9rem] mt-3">{t("Amenities")}</p>
                <div className="flex flex-col p-3 rounded-xl gap-1 bg-gray-950">
                  {Object.keys(amenities).map((amenity, i) => {
                    return (
                      <div className=" flex items-center justify-between">
                        <div className="flex  items-center gap-2">
                          {AmenitiesArray[i]}
                          <p>{amenity} </p>
                        </div>
                        <span className="text-[0.9rem]">
                          {Object.values(amenities)[i] ? (
                            <FaCheckCircle className="text-green-500" />
                          ) : (
                            <FaTimesCircle className="text-gray-500" />
                          )}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </section>
          </section>
          <div className="text-base flex flex-1 items-end justify-center p-4 sticky bottom-0">
            <button>
              <a
                href={data?.googleMapsUrl}
                className="bg-gray-900 p-2 rounded-xl w-20 flex justify-center items-center gap-2"
              >
                {" "}
                <FaMap />
              </a>
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default IndividualHouse;
