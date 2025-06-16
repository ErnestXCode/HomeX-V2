import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { closeSideNav } from "../features/stylings/styleSlice";
import NavElements from "./NavElements";
import SideNavCard from "./SideNavCard";
import SideNavLayout from "./SideNavLayout";
import SidebarButton from "./SidebarButton";
import {
  FaCrosshairs,
  FaHome,
  FaLanguage,
  FaHeadphonesAlt,
  FaBook,
  FaHandsHelping,
  FaSoundcloud,
  FaPhoneVolume,
  FaPhoenixFramework,
  FaMicrophone,
  FaScroll,
  FaSkullCrossbones,
  FaCross,
  FaInfoCircle,
  FaQuestionCircle,
} from "react-icons/fa";
import { selectCurrentUser } from "../features/users/userSlice";
import { memo } from "react";
import { useTranslation } from "react-i18next";
import Modal from "./Modal";
import SubmitButton from "./SubmitButton";
import i18n from "i18next";

const SideNav = memo(() => {
  const dispatch = useDispatch();
  const userInfo = useSelector(selectCurrentUser);
  const { t } = useTranslation();
  const [showModal, setShowModal] = useState(false);

  const handleModal = () => {};

  return (
    <SideNavLayout onClick={() => dispatch(closeSideNav())}>
      <button onClick={() => dispatch(closeSideNav())} className="ml-auto p-2">
        <FaCrosshairs />
      </button>
      {userInfo ? (
        <>
          <SidebarButton link={"/profile"}>{t("Account")}</SidebarButton>
          <SidebarButton link={"/profile"} white={true}>
            {t("LogOut")}
          </SidebarButton>
        </>
      ) : (
        <>
          <SidebarButton white={true} link={"/login"}>
            {t("LogIn")}
          </SidebarButton>
          <SidebarButton link={"/signup"}> {t("Register")}</SidebarButton>
        </>
      )}

      <SideNavCard>
        <NavElements
          side={true}
          link={"/"}
          onClick={() => dispatch(closeSideNav())}
        >
          <div className="flex items-center gap-2">
            <FaHome />
            {t("Home")}
          </div>
        </NavElements>

        <div
          className="p-2 w-[100%] active:bg-gray-800 rounded-2xl text-[0.8rem]"
          onClick={() => setShowModal(true)}
        >
          <div className="flex items-center gap-2">
            <FaLanguage />
            {t("Language")}
          </div>
        </div>
        <Modal
          borderTop={false}
          isOpen={showModal}
          onClick={() => setShowModal(false)}
        >
          <div className="bg-gray-900  flex flex-col p-3 gap-2 rounded-2xl">
            <button
              className="bg-blue-700 p-1 mt-1 rounded-xl active:bg-gray-900/50"
              onClick={() => {
                i18n.changeLanguage("en");
                setShowModal(false);
                closeSideNav();
              }}
            >
              English
            </button>
            <button
              className="bg-blue-700 p-1 mt-1 rounded-xl active:bg-gray-900/50"
              onClick={() => {
                i18n.changeLanguage("sw");
                setShowModal(false);
                closeSideNav();
              }}
            >
              Kiswahili
            </button>
          </div>
        </Modal>
      </SideNavCard>

      <SideNavCard>
        <NavElements
          side={true}
          link={""}
          onClick={() => dispatch(closeSideNav())}
        >
          <div className="flex items-center gap-2">
            <FaMicrophone />
            {t("Announcements")}
          </div>
        </NavElements>
        <NavElements
          side={true}
          link={"/contact-us"}
          onClick={() => dispatch(closeSideNav())}
        >
          <div className="flex items-center gap-2">
            <FaHeadphonesAlt />
            {t("ContactUs")}
          </div>
        </NavElements>
        <NavElements
          side={true}
          link={"/about-us"}
          onClick={() => dispatch(closeSideNav())}
        >
          <div className="flex items-center gap-2">
            <FaInfoCircle />
            {t("About")}
          </div>
        </NavElements>
        <NavElements
          side={true}
          link={"/help"}
          onClick={() => dispatch(closeSideNav())}
        >
          <div className="flex items-center gap-2">
            <FaQuestionCircle />
            {t("Help")}
          </div>
        </NavElements>
      </SideNavCard>
    </SideNavLayout>
  );
});

export default SideNav;
