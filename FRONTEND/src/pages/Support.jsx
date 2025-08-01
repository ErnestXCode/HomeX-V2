import React from "react";
import SecondaryHeader from "../components/SecondaryHeader";
import { Link } from "react-router-dom";

const Support = () => {
  return (
    <>
      <SecondaryHeader>Support</SecondaryHeader>

      <section className="bg-black opacity-70 mt-4 p-6 rounded-2xl mx-4 text-white max-w-3xl mx-auto leading-relaxed space-y-4 h-[500px] overflow-y-auto">
        <p>
          Your support helps us grow and continue providing accessible housing listings and landlord tools. If you find value in what we do, consider making a donation.
        </p>
        <p>
          We accept contributions through M-PESA and other local channels. For secure donation details, please reach out to us.
        </p>
        <p>
          Contact us privately and securely via the link below:
        </p>

        <div className="mt-4">
          <Link
            to="/contact"
            className="inline-block bg-blue-600 text-white px-5 py-2 rounded hover:bg-blue-700 transition"
          >
            Contact Us for Donation Info
          </Link>
        </div>

        <p className="mt-6 text-sm text-gray-400">
          100% of your donation goes toward improving this platform. Thank you!
        </p>
      </section>
    </>
  );
};

export default Support;
