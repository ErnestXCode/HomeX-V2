import React from 'react'

const ListText = ({content, children}) => {
  return (
    <p className="text-blue-400 font-bold p-1 text-[1rem]">
              {children}
              <span className="text-white font-semibold">{content}</span>
            </p>
  )
}

export default ListText
