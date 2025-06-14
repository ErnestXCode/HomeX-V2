import React from "react";
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

const SideNav = memo(() => {
  const dispatch = useDispatch();
  const userInfo = useSelector(selectCurrentUser);

  return (
    <SideNavLayout onClick={() => dispatch(closeSideNav())}>
      <button onClick={() => dispatch(closeSideNav())} className="ml-auto p-2">
        <FaCrosshairs />
      </button>
      {userInfo ? (
        <>
        <SidebarButton link={"/profile"}>Account</SidebarButton>
        <SidebarButton link={"/profile"} white={true}>Log out</SidebarButton>
        </>
      ) : (
        <>
          <SidebarButton white={true} link={"/login"}>
            Log in
          </SidebarButton>
          <SidebarButton link={"/signup"}>Register</SidebarButton>
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
            Home
          </div>
        </NavElements>
        <NavElements
          side={true}
          link={""}
          onClick={() => dispatch(closeSideNav())}
        >
          <div className="flex items-center gap-2">
            <FaLanguage />
            Language
          </div>
        </NavElements>
      </SideNavCard>

      <SideNavCard>
        <NavElements
          side={true}
          link={""}
          onClick={() => dispatch(closeSideNav())}
        >
          <div className="flex items-center gap-2">
            <FaMicrophone />
            Announcements
          </div>
        </NavElements>
        <NavElements
          side={true}
          link={"/contact-us"}
          onClick={() => dispatch(closeSideNav())}
        >
          <div className="flex items-center gap-2">
            <FaHeadphonesAlt />
            Contact us
          </div>
        </NavElements>
        <NavElements
          side={true}
          link={"/about-us"}
          onClick={() => dispatch(closeSideNav())}
        >
          <div className="flex items-center gap-2">
            <FaInfoCircle />
            About us
          </div>
        </NavElements>
        <NavElements
          side={true}
          link={"/help"}
          onClick={() => dispatch(closeSideNav())}
        >
          <div className="flex items-center gap-2">
            <FaQuestionCircle />
            Help
          </div>
        </NavElements>
      </SideNavCard>
    </SideNavLayout>
  );
});

export default SideNav;
