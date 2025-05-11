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
      border-blue-600 text-blue-300 text-[1.1rem] border-2 min-h-[60%] bg-black rounded-t-4xl
      p-4 transition-transform duration-300 ${
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
