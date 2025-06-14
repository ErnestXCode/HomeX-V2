import React from "react";
import ProfileButton from "./ProfileButtons";
import {
  FaDigitalTachograph,
  FaHandsHelping,
  FaHeadphonesAlt,
  FaInfoCircle,
  FaMoneyBillAlt,
  FaQuestionCircle,
  FaTeamspeak,
  FaUser,
} from "react-icons/fa";
import BottomNav from "./BottomNav";

const ProfileInfoContent = () => {
  return (
    <>
      <section className="bg-black flex flex-col pb-10 ">
        <section
          className=" flex flex-col items-start bg-gray-950 
        p-3 m-3 rounded-2xl gap-3
        "
        >
          <ProfileButton link={"/admin"}>
            <div className="flex  gap-2 items-center">
              <FaDigitalTachograph />
              Admin Dashboard
            </div>
          </ProfileButton>

          <ProfileButton link={"/personal"}>
            <div className="flex  gap-2 items-center">
              <FaUser />
              Personal information
            </div>
          </ProfileButton>
          {/* they can add more information KYC*/}

          {/* modal */}
          <ProfileButton link={"/about-us"}>
            <div className="flex  gap-2 items-center">
              <FaInfoCircle />
              About
            </div>
          </ProfileButton>
          <ProfileButton link={"/donate"}>
            <div className="flex  gap-2 items-center">
              <FaMoneyBillAlt />
              Donate
            </div>
          </ProfileButton>
          <ProfileButton link={"/contact-us"}>
            <div className="flex gap-2 items-center">
              <FaHeadphonesAlt />
              Contact us
            </div>
          </ProfileButton>
          <ProfileButton link={"/help"}>
            <div className="flex gap-2 items-center">
              <FaQuestionCircle />
              Help
            </div>
          </ProfileButton>
        </section>
      </section>
    </>
  );
};

export default ProfileInfoContent;
