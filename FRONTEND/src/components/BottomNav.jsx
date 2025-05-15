import React from "react";
import { useSelector } from "react-redux";
import { selectCurrentUser } from "../features/users/userSlice";
import NavElements from "./NavElements";
import { FaAddressBook, FaBook, FaHome, FaPersonBooth, FaTools } from "react-icons/fa";

const BottomNav = () => {
  const user = useSelector(selectCurrentUser);
  return (
    <nav className="bg-black/90 p-4 fixed bottom-0 mt-auto md:hidden w-screen">
      <ul className="flex gap-3 justify-around">
        <NavElements link={"/"}><FaHome /></NavElements>

        {user?.isLandlord || user?.isAdmin ? (
          <NavElements link={"/post-house"}><FaTools /></NavElements>
        ) : (
          <NavElements link={"/help"}><FaBook /></NavElements>
        )}
        <NavElements link={"/about-us"}><FaAddressBook /></NavElements>
        <NavElements link={user ? "/profile" : "/signup"}><FaPersonBooth /></NavElements>
      </ul>
    </nav>
  );
};

export default BottomNav;
