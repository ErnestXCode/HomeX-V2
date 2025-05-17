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
    <div className="text-[.8rem] flex  items-center gap-3 justify-center w-[100%]
    ">
        <label htmlFor={id} className="">
          {children}
        </label>
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
      <BottomNav />
    </div>
  );
};

export default CustomCheckBox;
