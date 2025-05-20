import React from 'react'

const ListText = ({content, children}) => {
  return (
    <p className="text-gray-300 text-[.81rem] font-semibold p-1">
              {children}
              <span className="text-white font-normal">{content}</span>
            </p>
  )
}

export default ListText
