import React from "react";

const Filter = ({ data, onHandleClick, handleReset }) => {
  const filterAreaArray = data?.map((area) => {
    return (
      <button
        onClick={() => onHandleClick(area.area)}
        key={area._id}
        className="rounded-2xl bg-black/80 p-2 pr-3 pl-3 border-2 border-blue-400 hover:cursor-pointer hover:border-blue-200"
      >
        {area.area}
      </button>
    );
  });
  return (
    <section className="flex gap-3 m-3 fixed">
      <button
        onClick={() => handleReset()}
        className="rounded-2xl bg-black p-2 pr-3 pl-3 border-2 border-blue-400 hover:cursor-pointer hover:border-blue-200"
      >
        All
      </button>
      {filterAreaArray}
    </section>
  );
};

export default Filter;
