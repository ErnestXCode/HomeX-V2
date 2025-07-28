import React from "react";
import BottomNav from "../components/BottomNav";
import SecondaryHeader from "../components/SecondaryHeader";

const AboutUs = () => {
  return (
   <>
  <SecondaryHeader>About</SecondaryHeader>
  <div className="bg-black opacity-70 p-4 mt-4 flex flex-col items-center">
    <div className="size-20 bg-gray-600 rounded-full md:size-40 md:text-2xl"></div>
    <div className="flex flex-col items-center mt-3 gap-2">
      <p className="text-base md:text-3xl font-bold tracking-wide">HomeX</p>
      <p className="md:text-base text-gray-300">Version 1.0.0</p>
    </div>
    <details className="text-center p-3 text-sm md:text-base leading-relaxed text-white max-w-xl mb-30">
      <summary className="cursor-pointer text-blue-400 font-semibold">What is HomeX?</summary>
      <p className="mt-3">
        HomeX is your smart, no-stress way to find a house. Whether you're relocating or searching locally, 
        we help you discover real listings in real time — with zero agent pressure.
      </p>
      <p className="mt-3">
        Browse rentals freely, filter by area or price, and see clear photos and details. When you're ready, 
        you can unlock contact info and map directions with a small fee — no commissions, no calls, just control.
      </p>
      <ul className="text-left mt-4 list-disc list-inside space-y-1">
        <li>✅ Filter by area or price range</li>
        <li>✅ Real images, no guesswork</li>
        <li>✅ Instant alerts on new or updated listings</li>
        <li>✅ Pay only when you want full access</li>
        <li>✅ No middlemen. No pressure. Just options.</li>
      </ul>
      <p className="mt-4 font-semibold text-blue-300">
        HomeX – Your next move, made simple.
      </p>
    </details>
  </div>
  <BottomNav />
</>


  );
};

export default AboutUs;
