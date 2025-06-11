import React from "react";

const CustomInputBox = ({
  isFileInput,
  inputRef,
  name,
  value,
  onChange,
  type,
  id,
  children,
}) => {
  return (
    <>
      <label className="m-6 mt-3 mb-1 text-[.9rem] " htmlFor={id}>
        {children}
      </label>
      <input
        ref={inputRef}
        accept={isFileInput && "image/*"}
        multiple={isFileInput && true}
        placeholder={children}
        name={name}
        required
        autoComplete="off"
        value={value}
        onChange={onChange}
        type={type}
        id={id}
        className="bg-gray-900 text-slate-50 p-2 pl-3 m-4 mb-0 mt-0 rounded-2xl text-[.9rem] focus:outine-none focus:ring-2 focus:ring-white focus:border-white"
      />
    </>
  );
};

export default CustomInputBox;
{
  /* <label className="mt-2 mb-1 font-semibold" htmlFor="images">
        images:{" "}
      </label>
      <input
        onChange={handleimagesChange}
        accept="image/*"
        
        type="file"
        id="images"
        className="bg-gray-700 text-slate-50 p-2 pl-3 font-bold rounded-2xl mb-3 border-2 border-blue-600"
      /> */
}
