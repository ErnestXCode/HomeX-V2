import React from "react";

const CustomInputBox = ({ name, value, onChange, type, id, children }) => {
  return (
    <>
      <label className="mt-2 mb-1 font-normal" htmlFor={id}>
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
        className="bg-gray-700 text-slate-50 p-2 pl-3 font-normal rounded-2xl mb-3 border-2 border-blue-600"
      />
    </>
  );
};

export default CustomInputBox;
