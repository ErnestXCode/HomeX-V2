import React from 'react'

const FilterButton = ({onClick, children}) => {
  return (
    <button
        onClick={onClick}
        className="min-w-fit rounded-xl bg-black/60 border-1
      p-1.5
      pr-3
      pl-3
      border-blue-100
       flex items-center justify-center
        text-[.75rem]"
        >
        {children}
      </button>
  )
}

export default FilterButton
