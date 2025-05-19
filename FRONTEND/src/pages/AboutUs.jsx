import React from "react";
import { Link } from "react-router-dom";
import BottomNav from "../components/BottomNav";
import { FaArrowLeft } from "react-icons/fa";

const AboutUs = () => {
  return (
    <>
      <h1 className="text-xl p-2 font-semibold text-center border-b border-blue-600">
        About us
      </h1>
      <nav className="p-3">
        <Link to={"/"}>
          <FaArrowLeft />
        </Link>
      </nav>
      <div className="bg-black opacity-70 p-4 mt-4 h-[500px]">
        Lditate maxime quo. Dolores ad sapiente nisi! Eaque architecto itaque
        assumenda iusto? Quae officia tempora omnis deleniti pariatur ducimus
        eius odio.
      </div>
      <BottomNav />
    </>
  );
};

export default AboutUs;
