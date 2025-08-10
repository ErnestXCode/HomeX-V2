import React from "react";
import { useSelector } from "react-redux";
import { selectCurrentUser } from "../features/users/userSlice";
import NavElements from "./NavElements";
import {
  FaBook,
  FaHome,
  FaInfoCircle,
  FaPersonBooth,
  FaQuestionCircle,
  FaTools,
} from "react-icons/fa";
import { memo } from "react";
import { useTranslation } from "react-i18next";

const BottomNav = memo(() => {
  const { t } = useTranslation();
  const user = useSelector(selectCurrentUser);
  return (
    <nav className="bg-black/90 p-2 fixed bottom-0 mt-auto w-screen">
      <ul className="flex gap-3 justify-around">
        <NavElements link={"/"}>
          <FaHome />
          <p className="text-[0.6rem]">{t("Home")}</p>
        </NavElements>

        <NavElements link={"/post-house"}>
          <FaTools />
          <p className="text-[0.6rem]">{t("Create")}</p>
        </NavElements>

        <NavElements link={"/help"}>
          <FaQuestionCircle />
          <p className="text-[0.6rem]">{t("Help")}</p>
        </NavElements>
        <NavElements link={"/profile"}>
          <FaPersonBooth />
          <p className="text-[0.6rem]">{t("Me")}</p>
        </NavElements>
      </ul>
    </nav>
  );
});

export default BottomNav;
