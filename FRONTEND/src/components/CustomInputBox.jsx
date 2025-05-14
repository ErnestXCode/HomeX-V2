import React from "react";

const CustomInputBox = ({ name, value, onChange, type, id, children }) => {
  return (
    <>
      <label className="m-6 mt-2 mb-1 text-[.8rem]" htmlFor={id}>
        {children}
      </label>
      <input
      // ref
        name={name}
        required
        autoComplete="off"
        value={value}
        onChange={onChange}
        type={type}
        id={id}
        className="bg-gray-700 text-slate-50 p-1 pl-3 m-4 mb-0 mt-0 rounded-2xl"
      />
    </>
  );
};

export default CustomInputBox;
