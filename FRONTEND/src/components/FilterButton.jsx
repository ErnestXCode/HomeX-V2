import React from 'react'

const FilterButton = ({onClick, children}) => {
  return (
    <button
        onClick={onClick}
        className="min-w-fit rounded-2xl bg-black p-2 pr-3 pl-3 border-2 border-blue-400 hover:cursor-pointer hover:border-blue-200"
        >
        {children}
      </button>
  )
}

export default FilterButton
