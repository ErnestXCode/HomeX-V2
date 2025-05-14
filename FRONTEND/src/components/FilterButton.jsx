import React from 'react'

const FilterButton = ({onClick, children}) => {
  return (
    <button
        onClick={onClick}
        className="min-w-fit rounded-2xl bg-black p-1 text-[.8rem] pr-3 pl-3 border-2 border-blue-400/70 hover:cursor-pointer hover:border-blue-200"
        >
        {children}
      </button>
  )
}

export default FilterButton
