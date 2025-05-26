import React from "react";
import { useSelector } from "react-redux";
import { selectCurrentUser } from "../features/users/userSlice";
import NavElements from "./NavElements";
import {
  FaAddressBook,
  FaBook,
  FaHome,
  FaPersonBooth,
  FaTools,
} from "react-icons/fa";


const BottomNav = () => {
  const user = useSelector(selectCurrentUser);
  return (
    <nav className="bg-black/90 p-2 fixed bottom-0 mt-auto md:hidden w-screen">
      <ul className="flex gap-3 justify-around">
        <NavElements link={"/"}>
          <FaHome />
          <p className="text-[0.6rem]">Home</p>
        </NavElements>

        <NavElements link={"/post-house"}>
          <FaTools />
          <p className="text-[0.6rem]">Create</p>
        </NavElements>

        <NavElements link={"/about-us"}>
          <FaBook />
          <p className="text-[0.6rem]">About us</p>
        </NavElements>
        <NavElements link={user !== null ? "/profile" : "/login"}>
          <FaPersonBooth />
          <p className="text-[0.6rem]">Me</p>
        </NavElements>
      </ul>
    </nav>
  );
};

export default BottomNav;
