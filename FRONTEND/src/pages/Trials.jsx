// import React, { useState } from "react";
// import { useTranslation } from "react-i18next";
// import axios from "../api/axios";
// import { useSelector } from "react-redux";
// import { selectCurrentUser } from "../features/users/userSlice";
// import { Link, Navigate, NavLink, useNavigate } from "react-router-dom";
// import { motion } from "framer-motion";
import PayButton from "../components/PayButton";
import { useState } from "react";
import Select from "react-select";
import { Dialog } from "@headlessui/react";


const houseTypeOptions = [
  { value: "Bedsitter", label: "Bedsitter" },
  { value: "1 Bedroom", label: "1 Bedroom" },
  { value: "2 Bedroom", label: "2 Bedroom" },
  { value: "3 Bedroom", label: "3 Bedroom" },
];

const Trials = () => {

  const [selectedTypes, setSelectedTypes] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [stepIndex, setStepIndex] = useState(0);
  const [typeDetails, setTypeDetails] = useState({});
  const [formData, setFormData] = useState({ min: "", max: "", units: "" });

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

  return (
    <div className="p-4 max-w-md mx-auto">
      <label className="block text-white mb-2">Select House Types</label>
      <Select
        isMulti
        options={houseTypeOptions}
        value={selectedTypes}
        onChange={handleTypeChange}
        className="mb-4 text-black"
      />

      <button
        onClick={openModal}
        disabled={selectedTypes.length === 0}
        className="bg-blue-600 text-white px-4 py-2 rounded"
      >
        Next
      </button>

      <Dialog open={modalOpen} onClose={() => setModalOpen(false)} className="relative z-50">
        <div className="fixed inset-0 bg-black/50" aria-hidden="true" />
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Dialog.Panel className="bg-white rounded p-6 w-full max-w-sm">
            <Dialog.Title className="text-lg font-bold mb-4 text-black">
              {`Enter Details for ${currentLabel}`}
            </Dialog.Title>

            <div className="space-y-3 text-black">
              <input
                type="number"
                placeholder="Minimum Rent"
                value={formData.min}
                onChange={(e) => setFormData({ ...formData, min: e.target.value })}
                className="w-full px-3 py-2 border rounded"
              />
              <input
                type="number"
                placeholder="Maximum Rent"
                value={formData.max}
                onChange={(e) => setFormData({ ...formData, max: e.target.value })}
                className="w-full px-3 py-2 border rounded"
              />
              <input
                type="number"
                placeholder="Units Available"
                value={formData.units}
                onChange={(e) => setFormData({ ...formData, units: e.target.value })}
                className="w-full px-3 py-2 border rounded"
              />
            </div>

            <button
              onClick={handleContinue}
              className="mt-5 w-full bg-blue-600 text-white py-2 rounded"
            >
              {stepIndex + 1 === selectedTypes.length ? "Finish" : "Continue"}
            </button>
          </Dialog.Panel>
        </div>
      </Dialog>
    </div>
  );
  // const { t } = useTranslation();
  // const navigate = useNavigate();
  // const userInfo = useSelector(selectCurrentUser);
  // const someFunc = () => {
  //   navigate("/about-us", {
  //     // replace: true
  //   });
  // };

  // const [moveProfile, setMoveProfile] = useState(false);

  // const urlBase64ToUint8Array = (base64String) => {
  //   const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  //   const base64 = (base64String + padding)
  //     .replace(/-/g, "+")
  //     .replace(/_/g, "/");

  //   const rawData = atob(base64);

  //   const outputArray = new Uint8Array(rawData.length);

  //   for (let i = 0; i < rawData.length; ++i) {
  //     outputArray[i] = rawData.charCodeAt(i);
  //   }
  //   return outputArray;
  // };

  // const publicKey =
  //   "BAde7VA6f9OY0ymntvlgviHfBNqUQGWO-q52d_HaXYhEYKPv5uyte8bQBpHjWsttayvnfdpHigsviph_gAlpMp8";

  // function urlBase64ToUint8Array(base64String) {
  //   const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  //   const base64 = (base64String + padding)
  //     .replace(/-/g, "+")
  //     .replace(/_/g, "/");

  //   const rawData = atob(base64);
  //   return new Uint8Array([...rawData].map((char) => char.charCodeAt(0)));
  // }

  // async function subscribeUserToPush() {
  //   if (!("serviceWorker" in navigator)) {
  //     console.warn("Service workers are not supported.");
  //     return;
  //   }

    // const permission = await Notification.requestPermission();
    // if (permission !== "granted") {
    //   console.warn("Notification permission denied");
    //   return;
    // }

    // const registration = await navigator.serviceWorker.ready;

  //   const existingSubscription =
  //     await registration.pushManager.getSubscription();
  //   if (existingSubscription) {
  //     console.log("Already subscribed:", existingSubscription);
  //     return existingSubscription;
  //   }

  //   const convertedKey = urlBase64ToUint8Array(publicKey);

  //   try {
  //     const subscription = await registration.pushManager.subscribe({
  //       userVisibleOnly: true,
  //       applicationServerKey: convertedKey,
  //     });

  //     console.log("Push subscription:", subscription);
  //     // TODO: Send subscription to your backend to store

  //     await axios.post("/", JSON.stringify(subscription), {
  //       headers: {
  //         "Content-Type": "application/json",
  //         Authorization: `Bearer ${userInfo?.accessToken}`,
  //       },
  //       withCredentials: true,
  //     });

  //     return subscription;
  //   } catch (err) {
  //     console.error("Push subscription failed:", err);
  //   }
  // }

  // return <PayButton />
  // (
  //   <div>
  //     {t("welcomeMessage")}

  //     {/* for card status */}
  //     <span className="flex items-center gap-2">
  //       <span className="h-2 w-2 rounded-full bg-green-400 animate-pulse"></span>
  //       <span className="text-white text-sm">Available top right corner</span>
  //     </span>
  //     <span className="text-xs px-2 py-0.5 rounded-full bg-green-500 text-white">
  //       Available
  //     </span>
  //     <div
  //       onClick={subscribeUserToPush}
  //       className="bg-blue-500 w-fit p-2 m-2 mb-9"
  //     >
  //       notifications
  //     </div>

  //     <Link
  //       className="cursor-pointer p-3 bg-red-700 m-3 "
  //       to="/about-us"
  //       // state={}
  //       // reloadDocument
  //       // not that useful

  //       // replace
  //       // inasahau page ilikua na io link....useful for login and signup
  //       // replaces previous link, back two pages
  //     >
  //       About
  //     </Link>
  //     {/* <Navigate to='/' />  */}
  //     {/* inakuredirect automatically, usefulll */}

  //     <motion.button
  //       animate={{
  //         scale: "1.5",
  //         rotate: 180
  //       }}
  //       onClick={() => setMoveProfile((prev) => !prev)}
  //       className="bg-yellow-700 p-1 m-1 active:scale-1 transition-transform duration-300"
  //     >
  //       Transition
  //     </motion.button>
  //     <motion.h2 animate={{ fontSize: "20px", color: "red", x: "200px" }}>
  //       FRMAER MOTION STUFF
  //     </motion.h2>
      
  //   </div>
  // );
};

export default Trials;
