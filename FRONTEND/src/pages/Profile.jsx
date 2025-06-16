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
import { FaCamera, FaPenAlt } from "react-icons/fa";
import CustomInputBox from "../components/CustomInputBox";
import CustomForm from "../components/CustomForm";
import Modal from "../components/Modal";
import SubmitButton from "../components/SubmitButton";

const apiBaseUrl = import.meta.env.VITE_API_URL;

const Profile = () => {
  const [profileIsVisible, setProfileIsVisible] = useState(true);

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
        setProfileIsVisible(false);
        console.log("intersecting");
      } else {
        setProfileIsVisible(true);
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

  return (
    <>
      {" "}
      <SecondaryHeader>{profileState}</SecondaryHeader>
      <>
        <div ref={visibilityRef} className=""></div>
        <section
          className={`  items-center p-4 flex flex-col  justify-center gap-3 transition-all duration-300  ${
            !profileIsVisible && " fixed z-40 top-10 right-0"
          } `}
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
            <section
              className={`bg-gray-800  rounded-full relative ${
                profileIsVisible ? "p-10" : "size-10"
              }`}
            >
              <div
                onClick={handleProfileImage}
                className={`absolute bottom-0 right-0 bg-gray-700 p-2 rounded-full duration-300  ${
                  !profileIsVisible && "opacity-0 pointer-events-none"
                }`}
              >
                <FaCamera />
              </div>
            </section>
          ) : (
            <>
              <div
                className={`rounded-full relative ${
                  profileIsVisible ? "h-20 w-20 " : "h-10 w-10"
                }`}
              >
                <img
                  onClick={handleShowImage}
                  src={profileImg}
                  alt=""
                  className="w-full h-full rounded-full object-cover"
                />
                <div
                  onClick={handleProfileImage}
                  className={`absolute bottom-0 right-0 bg-gray-700 p-2 rounded-full duration-300  ${
                    !profileIsVisible && "opacity-0 pointer-events-none"
                  }`}
                >
                  <FaCamera />
                </div>
              </div>

              <Modal
                isOpen={showProfileImg}
                onClick={() => setShowProfileImg(false)}
              >
                <img
                  onClick={() => showMoreImage(profileImg)}
                  className="w-full h-64 object-cover"
                  src={profileImg}
                  // src={profileImg}
                />
              </Modal>
            </>
          )}

          {/* flex */}
          <section
            className={`flex items-center gap-3 ${
              !profileIsVisible && "opacity-0 pointer-events-none"
            }`}
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
                    Enter new username
                  </CustomInputBox>
                  <SubmitButton>Set new username</SubmitButton>
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
            Shortlists
          </li>
          <li
            className={`cursor-pointer text-white/50 transition-all ${
              profileState === "posts" && "text-white/100 font-semibold"
            }`}
            onClick={() => setProfileState("posts")}
          >
            Posts
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
      <BottomNav />
    </>
  );
};

export default Profile;
