import React from "react";
import SidebarButton from "../components/SidebarButton";
import { FaSadTear } from "react-icons/fa";

const Unauthorized = () => {
  return (
    <div className="flex flex-col justify-center items-center min-h-screen">
      <div className="text-xl">
        <FaSadTear />
      </div>
      <h1 className="text-2xl font-serif">403 Unauthorized</h1>
      <div className="w-40">
        <SidebarButton link={-1}>Go back</SidebarButton>
      </div>
    </div>
  );
};

export default Unauthorized;
