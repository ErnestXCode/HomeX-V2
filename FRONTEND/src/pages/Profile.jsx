import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { logOutUser, selectCurrentUser } from "../features/users/userSlice";
import profilePic from "../assets/profile.jfif";
import Header from "../components/Header";
import BottomNav from "../components/BottomNav";
import ViewButton from '../components/ViewButton'
import { Link, useNavigate } from "react-router-dom";
import SubmitButton from "../components/SubmitButton";
const apiBaseUrl = import.meta.env.VITE_API_URL;

const Profile = () => {
  const user = useSelector(selectCurrentUser);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const handleLogout = async () => {
    try {
      const res = await fetch(`${apiBaseUrl}/logout`, {
        method: "POST",
        credentials: "include",
      });
      const data = await res.json();
      localStorage.clear();
      dispatch(logOutUser());
      navigate("/");
      console.log(data);
    } catch (err) {
      console.log(err);
    }
  };
  const handleDelete = async () => {
    try {
      const res = await fetch(`${apiBaseUrl}/profile`, {
        method: "DELETE",
        credentials: "include",
      });
      const data = await res.json();
      localStorage.clear();
      dispatch(logOutUser());
      navigate("/");
      console.log(data);
    } catch (err) {
      console.log(err);
    }
  };

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
                {/* make email only show the first three then stars then .com  */}
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
        <section className=" flex flex-col items-start bg-gray-800 
        p-3 m-3 rounded-2xl gap-3
        ">
          {user?.isAdmin ? <button>
            <Link to="/admin">Admin Dashboard</Link>
          </button>:  <></>}
          <button>Recently liked</button>
          {/* page not modal */}
          <button>Personal information</button>
          {/* they can add more information KYC*/}
          <button>Change username</button>
            {/* modal */}
          <button>Change Password</button>
          {/* modal */}
          <button>About us</button>
          {/* modal or link */}
          <ViewButton onClick={() => handleLogout()}>Log out</ViewButton>
          <ViewButton white={true} onClick={() => handleDelete()}>Delete Account</ViewButton>
        </section>
      </section>
      <BottomNav />
    </>
  );
};

export default Profile;
