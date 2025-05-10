import React from "react";
import { Link } from "react-router-dom";

const Donations = () => {
  return (
    <>
    <section className="bg-blue-600/80 text-center h-55 rounded-b-2xl">
      <nav className="p-2">
        <ul className="flex items-center justify-end p-2 gap-3">
          <li className=""><Link to='/contact-us'>Contact us</Link></li>
          <li className=""><Link to='/contact-us'>Web</Link></li>
        </ul>
      </nav>
      <h1 className="text-3xl">Donate</h1>
      <p className="font-serif text-white/70 p-3">A motto or something</p>
      {/* would be nice if these parts had images */}
    </section>
    <section>
        
      <p className="bg-black opacity-70 p-4 mt-4 h-[500px]">
      us hic commodi quibusdam voluptates dolor repudiandae eaque, magnam recusandae, eos dicta ab earum tenetur voluptate iure sapiente. Similique libero ullam optio rerum dignissimos dolore cumque reprehenderit eum voluptatibus?
      Soluta sapiente, aliquid, eaque magni cupiditate culpa mollitia ex aspernatur quas, laudantium illum! Aliquid dolor iure sint et optio! Placeat corrupti voluptates odit velit enim dolore rerum. Minus, et similique?
      ibus odio esse vel ipsa cupiditate illo mollitia molestias expedita ducimus sunt sapiente, tempora facilis amet suscipit blanditiis atque ea, doloremque repudiandae sint! Vitae, cumque! Dolore, laboriosam laborum.
      </p>
    </section>
    </>
  );
};

export default Donations;
