import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { selectCurrentUser } from "../features/users/userSlice";
import Header from "../components/Header";
import BottomNav from "../components/BottomNav";
import ViewButton from "../components/ViewButton";
import { Link } from "react-router-dom";
import {
  FaAngleRight,
  FaCreditCard,
  FaDigitalTachograph,
  FaHeart,
  FaMoneyBillAlt,
  FaPenAlt,
  FaTeamspeak,
  FaUser,
} from "react-icons/fa";
import ProfileButton from "../components/ProfileButtons";
import Modal from "../components/Modal";
import CustomForm from "../components/CustomForm";
import CustomInputBox from "../components/CustomInputBox";
import SubmitButton from "../components/SubmitButton";
import SecondaryHeader from "../components/SecondaryHeader";
import axios from "../api/axios";
const apiBaseUrl = import.meta.env.VITE_API_URL;

const PersonalInfo = () => {
  const userInfo = useSelector(selectCurrentUser);
  const [user, setUser] = useState();
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

  const [passwordStateStage1, setPasswordStateStage1] = useState(false);
  const [passwordStateStage2, setPasswordStateStage2] = useState(false);
  const [passwordStateStage3, setPasswordStateStage3] = useState(false);

  const passwordObj = {
    oldPassword: "",
    newPassword: "",
    confirmNewPassword: "",
  };

  const [passwordChange, setPasswordChange] = useState(passwordObj);

  const handleChange = (e) => {
    setPasswordChange((prevPass) => {
      return {
        ...prevPass,
        [e.target.name]: e.target.value,
      };
    });
  };

  const handleOldPassword = (e) => {
    e.preventDefault();
    setPasswordStateStage1(false);
    setPasswordStateStage2(true);
    // make sure it exists in the database before proceeding later
  };
  const handleNewPassword = (e) => {
    e.preventDefault();
    setPasswordStateStage2(false);
    setPasswordStateStage3(true);
  };

  const handleConfirmNewPassword = async(e) => {
    e.preventDefault();
    // confirm passwords match here

    
console.log(passwordChange)
    try {
      const response = await axios.put('/profile', {...passwordChange}, {
        withCredentials: true,
        headers: {
          'Content-Type': 'application/json', 
          Authorization: `Bearer ${userInfo?.accessToken}`
        }
      })
      console.log(response.data)
    } catch (err) {
      console.log(err)
      
    }
    setPasswordChange(passwordObj)
    setPasswordStateStage3(false)
  };

  return (
    <>
      <SecondaryHeader>Personal</SecondaryHeader>
      <section className="bg-black flex flex-col pb-10 ">
        {/* use svg in the profile pic */}
        <section className="flex flex-col bg-gray-950 items-center m-4 mt-1 p-2">
          <div
            // src={profilePic}
            alt=""
            width={40}
            className="rounded-full size-20 bg-gray-600  m-2"
          ></div>
          <section className=" mt-3 flex-1 ">
            <p className=" mb-4 font-semibold">{user?.name}</p>

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

          <p>Phone number: {user?.phoneNumber}</p>

          <p>email: {user?.email} </p>

          <div onClick={() => setPasswordStateStage1(true)} className=" w-full">
            <ProfileButton>
              <div className="flex  gap-2 items-center">
                <FaCreditCard />
                Change Password
              </div>
            </ProfileButton>
          </div>
          <Modal
            isOpen={passwordStateStage1}
            onClick={() => {
              setPasswordStateStage1(false);
            }}
          >
            <CustomForm onSubmit={(e) => handleOldPassword(e)}>
              <CustomInputBox
                name={"oldPassword"}
                value={passwordChange.oldPassword}
                onChange={(e) => handleChange(e)}
                type={"text"}
                id={"oldPassword"}
              >
                Enter old password
              </CustomInputBox>
              <SubmitButton>Next</SubmitButton>
            </CustomForm>
          </Modal>
          <Modal
            isOpen={passwordStateStage2}
            onClick={() => {
              setPasswordStateStage2(false);
            }}
          >
            <CustomForm onSubmit={(e) => handleNewPassword(e)}>
              <CustomInputBox
                name={"newPassword"}
                value={passwordChange.newPassword}
                onChange={(e) => handleChange(e)}
                type={"password"}
                id={"newPassword"}
              >
                Enter new password
              </CustomInputBox>
              <SubmitButton>Next</SubmitButton>
            </CustomForm>
          </Modal>
          <Modal
            isOpen={passwordStateStage3}
            onClick={() => {
              setPasswordStateStage3(false);
            }}
          >
            <CustomForm onSubmit={(e) => handleConfirmNewPassword(e)}>
              <CustomInputBox
                name={"confirmNewPassword"}
                value={passwordChange.confirmNewPassword}
                onChange={(e) => handleChange(e)}
                type={"password"}
                id={"confirmNewPassword"}
              >
                Confirm new password
              </CustomInputBox>
              <SubmitButton>Set new password</SubmitButton>
            </CustomForm>
          </Modal>

          <button>Log out</button>
          <button>delete Account</button>
        </section>
      </section>
      <BottomNav />
    </>
  );
};

export default PersonalInfo;
