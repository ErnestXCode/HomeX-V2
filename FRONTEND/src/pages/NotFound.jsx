import React from "react";
import ViewButton from "../components/ViewButton";
import { FaEgg, FaSadCry } from "react-icons/fa";
import SidebarButton from "../components/SidebarButton";

const NotFound = () => {
  return (
    <div className="flex flex-col justify-center items-center min-h-screen">
      <div className="text-xl">
        <FaSadCry />
      </div>
      <h1 className="text-2xl font-serif">404 not found</h1>
      <div className="w-40">
        <SidebarButton link={"/"}>Go back</SidebarButton>
      </div>
    </div>
  );
};

export default NotFound;
