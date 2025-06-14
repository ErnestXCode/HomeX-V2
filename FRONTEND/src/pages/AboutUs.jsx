import React from "react";
import BottomNav from "../components/BottomNav";
import SecondaryHeader from "../components/SecondaryHeader";

const AboutUs = () => {
  return (
    <>
      <SecondaryHeader>About</SecondaryHeader>
      <div className="bg-black opacity-70 p-4 mt-4 flex flex-col items-center">
        <div className="size-20 bg-gray-600 rounded-full "></div>
        <div className="flex flex-col items-center mt-3 gap-2">
          <p className="text-base">HomeX </p>
          <p>Version 1.0.0</p>
        </div>
        <details className="text-center p-3">
          Lorem ipsum dolor, sit amet consectetur adipisicing elit. Corrupti, iure itaque, animi explicabo labore laudantium, nostrum soluta maiores voluptates quasi mollitia? Sed sit illo quod laboriosam! Velit incidunt ea doloremque!
          Possimus deleniti eum, ratione ex at ipsum. Repellat quaerat soluta nemo doloribus consequatur ducimus et! Voluptas blanditiis nesciunt nostrum, odit veniam accusantium reiciendis doloribus ad provident assumenda voluptates quod? Velit?
          Doloremque sint sed eos hic libero aut, consequuntur explicabo nam. Ut suscipit harum neque vero illo ad consequatur sapiente veniam nemo consectetur eos quaerat ratione, ipsam sit animi, voluptas enim.
        </details>
      </div>
      <BottomNav />
    </>
  );
};

export default AboutUs;
