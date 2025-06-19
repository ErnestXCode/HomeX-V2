import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import axios from "../api/axios";
import { useSelector } from "react-redux";
import { selectCurrentUser } from "../features/users/userSlice";
import { Link, Navigate, NavLink, useNavigate } from "react-router-dom";
import { FaCamera, FaPenAlt, FaUser } from "react-icons/fa";

const Trials = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const userInfo = useSelector(selectCurrentUser);
  const someFunc = () => {
    navigate("/about-us", {
      // replace: true
    });
  };

  const [moveProfile, setMoveProfile] = useState(false);

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

  const publicKey =
    "BAde7VA6f9OY0ymntvlgviHfBNqUQGWO-q52d_HaXYhEYKPv5uyte8bQBpHjWsttayvnfdpHigsviph_gAlpMp8";

  function urlBase64ToUint8Array(base64String) {
    const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
    const base64 = (base64String + padding)
      .replace(/-/g, "+")
      .replace(/_/g, "/");

    const rawData = atob(base64);
    return new Uint8Array([...rawData].map((char) => char.charCodeAt(0)));
  }

  async function subscribeUserToPush() {
    if (!("serviceWorker" in navigator)) {
      console.warn("Service workers are not supported.");
      return;
    }

    const permission = await Notification.requestPermission();
    if (permission !== "granted") {
      console.warn("Notification permission denied");
      return;
    }

    const registration = await navigator.serviceWorker.ready;

    const existingSubscription =
      await registration.pushManager.getSubscription();
    if (existingSubscription) {
      console.log("Already subscribed:", existingSubscription);
      return existingSubscription;
    }

    const convertedKey = urlBase64ToUint8Array(publicKey);

    try {
      const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: convertedKey,
      });

      console.log("Push subscription:", subscription);
      // TODO: Send subscription to your backend to store

      await axios.post("/", JSON.stringify(subscription), {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${userInfo?.accessToken}`,
        },
        withCredentials: true,
      });

      return subscription;
    } catch (err) {
      console.error("Push subscription failed:", err);
    }
  }

  return (
    <div>
      {t("welcomeMessage")}

      {/* for card status */}
      <span className="flex items-center gap-2">
        <span className="h-2 w-2 rounded-full bg-green-400 animate-pulse"></span>
        <span className="text-white text-sm">Available top right corner</span>
      </span>
      <span className="text-xs px-2 py-0.5 rounded-full bg-green-500 text-white">
        Available
      </span>
      <div
        onClick={subscribeUserToPush}
        className="bg-blue-500 w-fit p-2 m-2 mb-9"
        >
        notifications
      </div>

      <Link
        className="cursor-pointer p-3 bg-red-700 m-3 "
        to="/about-us"
        // state={}
        // reloadDocument
        // not that useful

        // replace
        // inasahau page ilikua na io link....useful for login and signup
        // replaces previous link, back two pages
      >
        About
      </Link>
      <div className="flex flex-col gap-3 p-5">
        <NavLink
          style={({ isActive }) => {
            return {
              color: isActive ? "red" : "blue",
            };
          }}
          to="/trials"
        >
          Home
        </NavLink>
        <NavLink to="/about-us">About</NavLink>
        <NavLink to="/contact-us">Contact Us</NavLink>
        <NavLink to="/profile">Profile</NavLink>
        <h1 onClick={someFunc} className="text-lg text-center p-1 bg-red-800 ">
          Usenavigate
        </h1>
        {/* <Navigate to='/' />  */}
        {/* inakuredirect automatically, usefulll */}
       
      </div>
      <button onClick={() => setMoveProfile(prev => !prev)} className="bg-yellow-700 p-1 m-1 active:scale-1 transition-transform duration-300">
        Transition
      </button>
    </div>
  );
};

export default Trials;
