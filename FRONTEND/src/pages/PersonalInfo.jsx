import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { selectCurrentUser, signInSuccess } from "../features/users/userSlice";
import BottomNav from "../components/BottomNav";
import { FaCreditCard, FaUserCircle, FaShieldAlt, FaGlobe, FaBell } from "react-icons/fa";
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
  const dispatch = useDispatch();

  const [passwordStage, setPasswordStage] = useState(null);
  const passwordObj = {
    oldPassword: "",
    newPassword: "",
    confirmNewPassword: "",
  };
  const [passwordChange, setPasswordChange] = useState(passwordObj);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await fetch(`${apiBaseUrl}/profile`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${userInfo?.accessToken}`,
          },
          credentials: "include",
        });
        const data = await res.json();
        setUser(data);
      } catch (err) {
        console.log("error", err);
      }
    };
    fetchProfile();
  }, [userInfo?.accessToken]);

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordChange((prev) => ({ ...prev, [name]: value }));
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    if (passwordStage === 2 && passwordChange.newPassword !== passwordChange.confirmNewPassword) return;
    if (passwordStage === 2) {
      try {
        await axios.put("/profile", passwordChange, {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${userInfo?.accessToken}`,
          },
        });
      } catch (err) {
        console.log(err);
      }
      setPasswordChange(passwordObj);
    }
    setPasswordStage(null);
  };

  const secureEmail = (email) => {
    if (!email) return "";
    const [local, domain] = email.split("@");
    return local.slice(0, 2) + "****@" + domain;
  };

  const handleLogout = async () => {
    try {
      await axios.post("/logout", {}, {
        withCredentials: true,
        headers: { Authorization: `Bearer ${userInfo?.accessToken}` },
      });
      dispatch(signInSuccess(null));
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <>
      <SecondaryHeader>{t("Personal Info")}</SecondaryHeader>
      <section className="bg-black  text-white flex flex-col gap-6 p-6 min-h-screen mt-6">
        {/* <div className="flex flex-col items-center">
          <FaUserCircle className="text-6xl text-blue-500 mb-2" />
          <h2 className="text-xl font-semibold">{user?.name || "User"}</h2>
          <p className="text-gray-400 text-sm">Joined: {user?.createdAt?.slice(0, 10)}</p>
        </div> */}

        <div className="space-y-2">
          <ProfileButton><span className="font-semibold text-gray-300">Phone: </span>{user?.phoneNumber}</ProfileButton>
          <ProfileButton><span className="font-semibold text-gray-300">Email: </span>{secureEmail(user?.email)}</ProfileButton>
          <ProfileButton>{t("Privacy Settings")}</ProfileButton>
          <ProfileButton>{t("Language & Region")}</ProfileButton>
          <ProfileButton>{t("Notification Preferences")}</ProfileButton>
        </div>

        <div>
          <button onClick={() => setPasswordStage(0)} className="bg-blue-600 w-full rounded-xl p-2 mb-2">{t("Change Password")}</button>
          <button onClick={handleLogout} className="bg-red-600 w-full rounded-xl p-2 mb-2">{t("Log Out")}</button>
          <button className="bg-gray-700 w-full rounded-xl p-2">{t("Delete Account")}</button>
        </div>

        {/* Password Modal */}
        <Modal isOpen={passwordStage !== null} onClick={() => setPasswordStage(null)}>
          <CustomForm onSubmit={handlePasswordSubmit}>
            {passwordStage === 0 && (
              <CustomInputBox
                name="oldPassword"
                value={passwordChange.oldPassword}
                onChange={handlePasswordChange}
                type="password"
                id="oldPassword"
              >{t("Old Password")}</CustomInputBox>
            )}
            {passwordStage === 1 && (
              <CustomInputBox
                name="newPassword"
                value={passwordChange.newPassword}
                onChange={handlePasswordChange}
                type="password"
                id="newPassword"
              >{t("New Password")}</CustomInputBox>
            )}
            {passwordStage === 2 && (
              <CustomInputBox
                name="confirmNewPassword"
                value={passwordChange.confirmNewPassword}
                onChange={handlePasswordChange}
                type="password"
                id="confirmNewPassword"
              >{t("Confirm Password")}</CustomInputBox>
            )}
            <SubmitButton onClick={() => setPasswordStage(passwordStage + 1)}>
              {passwordStage === 2 ? t("Submit") : t("Next")}
            </SubmitButton>
          </CustomForm>
        </Modal>
      </section>
      <BottomNav />
    </>
  );
};

export default PersonalInfo;
