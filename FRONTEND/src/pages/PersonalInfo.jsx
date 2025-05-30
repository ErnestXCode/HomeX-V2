
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { logOutUser, selectCurrentUser } from "../features/users/userSlice";
import Header from "../components/Header";
import BottomNav from "../components/BottomNav";
import ViewButton from "../components/ViewButton";
import { Link, useNavigate } from "react-router-dom";
import SubmitButton from "../components/SubmitButton";
import ProfileButtons from "../components/ProfileButtons";

import ProfileButton from "../components/ProfileButtons";
import { FaAngleRight, FaCreditCard, FaDigitalTachograph, FaHeart, FaMoneyBillAlt, FaPenAlt, FaTeamspeak, FaUser } from "react-icons/fa";
const apiBaseUrl = import.meta.env.VITE_API_URL;

const PersonalInfo = () => {
  const userInfo = useSelector(selectCurrentUser)
  const [user, setUser] = useState()
    useEffect(() => {
      const handleProfileData = async () => {
        try {
  
          const response = await fetch(`${apiBaseUrl}/profile`, {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${userInfo?.accessToken}`,
            },
            credentials: "include",
          });
  
          const data = await response.json();
          console.log(data.shortLists)
          setUser(data);
        } catch (err) {
          console.log("error", err);
        }
      };
  
      handleProfileData();
    }, [userInfo?.accessToken]);
  return (
    <>
      <section className="bg-black flex flex-col pb-10 ">
        <Header />
        {/* use svg in the profile pic */}
        <section className="flex flex-col bg-gray-950 items-center m-4 mt-1 p-2">
          <div
            // src={profilePic}
            alt=""
            width={40}
            className="rounded-full size-20 bg-gray-600  m-2"
          ></div>
          <section className=" mt-3 flex-1 ">
            <p className=" mb-4 font-semibold">
               {user?.isAdmin ? "Admin" : ""} {user?.name}
            </p>


            {/* <p className="text-blue-400 font-semibold ">
              Phone number:{" "}
              <span className="text-white font-normal font-serif ">
                {user?.phoneNumber}
              </span>
            </p> */}
          </section>
        </section>
       <section className="flex flex-col ">
        <p>name: {user?.name} </p>
        <br />
        <p>Role: {user?.isAdmin ? 'Admin': user.isLandlord ? 'Landlord' : 'Tenant'}</p>
        <br />
        <p>Phone number: {user?.phoneNumber}</p>
        <div className="flex justify between items-center w-full"><p>add phone number</p> <FaAngleRight /></div>
        <br />
        <p>email: {user?.email} </p>
        <p>Add email <FaAngleRight /></p>

     
       

       </section>
      </section>
      <BottomNav />
    </>
  );
};

export default PersonalInfo;

