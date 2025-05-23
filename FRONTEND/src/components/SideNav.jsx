import React from "react";
import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import {
  closeSideNav
} from "../features/stylings/styleSlice";
import NavElements from "./NavElements";
import SideNavCard from "./SideNavCard";
import SideNavLayout from "./SideNavLayout";
import SidebarButton from "./SidebarButton";
import { FaUser, FaCrosshairs, FaHome, FaLandmark, FaLanguage, FaSpeakerDeck, FaHeadphonesAlt, FaBook, FaHandsHelping } from "react-icons/fa";

const SideNav = () => {

  const dispatch = useDispatch();



  return (
    <SideNavLayout
      onClick={() => dispatch(closeSideNav())}
    >
      <button onClick={() => dispatch(closeSideNav())} className="ml-auto">
        <FaCrosshairs />
      </button>
      <SidebarButton white={true} link={'/login'}>Log in</SidebarButton>
      <SidebarButton link={'/signup'}>Register</SidebarButton>

      <SideNavCard>
        <NavElements side={true} link={"/"} onClick={() => dispatch(closeSideNav())}>
          <div className="flex items-center gap-2">
          <FaHome />Home

          </div>
        </NavElements>
        <NavElements side={true} link={""} onClick={() => dispatch(closeSideNav())}>
          <div className="flex items-center gap-2">
          <FaLanguage />Language

          </div>
        </NavElements>
      </SideNavCard>

      <SideNavCard>
        <NavElements side={true} link={""} onClick={() => dispatch(closeSideNav())}>
          <div className="flex items-center gap-2">
          <FaSpeakerDeck />Announcements

          </div>
        </NavElements>
        <NavElements
        side={true}
          link={"/contact-us"}
          onClick={() => dispatch(closeSideNav())}
        >
          <div className="flex items-center gap-2">
          <FaHeadphonesAlt />Contact us

          </div>
        </NavElements>
        <NavElements
        side={true}
          link={"/about-us"}
          onClick={() => dispatch(closeSideNav())}
        >
          <div className="flex items-center gap-2">
          <FaBook />About us

          </div>
        </NavElements>
        <NavElements
        side={true}
          link={"/help"}
          onClick={() => dispatch(closeSideNav())}
        >
          <div className="flex items-center gap-2">
          <FaHandsHelping />Help

          </div>
        </NavElements>
      </SideNavCard>
    </SideNavLayout>
  );
};

export default SideNav;
