import React from "react";
import { FaCrosshairs } from "react-icons/fa";

const Modal = ({borderTop, isOpen, onClick, children }) => {
  return (
    <section
      // onClick={onClick}
      className={`bg-black/50 fixed inset-0 
    transition-opacity duration-300 ${
      isOpen
        ? "opacity-100 pointer-events-auto z-40"
        : "opacity-0 pointer-events-none"
    }
    `}
    >
      <div
        className={`
          text-white text-[.9rem] 
          p-4 pl-6 pr-6 transition-transform duration-300 fixed w-full top-[10%]   ${
            isOpen ? "translate-y-0" : "translate-y-full"
          }
           `}
      >
        <button onClick={onClick} className="w-full flex justify-end pr-5 pb-2">
          <FaCrosshairs />
        </button>
        <section className={` ${borderTop &&  'border-t-1 rounded-2xl p-4 m-2'}`}>
        {children}
        </section>
      </div>
    </section>
  );
};

export default Modal;
