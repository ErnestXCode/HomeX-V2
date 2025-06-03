import React, { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { selectCurrentUser } from "../features/users/userSlice";
import Header from "../components/Header";
import BottomNav from "../components/BottomNav";
import { Link, useNavigate } from "react-router-dom";
import SubmitButton from "../components/SubmitButton";

import ProfileButton from "../components/ProfileButtons";
import {
  FaBookmark,
  FaCreditCard,
  FaDigitalTachograph,
  FaMoneyBillAlt,
  FaPenAlt,
  FaTeamspeak,
  FaToolbox,
  FaUser,
} from "react-icons/fa";
import Modal from "../components/Modal";
import CustomForm from "../components/CustomForm";
import CustomInputBox from "../components/CustomInputBox";

const apiBaseUrl = import.meta.env.VITE_API_URL;

const Profile = () => {
  const userInfo = useSelector(selectCurrentUser);

  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const handleLogout = async () => {
    try {
      const res = await fetch(`${apiBaseUrl}/logout`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      });
      await res.json();
      // dispatch(signInSuccess(null));
      navigate("/");
    } catch (err) {
      console.log(err);
    }
  };

  // const handleDelete = async () => {
  //   try {
  //     const res = await fetch(`${apiBaseUrl}/profile`, {
  //       method: "DELETE",
  //       headers: {
  //         "Content-Type": "application/json",
  //         Authorization: `Bearer ${userInfo?.accessToken}`,
  //       },
  //       credentials: "include",
  //     });
  //     await res.json();
  //     // dispatch(signInSuccess(null));
  //     navigate("/");
  //   } catch (err) {
  //     console.log(err);
  //   }
  // };
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
        console.log(data.shortLists);
        setUser(data);
      } catch (err) {
        console.log("error", err);
      }
    };

    handleProfileData();
  }, [userInfo?.accessToken]);

  // const secureEmail = (email) => {
  //   const emailDomain = email.split(".")[1];
  //   const hiddenEmailBody = email.slice(0, 3) + "****." + emailDomain;
  //   return hiddenEmailBody;
  // };

  const [usernameState, setUsernameState] = useState(false);
  const [passwordState, setPasswordState] = useState(false);
  // const [visibilityState, setVisibilityState] = useState(true);
  const visibilityRef = useRef();

  // useEffect(() => {
  //   const observer = new IntersectionObserver((entries) => {
  //     if (!entries[0].isIntersecting) {
  //       setVisibilityState(false);
  //       console.log("intersecting");
  //     } else {
  //       setVisibilityState(true);
  //     }
  //   });
  //   observer.observe(visibilityRef.current);
  // });

  return (
    <>
      <section className="bg-black flex flex-col pb-10 ">
        <Header />
        <section
          className={
            "items-center p-4 flex flex-col  justify-center gap-3 transition-opacity duration-500"
          }
        >
          <div className=" bg-gray-700 p-10 rounded-full"></div>
          <p>{user?.name}</p>
        </section>

        <section
          ref={visibilityRef}
          className=" flex flex-col items-start bg-gray-950 
        p-3 m-3 rounded-2xl gap-3
        "
        >
          {user?.isAdmin && (
            <ProfileButton link={"/admin"}>
              <div className="flex  gap-2 items-center">
                <FaDigitalTachograph />
                Admin Dashboard
              </div>
            </ProfileButton>
          )}
          <ProfileButton link={"/liked"}>
            <div className="flex  gap-2 items-center">
              <FaBookmark />
              Shortlist
            </div>
          </ProfileButton>
          <ProfileButton link={"/landlord-posts"}>
            <div className="flex  gap-2 items-center">
              <FaToolbox />
              Created
            </div>
          </ProfileButton>

          <ProfileButton link={"/personal"}>
            <div className="flex  gap-2 items-center">
              <FaUser />
              Personal information
            </div>
          </ProfileButton>
          {/* they can add more information KYC*/}

          <div onClick={() => setUsernameState(true)} className=" w-full">
            <ProfileButton>
              <div className="flex  gap-2 items-center">
                <FaPenAlt />
                Change username
              </div>
            </ProfileButton>
          </div>
          <Modal isOpen={usernameState} onClick={() => setUsernameState(false)}>
            <CustomForm>
              <CustomInputBox>Enter new username</CustomInputBox>
              <SubmitButton>Set new username</SubmitButton>
            </CustomForm>
          </Modal>

          <div onClick={() => setPasswordState(true)} className=" w-full">
            <ProfileButton>
              <div className="flex  gap-2 items-center">
                <FaCreditCard />
                Change Password
              </div>
            </ProfileButton>
          </div>
          <Modal isOpen={passwordState} onClick={() => setPasswordState(false)}>
            <CustomForm>
              <CustomInputBox>Enter old password</CustomInputBox>
              <CustomInputBox>Enter new password</CustomInputBox>
              <CustomInputBox>Confirm new password</CustomInputBox>
              <SubmitButton>Set new password</SubmitButton>
            </CustomForm>
          </Modal>

          {/* modal */}
          <ProfileButton link={"/about-us"}>
            <div className="flex  gap-2 items-center">
              <FaTeamspeak />
              About us
            </div>
          </ProfileButton>
          <ProfileButton link={"/donate"}>
            <div className="flex  gap-2 items-center">
              <FaMoneyBillAlt />
              Donate
            </div>
          </ProfileButton>
          <ProfileButton link={"/contact-us"}>
            <div className="flex gap-2 items-center">
              <FaUser />
              Contact us
            </div>
          </ProfileButton>
          {/* modal or link */}

          <button
            className="w-full bg-blue-600/80 p-2 rounded-2xl text-white text-base font-semibold mt-4"
            onClick={handleLogout}
          >
            Log out
          </button>
          {/* <ViewButton white={true} onClick={() => handleDelete()}>
              Delete Account
            </ViewButton> */}
        </section>
      </section>
      <BottomNav />
    </>
  );
};

export default Profile;
