import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { selectCurrentUser } from "../features/users/userSlice";
import Header from "../components/Header";
import BottomNav from "../components/BottomNav";
import { Link } from "react-router-dom";
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
import {
  selectCurrentProfile,
  addProfilePic,
} from "../features/stylings/styleSlice";

const apiBaseUrl = import.meta.env.VITE_API_URL;

const Profile = () => {
  console.time('profile')
  
  const userProfile = useSelector(selectCurrentProfile);
  const [scr, setScr] = useState(userProfile);

  // useEffect(() => {
  //   const image = JSON.parse(localStorage.getItem("profileImg"));
  //   if (image) setScr(scr);
  // }, [scr]);

  const userInfo = useSelector(selectCurrentUser);

  const [user, setUser] = useState(null);

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
        setName("");
        setUser(data);
      } catch (err) {
        console.log("error", err);
      }
    };

    handleProfileData();
  }, [userInfo?.accessToken, usernameState]);


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
      setUsernameState(false);
    } catch (err) {
      console.log(err);
    }
  };

  const profileRef = useRef();
  const dispatch = useDispatch();

  const handleProfileImage = () => {
    profileRef.current.click();
  };

  const handleProfileImageChange = (e) => {
    setScr(e.target.files[0]);
    dispatch(addProfilePic(scr));
  };

  const [showProfileImg, setShowProfileImg] = useState(false);
  const handleShowImage = () => {
    if (!scr) return;

    setShowProfileImg(true);
    // dispatch(addProfilePic(scr));
  };

  const showMoreImage = (url) => {
    window.open(url, "_blank");
  };

  const imageRef = useRef();
  console.timeEnd('profile')

  return (
    <>
      {" "}
      <SecondaryHeader>{profileState}</SecondaryHeader>
      <section
        className={
          "items-center p-4 flex flex-col  justify-center gap-3 transition-opacity duration-500"
        }
      >
        <input
          type="file"
          onChange={handleProfileImageChange}
          className="hidden pointer-events-none"
          accept="image/*"
          name=""
          id=""
          ref={profileRef}
        />
        {!scr ? (
          <section className=" bg-gray-800 p-10 rounded-full relative ">
            <div
              onClick={handleProfileImage}
              className="absolute bottom-0 right-0 bg-gray-700 p-2 rounded-full"
            >
              <FaCamera />
            </div>
          </section>
        ) : (
          <>
            <div className="h-20 w-20 rounded-full relative">
              <img
                onClick={handleShowImage}
                src={URL.createObjectURL(scr)}
                alt=""
                className="w-full h-full rounded-full object-cover"
              />
              <div
                onClick={handleProfileImage}
                className="absolute bottom-0 right-0 bg-gray-700 p-2 rounded-full"
              >
                <FaCamera />
              </div>
            </div>

            <Modal
              isOpen={showProfileImg}
              onClick={() => setShowProfileImg(false)}
            >
              
                <img
                  onClick={() => showMoreImage(URL.createObjectURL(scr))}
                  className="w-full h-64 object-cover"
                  src={URL.createObjectURL(scr)}
                />
            
            </Modal>
          </>
        )}

        <section className="flex items-center gap-3">
          <p>{user?.name}</p>
          <section className="text-white/70 flex">
            <div
              onClick={() => {
                setUsernameState(true);
                imageRef.current.focus();
              }}
            >
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
                  inputRef={imageRef}
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
            className={`cursor-pointer text-white/50 transition-all duration-300 ${
              profileState === "info" && "text-white/100 font-semibold"
            }`}
            onClick={() => setProfileState("info")}
          >
            Info
          </li>
          <li
            className={`cursor-pointer text-white/50 transition-all duration-300 ${
              profileState === "shortlist" && "text-white/100 font-semibold"
            }`}
            onClick={() => setProfileState("shortlist")}
          >
            Shortlists
          </li>
          <li
            className={`cursor-pointer text-white/50 transition-all duration-300 ${
              profileState === "posts" && "text-white/100 font-semibold"
            }`}
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
