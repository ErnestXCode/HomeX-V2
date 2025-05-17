import React from 'react'

const CustomForm = ({onSubmit, children}) => {
  return (
   <form
        className="bg-gray-950 rounded-2xl rounded-t-3xl m-4 p-3 gap-1 flex flex-col"
        onSubmit={onSubmit}
      >
        {children}
      </form>
  )
}

export default CustomForm
