import React from "react";
import { useSelector } from "react-redux";
import { selectCurrentUser } from "../features/users/userSlice";

const Profile = () => {
  const user = useSelector(selectCurrentUser);
  return (
    <section className=" p-4 bg-black h-[500px] flex flex-col">
      <div
        className="bg-blue-500 h-[130px] w-[130px] rounded-full 
      flex justify-center items-center text-2xl 
      font-semibold
      border-2 border-gray-300"
      >
        IMAGE
      </div>
      <section className=" mt-3 flex-1">
        <p className="text-blue-400 font-semibold text-[1.4rem]">
          Name: <span className="text-white font-normal font-serif ">{user?.name}</span>
        </p>
        <p className="text-blue-400 font-semibold text-[1.4rem]">
          Email: <span className="text-white font-normal font-serif ">{user?.email}</span>
        </p>
        <p className="text-blue-400 font-semibold text-[1.4rem]">
          Phone number: <span className="text-white font-normal font-serif ">{user?.phoneNumber}</span>
        </p>
        <section className="">
          <button className="bg-blue-600 m-2  p-2 text-[1.1rem]">Log out</button>
          <button className="bg-blue-600 m-2 p-2 text-[1.1rem]">Update</button>
        </section>
      </section>
    </section>
  );
};

export default Profile;
