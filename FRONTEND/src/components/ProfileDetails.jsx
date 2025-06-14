import React, { memo, useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { selectCurrentUser } from "../features/users/userSlice";
import imageCompression from "browser-image-compression";
import axios from "../api/axios";
import { FaCamera, FaPenAlt } from "react-icons/fa";
import Modal from "./Modal";
import CustomForm from "./CustomForm";
import CustomInputBox from "./CustomInputBox";
import SubmitButton from "./SubmitButton";

const ProfileDetails = ({ visibilityRef, profileIsVisible, userName }) => {
  console.log("profileRendered");
 
  const [name, setName] = useState("");
  const [profileImg, setProfileImg] = useState(null);
  const [usernameState, setUsernameState] = useState(false);

  const userInfo = useSelector(selectCurrentUser);

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
      console.group(data);
      setUsernameState(false);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <>
      <div ref={visibilityRef} className="bg-white size-5 rounded-full"></div>
      <section
        className={`  items-center p-4 flex flex-col  justify-center gap-3 transition-all ${
          !profileIsVisible && "duration-700  fixed z-40 top-10 right-0"
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
              className={`absolute bottom-0 right-0 bg-gray-700 p-2 rounded-full ${
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
                className={`absolute bottom-0 right-0 bg-gray-700 p-2 rounded-full ${
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
          <p>{userName}</p>
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
  );
};

export default ProfileDetails;
