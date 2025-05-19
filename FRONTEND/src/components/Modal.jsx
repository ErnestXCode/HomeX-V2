import React from "react";

const Modal = ({ isOpen, onClick, children }) => {
  return (
    <div
      onClick={onClick}
      className={`bg-black/50 fixed inset-0 flex flex-col justify-end 
    transition-opacity duration-300 ${
      isOpen
        ? "opacity-100 pointer-events-auto"
        : "opacity-0 pointer-events-none"
    }
    `}
    >
      <div
        className={`
       text-white text-[.9rem] border-t-1  min-h-[60%] bg-black rounded-t-4xl
      p-4 pl-6 pr-6 transition-transform duration-300  ${
        isOpen ? "translate-y-0" : "translate-y-full"
      }
      `}
      >
        {children}
      </div>
    </div>
  );
};

export default Modal;
