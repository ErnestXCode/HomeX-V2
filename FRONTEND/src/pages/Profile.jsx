import React, { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { selectCurrentUser } from "../features/users/userSlice";
import Header from "../components/Header";
import BottomNav from "../components/BottomNav";
import { Link, useNavigate } from "react-router-dom";
import SubmitButton from "../components/SubmitButton";
import RecentlyLiked from "./RecentlyLiked";
import Posts from "./Posts";

import ProfileButton from "../components/ProfileButtons";
import {
  FaBookmark,
  FaCamera,
  FaCreditCard,
  FaDigitalTachograph,
  FaHandsHelping,
  FaMoneyBillAlt,
  FaPenAlt,
  FaTeamspeak,
  FaToolbox,
  FaUser,
} from "react-icons/fa";
import Modal from "../components/Modal";
import CustomForm from "../components/CustomForm";
import CustomInputBox from "../components/CustomInputBox";
import SecondaryHeader from "../components/SecondaryHeader";
import axios from "../api/axios";

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
  const [usernameState, setUsernameState] = useState(false);
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
        setName('')
        setUser(data);
      } catch (err) {
        console.log("error", err);
      }
    };

    handleProfileData();
  }, [userInfo?.accessToken, usernameState]);

  // const secureEmail = (email) => {
  //   const emailDomain = email.split(".")[1];
  //   const hiddenEmailBody = email.slice(0, 3) + "****." + emailDomain;
  //   return hiddenEmailBody;
  // };

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
  const [profileState, setProfileState] = useState("info");
  const [name, setName] = useState("");

  const handleChange = (e) => {
    setName(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.put(
        "/profile",
        { name },
        {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${userInfo?.accessToken}`,
          },
        }
      );
      const data = response.data;
      console.group(data);
      setUsernameState(false)
      
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <>
      {" "}
      <SecondaryHeader>{profileState}</SecondaryHeader>
      <section
        className={
          "items-center p-4 flex flex-col  justify-center gap-3 transition-opacity duration-500"
        }
      >
        <section className=" bg-gray-700 p-10 rounded-full relative">
          <div className="absolute bottom-0 right-0 bg-gray-500 p-2 rounded-full">
            <FaCamera />
          </div>
        </section>

        <section className="flex items-center gap-3">
          <p>{user?.name}</p>
          <section className="text-white/70">
            <div onClick={() => setUsernameState(true)}>
              <div className="flex  gap-2 items-center">
                <FaPenAlt />
              </div>
            </div>
            <Modal
              isOpen={usernameState}
              onClick={() => setUsernameState(false)}
            >
              <CustomForm onSubmit={(e) => handleSubmit(e)}>
                <CustomInputBox
                  name={"name"}
                  value={name}
                  onChange={(e) => handleChange(e)}
                  type={"text"}
                  id={"name"}
                >
                  Enter new username
                </CustomInputBox>
                <SubmitButton>Set new username</SubmitButton>
              </CustomForm>
            </Modal>
          </section>
        </section>
      </section>
      <nav className="sticky top-0 bg-black z-30 p-2">
        <ul className="flex items-center justify-around p-2">
          <li
            className="cursor-pointer"
            onClick={() => setProfileState("info")}
          >
            Info
          </li>
          <li
            className="cursor-pointer"
            onClick={() => setProfileState("shortlist")}
          >
            Shortlists
          </li>
          <li
            className="cursor-pointer"
            onClick={() => setProfileState("posts")}
          >
            Posts
          </li>
        </ul>
      </nav>
      {profileState === "info" ? (
        <>
          <section className="bg-black flex flex-col pb-10 ">
            <section
              ref={visibilityRef}
              className=" flex flex-col items-start bg-gray-950 
        p-3 m-3 rounded-2xl gap-3
        "
            >
              <ProfileButton link={"/admin"}>
                <div className="flex  gap-2 items-center">
                  <FaDigitalTachograph />
                  Admin Dashboard
                </div>
              </ProfileButton>

              <ProfileButton link={"/personal"}>
                <div className="flex  gap-2 items-center">
                  <FaUser />
                  Personal information
                </div>
              </ProfileButton>
              {/* they can add more information KYC*/}

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
              <ProfileButton link={"/help"}>
                <div className="flex gap-2 items-center">
                  <FaHandsHelping />
                  Help
                </div>
              </ProfileButton>
              {/* modal or link */}

              {/* <ViewButton white={true} onClick={() => handleDelete()}>
              Delete Account
            </ViewButton> */}
            </section>
          </section>
          <BottomNav />
        </>
      ) : profileState === "shortlist" ? (
        <RecentlyLiked />
      ) : (
        <Posts />
      )}
    </>
  );
};

export default Profile;
