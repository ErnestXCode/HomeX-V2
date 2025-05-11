import React from "react";
import { useSelector } from "react-redux";
import { selectCurrentUser } from "../features/users/userSlice";
import NavElements from "./NavElements";

const BottomNav = () => {
  const user = useSelector(selectCurrentUser);
  return (
    <nav className="bg-black/90 p-4 fixed bottom-0 mt-auto md:hidden w-screen">
      <ul className="flex gap-3 justify-around">
        <NavElements link={"/"}>Home</NavElements>

        {user?.isLandlord || user?.isAdmin ? (
          <NavElements link={"/post-house"}>Create</NavElements>
        ) : (
          <NavElements link={"/help"}>Help</NavElements>
        )}
        <NavElements link={"/about-us"}>About</NavElements>
        <NavElements link={user ? "/profile" : "/signup"}>Account</NavElements>
      </ul>
    </nav>
  );
};

export default BottomNav;
