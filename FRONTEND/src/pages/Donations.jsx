import React from "react";
import SecondaryHeader from "../components/SecondaryHeader";

const Donations = () => {
  return (
    <>
      <SecondaryHeader>Donate</SecondaryHeader>

      <section className="bg-black opacity-70 mt-4 p-6 rounded-2xl mx-4 text-white max-w-3xl mx-auto leading-relaxed space-y-4 h-[500px] overflow-y-auto">
        <p>
          HomeX is a free platform dedicated to making housing discovery and
          property posting easy and accessible for everyone in Kenya.
        </p>

        <p>
          If you'd like to support our mission and help keep the platform
          growing, you can make a donation via M-PESA.
        </p>

        <div className="bg-gray-800 p-4 rounded-xl">
          <p className="text-gray-300 text-sm">M-PESA Number</p>
          <p className="text-green-400 font-semibold text-lg tracking-wider">
            0795 482 452
          </p>
        </div>

        <p className="text-sm text-gray-400">
          Your donation goes directly toward platform maintenance and
          development. Asanteni sana!
        </p>
      </section>
    </>
  );
};

export default Donations;
