import React from "react";
import FilterButton from "./FilterButton";

const Filter = ({ data, onHandleClick, handleReset }) => {
  const filterAreaArray = data?.map((area) => {
    return (
      <FilterButton onClick={() => onHandleClick(area.area)} key={area._id}>
        {area.area}
      </FilterButton>
    );
  });
  return (
    <section className=" overflow-x-auto no-scrollbar flex gap-3 m-3 mb-0 mt-0 p-2 sticky top-18 z-1">
      <FilterButton onClick={() => handleReset()}>All</FilterButton>
      {filterAreaArray}
    </section>
  );
};

export default Filter;
