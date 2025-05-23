import React from "react";

const InitialLoader = () => {
  return (
    <div className="flex justify-center items-center h-screen animate-pulse">
      <div className="size-6 rounded-full border-t-3  border-blue-600 animate-spin"></div>
    </div>
  );
};

export default InitialLoader;
