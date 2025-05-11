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

const SideNav = () => {

  const dispatch = useDispatch();



  return (
    <SideNavLayout
      onClick={() => dispatch(closeSideNav())}
    >
      <button onClick={() => dispatch(closeSideNav())} className="ml-auto">
        X
      </button>
      <SidebarButton white={true} link={'login'}>Log in</SidebarButton>
      <SidebarButton link={'/signup'}>Register</SidebarButton>

      <SideNavCard>
        <NavElements side={true} link={"/"} onClick={() => dispatch(closeSideNav())}>
          Home
        </NavElements>
        <NavElements side={true} link={""} onClick={() => dispatch(closeSideNav())}>
          Language
        </NavElements>
      </SideNavCard>

      <SideNavCard>
        <NavElements side={true} link={""} onClick={() => dispatch(closeSideNav())}>
          Announcements
        </NavElements>
        <NavElements
        side={true}
          link={"/contact-us"}
          onClick={() => dispatch(closeSideNav())}
        >
          Contact us
        </NavElements>
        <NavElements
        side={true}
          link={"/about-us"}
          onClick={() => dispatch(closeSideNav())}
        >
          About us
        </NavElements>
      </SideNavCard>
    </SideNavLayout>
  );
};

export default SideNav;
