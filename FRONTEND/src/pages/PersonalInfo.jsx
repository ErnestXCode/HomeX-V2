import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { selectCurrentUser, signInSuccess } from "../features/users/userSlice";
import BottomNav from "../components/BottomNav";
import { FaCreditCard } from "react-icons/fa";
import ProfileButton from "../components/ProfileButtons";
import Modal from "../components/Modal";
import CustomForm from "../components/CustomForm";
import CustomInputBox from "../components/CustomInputBox";
import SubmitButton from "../components/SubmitButton";
import SecondaryHeader from "../components/SecondaryHeader";
import axios from "../api/axios";
import { useTranslation } from "react-i18next";
const apiBaseUrl = import.meta.env.VITE_API_URL;

const PersonalInfo = () => {
  const userInfo = useSelector(selectCurrentUser);
  const { t } = useTranslation();
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

  const handleConfirmNewPassword = async (e) => {
    e.preventDefault();
    // confirm passwords match here

    console.log(passwordChange);
    try {
      const response = await axios.put(
        "/profile",
        { ...passwordChange },
        {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${userInfo?.accessToken}`,
          },
        }
      );
      console.log(response.data);
    } catch (err) {
      console.log(err);
    }
    setPasswordChange(passwordObj);
    setPasswordStateStage3(false);
  };

  const dispatch = useDispatch();

  const handleLogout = async () => {
    try {
      await axios.post(
        "/logout",
        {},
        {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${userInfo?.accessToken}`,
          },
        }
      );
      // navigate("/");
      dispatch(signInSuccess(null));
    } catch (err) {
      console.log(err);
    }
  };
  const secureEmail = (email) => {
    if (email) {
      const emailDomain = email.split(".")[1];
      const hiddenEmailBody = email.slice(0, 3) + "****." + emailDomain;
      return hiddenEmailBody;
    }
    // const first_three = phone.slice(0, 4)
    // return phone number, i dont like i am doing this in the frontend
  };

  return (
    <>
      <SecondaryHeader>{t("Personal")}</SecondaryHeader>
      <section className="bg-black flex flex-col pb-10 mt-10">
        {/* use svg in the profile pic */}

        <section className="flex flex-col ">
          <ProfileButton>
            <span className="font-semibold text-gray-300">{t("Name")}: </span>{" "}
            {user?.name}{" "}
          </ProfileButton>

          <ProfileButton>
            <span className="font-semibold text-gray-300">
              {t("PhoneNumber")}:{" "}
            </span>{" "}
            {user?.phoneNumber}
          </ProfileButton>

          <ProfileButton>
            <span className="font-semibold text-gray-300">{t("Email")}: </span>{" "}
            {secureEmail(user?.email)}{" "}
          </ProfileButton>

          <div onClick={() => setPasswordStateStage1(true)} className=" w-full">
            <ProfileButton>
              <div className="flex  gap-2 items-center">
                <FaCreditCard />
                {t("changePassword")}
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
                {t("Next")}
              </CustomInputBox>
              <SubmitButton>{t("EnterOldPwd")}</SubmitButton>
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
                {t("EnterNewPwd")}
              </CustomInputBox>
              <SubmitButton>{t("Next")}</SubmitButton>
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
                {t("ConfirmNewPwd")}
              </CustomInputBox>
              <SubmitButton>{t("SetNewPwd")}</SubmitButton>
            </CustomForm>
          </Modal>
          <section className="flex flex-col gap-3 p-4">
            <button
              onClick={handleLogout}
              className="w-full bg-blue-600 p-1.5  rounded-2xl"
            >
              {t("LogOut")}
            </button>
            <button className="w-full bg-gray-700 text-white p-1.5  rounded-2xl">
              {t("DeleteAccount")}
            </button>
          </section>
        </section>
      </section>
      <BottomNav />
    </>
  );
};

export default PersonalInfo;
