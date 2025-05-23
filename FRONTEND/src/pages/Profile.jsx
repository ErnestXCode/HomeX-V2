import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { logOutUser, selectCurrentUser } from "../features/users/userSlice";
import Header from "../components/Header";
import BottomNav from "../components/BottomNav";
import ViewButton from "../components/ViewButton";
import { Link, useNavigate } from "react-router-dom";
import SubmitButton from "../components/SubmitButton";
import ProfileButtons from "../components/ProfileButtons";

import ProfileButton from "../components/ProfileButtons";
import { FaCreditCard, FaDigitalTachograph, FaHeart, FaMoneyBillAlt, FaPenAlt, FaTeamspeak, FaUser } from "react-icons/fa";
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

  const secureEmail = (email) => {
    const emailDomain = email.split(".")[1];
    const hiddenEmailBody = email.slice(0, 3) + "****." + emailDomain;
    return hiddenEmailBody;
  };
  return (
    <>
      <section className="bg-black flex flex-col pb-10 ">
        <Header />
        {/* use svg in the profile pic */}
        <section className="flex bg-gray-950 items-center m-4 mt-2 mb-2 p-2">
          <div
            // src={profilePic}
            alt=""
            width={40}
            className="rounded-full size-10 bg-gray-600 m-4"
          ></div>
          <section className=" mt-3 flex-1 ">
            <p className=" mb-4 font-semibold">
              Welcome {user?.isAdmin ? "Admin" : ""} {user?.name}!{" "}
            </p>

            <p className="text-white font-semibold ">
              {user?.email && secureEmail(user.email)}
              {/* make email only show the first three then stars then .com  */}
            </p>

            {/* <p className="text-blue-400 font-semibold ">
              Phone number:{" "}
              <span className="text-white font-normal font-serif ">
                {user?.phoneNumber}
              </span>
            </p> */}
          </section>
        </section>
        <section
          className=" flex flex-col items-start bg-gray-950 
        p-3 m-3 rounded-2xl gap-3
        "
        >
          {user?.isAdmin && (
            <ProfileButton link={"/admin"}>
              <div className='flex  gap-2 items-center'><FaDigitalTachograph />
              Admin Dashboard
              </div>
            
            </ProfileButton>
          )}
          <ProfileButton link={"/liked"}>
          <div className='flex  gap-2 items-center'><FaHeart />
          Recently liked
          </div>
          
          </ProfileButton>

          <ProfileButton link={"/personal"}>
          <div className='flex  gap-2 items-center'><FaUser />
          Personal information
          </div>
          
          </ProfileButton>
          {/* they can add more information KYC*/}
          <ProfileButton>
            <div className='flex  gap-2 items-center'><FaPenAlt />
            Change username
            </div>


          </ProfileButton>
          {/* modal */}
          <ProfileButton>
            <div className='flex  gap-2 items-center'><FaCreditCard />
            Change Password
            </div>


          </ProfileButton>
          {/* modal */}
          <ProfileButton link={"/about-us"}>
          <div className='flex  gap-2 items-center'><FaTeamspeak />
          About us
          </div>
          
          </ProfileButton>
          <ProfileButton link={"/donate"}>
          <div className='flex  gap-2 items-center'><FaMoneyBillAlt />
          Donate
          </div>
          
          </ProfileButton>
          <ProfileButton link={"/contact-us"}>
          <div className="flex gap-2 items-center"><FaUser />
          Contact us
          </div>
          
          </ProfileButton>
          {/* modal or link */}
          <section className="flex w-[100%] justify-between m-2">
            <ViewButton onClick={() => handleLogout()}>Log out</ViewButton>
            <ViewButton white={true} onClick={() => handleDelete()}>
              Delete Account
            </ViewButton>
          </section>
        </section>
      </section>
      <BottomNav />
    </>
  );
};

export default Profile;
