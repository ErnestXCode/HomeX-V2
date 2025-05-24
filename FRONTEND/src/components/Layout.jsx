import React from "react";
import { Outlet } from "react-router-dom";

const Layout = () => {
  return (
    <div className="bg-black min-h-screen flex flex-col text-white text-[0.8rem]">
      <Outlet />
    </div>
  );
};

export default Layout;
