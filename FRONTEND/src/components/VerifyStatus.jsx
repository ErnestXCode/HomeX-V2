import React, { useState, useEffect, useRef } from "react";
import CustomForm from "./CustomForm";
import CustomInputBox from "./CustomInputBox";
import SecondaryHeader from "./SecondaryHeader";
import SubmitButton from "./SubmitButton";
import { useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectCurrentUser } from "../features/users/userSlice";
import CustomCheckBox from "./CustomCheckBox";
import BottomNav from "./BottomNav";
import axios from "../api/axios";
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
import EXIF from "exif-js";
import { useTranslation } from "react-i18next";
import Select from "react-select";
import { Dialog } from "@headlessui/react";
import { useMutation, useQueryClient } from "@tanstack/react-query";

const houseTypeOptions = [
  { value: "Bedsitter", label: "Bedsitter" },
  { value: "1 Bedroom", label: "1 Bedroom" },
  { value: "2 Bedroom", label: "2 Bedroom" },
];

const VerifyStatus = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { t } = useTranslation();
  const currentUser = useSelector(selectCurrentUser);
  const userInfo = useSelector(selectCurrentUser);

  const [selectedTypes, setSelectedTypes] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [stepIndex, setStepIndex] = useState(0);
  const [typeDetails, setTypeDetails] = useState({});
  const [formData, setFormData] = useState({ min: "", max: "", units: "" });
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [inputData, setInputData] = useState({
    plotName: "",
    area: "",
    pricing: "",
    numOfHouses: "",
  });

  const amenitiesObj = {
    wifi: false,
    water: false,
    bathroom: false,
    shower: false,
    security: false,
    electricity: false,
  };

  const [amenities, setAmenities] = useState(amenitiesObj);
  const plotNameRef = useRef();
  const queryClient = useQueryClient();

  useEffect(() => {
    if (step === 0) plotNameRef?.current?.focus();
  }, [step]);

  const handleChange = (e) => {
    setInputData((prevData) => ({
      ...prevData,
      [e.target.name]: e.target.value,
    }));
  };

  const handleCheckBoxChange = (e) => {
    setAmenities((prev) => ({
      ...prev,
      [e.target.value]: e.target.checked,
    }));
  };

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
    }
  };

  const { mutate: submitForm } = useMutation({
    mutationFn: async () => {
      const form = new FormData();
      form.append("plotName", inputData?.plotName);
      form.append("typeData", JSON.stringify(typeDetails));
      form.append("amenities", JSON.stringify(amenities));

      return axios.put(`/houses/${id}`, form, {
        withCredentials: true,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${userInfo?.accessToken}`,
        },
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["houses"] });
      queryClient.invalidateQueries({ queryKey: ["landlordPosts"] });
      navigate("/");
    },
    onError: (error) => {
      console.error("Update failed:", error);
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (step !== 1) {
      setStep((prev) => prev + 1);
      return;
    }
    submitForm(); // ✅ now uses react-query mutation
  };

  const AmenitiesArray = [
    <FaWifi />,
    <FaWater />,
    <FaToilet />,
    <FaShower />,
    <FaDog />,
    <FaLightbulb />,
  ];

  const currentLabel = selectedTypes[stepIndex]?.label;

  return (
    <section className="pb-10">
      <SecondaryHeader>Update Listing</SecondaryHeader>
      <CustomForm onSubmit={handleSubmit}>
        {step === 0 ? (
          <>
            <CustomInputBox
              id="plotName"
              inputRef={plotNameRef}
              value={inputData.plotName}
              name="plotName"
              type="text"
              onChange={handleChange}
            >
              Plot Name
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
                className="bg-blue-600 text-white px-4 py-2 rounded text-center cursor-pointer"
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
                    <Dialog.Title className="text-lg font-bold mb-4">
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
        ) : (
          <>
            <label className="text-center">{t("Amenities")}</label>
            <div className="flex flex-col gap-2 p-3 ml-5">
              {Object.keys(amenities).map((amenity, i) => (
                <CustomCheckBox
                  key={i}
                  onChange={handleCheckBoxChange}
                  id={amenity}
                  name={amenity}
                  value={amenity}
                  type="checkbox"
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

        <div className="mt-3">
          <SubmitButton isDisabled={loading}>
            {step === 1 ? "Update" : "Next"}
          </SubmitButton>
        </div>
      </CustomForm>
    </section>
  );
};

export default VerifyStatus;
