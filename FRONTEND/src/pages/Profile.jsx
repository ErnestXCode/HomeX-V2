import React from "react";
import { useSelector } from "react-redux";
import { selectCurrentUser } from "../features/users/userSlice";
import profilePic from "../assets/profile.jfif";
import Header from "../components/Header";
import BottomNav from "../components/BottomNav";
import { Link } from "react-router-dom";

const Profile = () => {
  const user = useSelector(selectCurrentUser);
  return (
    <>
      <section className="bg-black h-[500px] flex flex-col">
        <Header />

        <section className="flex bg-gray-380 items-center">
          <img
            src={profilePic}
            alt=""
            width={80}
            className="rounded-full border-3 border-gray-400 m-4 "
          />
          <section className=" mt-3 flex-1">
            <p className="text-2xl mb-6 font-semibold">
              Welcome {user?.isAdmin ? "Admin" : ""} {user?.name}!{" "}
            </p>
            <p className="text-blue-400 font-semibold ">
              Email:{" "}
              <span className="text-white font-normal font-serif ">
                {user?.email}
              </span>
            </p>
            <p className="text-blue-400 font-semibold ">
              Phone number:{" "}
              <span className="text-white font-normal font-serif ">
                {user?.phoneNumber}
              </span>
            </p>
          </section>
        </section>
        <section className="">
          <button className="bg-blue-600 m-2  p-2 text-[1.1rem]">
            Log out
          </button>
          <button className="bg-blue-600 m-2 p-2 text-[1.1rem]">Update</button>
          <button className="bg-blue-600 m-2 p-2 text-[1.1rem]"><Link to='/admin'>Admin</Link></button>
        </section>
      </section>
      <BottomNav />
    </>
  );
};

export default Profile;
