import React, { lazy, Suspense, useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { selectCurrentUser } from "../features/users/userSlice";
import BottomNav from "../components/BottomNav";
import imageCompression from "browser-image-compression";

const RecentlyLiked = lazy(() => import("./RecentlyLiked"));
const Posts = lazy(() => import("./Posts"));

import ProfileButton from "../components/ProfileButtons";
// import ProfileInfoContent from "../components/ProfileInfoContent ";

import SecondaryHeader from "../components/SecondaryHeader";
import ProfileDetails from "../components/ProfileDetails";
import ProfileInfoContent from "../components/ProfileInfoContent";
import { Link } from "react-router-dom";
import InitialLoader from "../components/InitialLoader";
import axios from "../api/axios";
import { FaCamera, FaEdit, FaPenAlt, FaUser } from "react-icons/fa";
import CustomInputBox from "../components/CustomInputBox";
import CustomForm from "../components/CustomForm";
import Modal from "../components/Modal";
import SubmitButton from "../components/SubmitButton";
import { t } from "i18next";

const apiBaseUrl = import.meta.env.VITE_API_URL;

const Profile = () => {
  const [profileIsVisible, setProfileIsVisible] = useState(false);

  const userInfo = useSelector(selectCurrentUser);

  const [name, setName] = useState("");
  const [profileImg, setProfileImg] = useState(null);
  const [usernameState, setUsernameState] = useState(false);
  const [user, setUser] = useState(null);

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
        console.log(data);
        setUser(data);
      } catch (err) {
        console.log("error", err);
      }
    };

    handleProfileData();
  }, [userInfo?.accessToken, usernameState]);

  // const [visibilityState, setVisibilityState] = useState(true);
  const visibilityRef = useRef();

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      if (!entries[0]?.isIntersecting) {
        setProfileIsVisible(true);
        console.log("intersecting");
      } else {
        setProfileIsVisible(false);
      }
    });
    observer.observe(visibilityRef?.current);
  });
  const [profileState, setProfileState] = useState("info");

  // why is it working when profile image is not a url

  const profileRef = useRef();

  const handleProfileImage = () => {
    profileRef.current.click();
  };

  useEffect(() => {
    const stored = localStorage.getItem("profileImage");
    if (stored) setProfileImg(stored);
  }, []);
  const handleProfileImageChange = async (e) => {
    const file = e.target.files[0];
    const options = { maxSizeMB: 0.2, maxWidthOrHeight: 300 };
    const compressed = await imageCompression(file, options);

    const reader = new FileReader();
    reader.onloadend = () => {
      localStorage.setItem("profileImage", reader.result); // base64 string
      setProfileImg(reader.result);
    };
    reader.readAsDataURL(compressed);
  };

  const [showProfileImg, setShowProfileImg] = useState(false);
  const handleShowImage = () => {
    if (!profileImg) return;

    setShowProfileImg(true);
    // dispatch(addProfilePic(profileImg));
  };

  const showMoreImage = (url) => {
    window.open(url, "_blank");
  };

  const userNameRef = useRef();

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
      console.log(data);
      setUsernameState(false);
    } catch (err) {
      console.log(err);
    }
  };
console.log(showProfileImg)
  return (
    <>
      {" "}
      <SecondaryHeader>{profileState}</SecondaryHeader>
      <>
        <div ref={visibilityRef} className=""></div>
        <div className='z-60'>

          <Modal
                // isOpen={showProfileImg}
                // onClick={() => setShowProfileImg(false)}
                // Profile={true}
              >
                <div className="bg-gray-950 flex flex-col justify-center items-center gap-3 p-4 rounded-2xl">
                  <img
                    className="w-50 h-50 object-cover rounded-full"
                    src={profileImg}
                  />
                  <section className="flex  items-center gap-2">
                    <p>{user?.name}</p>
                  </section>
                </div>
              </Modal>
              </div>
        <section
          className={`   p-4 flex flex-col items-center justify-center gap-3 sticky top-15
            transition-transform duration-500
            ${profileIsVisible && "z-70 scale-y-25 scale-x-15 translate-x-5/12 translate-y-[-70px]"}
            
            
            `}
            // complex stuff in there up 
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
          {profileImg === null ? (
            //
            <div
              className={`bg-gray-900 p-4 h-20 w-20 flex flex-col items-center rounded-full relative transition-all duration-500

          ${profileIsVisible && "translate-x-40"}
          `}
            >
              <FaUser
                className="h-full w-full text-gray-500 *:
            
            
            "
              />
              <div
                onClick={handleProfileImage}
                className={`absolute bottom-0 right-0 bg-gray-900 p-2 rounded-full transition-opacity duration-500
                  ${profileIsVisible && "opacity-0"}

              `}
              >
                <FaCamera className=" " />
              </div>
            </div>
          ) : (
            <>
              <div
                className={`bg-gray-900 size-20 mt-8  rounded-full relative transition-all duration-500

          ${profileIsVisible && "scale-x-300 scale-y-180"}`}
              >
                <img
                  onClick={handleShowImage}
                  src={profileImg}
                  alt=""
                  className="w-full h-full rounded-full object-cover"
                />
                <div
                  onClick={handleProfileImage}
                  className={`absolute bottom-0 right-0 bg-gray-900 p-2 rounded-full transition-opacity duration-500
                  ${profileIsVisible && "opacity-0 pointer-events-none"}

              `}
                >
                  <FaCamera className=" " />
                </div>
              </div>

            
            </>
          )}

          {/* flex */}
          <section
            className={`flex items-center gap-3 
              ${profileIsVisible && "opacity-0 pointer-events-none"}
            `}
          >
            <p>{user?.name}</p>
            <section className="text-white/70 flex">
              <div
                onClick={() => {
                  setUsernameState(true);
                  userNameRef.current.focus();
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
                    inputRef={userNameRef}
                    name={"name"}
                    value={name}
                    onChange={(e) => handleChange(e)}
                    type={"text"}
                    id={"name"}
                  >
                    {t("EnterNewUsername")}
                  </CustomInputBox>
                  <SubmitButton>{t("SetNewUsername")}</SubmitButton>
                </CustomForm>
              </Modal>
            </section>
          </section>
        </section>
      </>
      <nav className="sticky top-0 bg-black z-30 p-2">
        <ul className="flex items-center justify-around p-2">
          <li
            className={`cursor-pointer text-white/50 transition-all ${
              profileState === "info" && "text-white/100 font-semibold"
            }`}
            onClick={() => setProfileState("info")}
          >
            Info
          </li>
          <li
            className={`cursor-pointer text-white/50 transition-all ${
              profileState === "shortlist" && "text-white/100 font-semibold"
            }`}
            onClick={() => setProfileState("shortlist")}
          >
            {t("Shortlists")}
          </li>
          <li
            className={`cursor-pointer text-white/50 transition-all ${
              profileState === "posts" && "text-white/100 font-semibold"
            }`}
            onClick={() => setProfileState("posts")}
          >
            {t("Posts")}
          </li>
        </ul>
      </nav>
      {profileState === "info" ? (
        <ProfileInfoContent />
      ) : profileState === "shortlist" ? (
        <Suspense fallback={<InitialLoader notFullPage={true} />}>
          <RecentlyLiked />
        </Suspense>
      ) : (
        <Suspense fallback={<InitialLoader notFullPage={true} />}>
          <Posts />
        </Suspense>
      )}
    </>
  );
};

export default Profile;
