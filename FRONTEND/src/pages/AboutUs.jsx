import React from "react";
import { Link } from "react-router-dom";
import BottomNav from "../components/BottomNav";
import { FaArrowLeft } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { selectCurrentUser, signInSuccess } from "../features/users/userSlice";
import SecondaryHeader from "../components/SecondaryHeader";

const AboutUs = () => {
  const dispatch = useDispatch();
  const userInfo = useSelector(selectCurrentUser);
  const consoleLogger = () => {
    console.log(userInfo);
  };
  const dispatcher = () => {
         dispatch(signInSuccess(true))
  };
  return (
    <>
     <SecondaryHeader>About us</SecondaryHeader>
      <div className="bg-black opacity-70 p-4 mt-4 h-[500px]">
        Lditate maxime quo. Dolores ad sapiente nisi! Eaque architecto itaque
        assumenda iusto? Quae officia tempora omnis deleniti pariatur ducimus
        eius odio.
      </div>
      <section className="flex mb-50 items-center justify-around">
        <button onClick={dispatcher}>GETDATA</button>
        <button onClick={consoleLogger}>Console.log</button>
      </section>
      <BottomNav />
   </>
  );
};

export default AboutUs;
