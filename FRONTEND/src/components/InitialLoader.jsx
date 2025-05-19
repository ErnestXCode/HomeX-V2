import React from "react";

const InitialLoader = ({fullscreen}) => {
  return (
    <div className={`flex gap-2 flex-col justify-center items-center bg-black ${fullscreen ? 'min-h-screen': 'min-h-full'}`}>
      <div className="bg-blue-600 h-5 w-5 rounded-full">
        <div className="bg-black h-4 w-4 rounded-full"></div>
      </div>
      <p className="font-semibold">Loading...</p>
    </div>
  );
};

export default InitialLoader;
