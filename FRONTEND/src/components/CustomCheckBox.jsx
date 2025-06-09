import React from "react";
import BottomNav from "./BottomNav";

const CustomCheckBox = ({
  //   isUserAgreement,
  name,
  id,
  value,
  onChange,
  children,
}) => {
  return (
    <div
      className="text-[.8rem] w-[100%] flex items-center gap-3
    "
    >
      <input
        name={name}
        value={value}
        onChange={onChange}
        id={id}
        // required for user agreement
        type="checkbox"
        className="appearance-none w-3 h-3 rounded-full border-blue-500 border-1 text-white cursor-pointer
            checked:bg-blue-500"
      />
      <label htmlFor={id} className="">
        {children}
      </label>
    </div>
  );
};

export default CustomCheckBox;
