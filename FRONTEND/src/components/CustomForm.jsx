import React from 'react'

const CustomForm = ({onSubmit, children}) => {
  return (
   <form
        className="bg-gray-950 rounded-2xl border-t rounded-t-3xl m-2 p-2 gap-1 flex flex-col
        md:w-[60%] md:ml-auto md:mr-auto md:mt-10
        "
        onSubmit={onSubmit}
      >
        {children}
      </form>
  )
}

export default CustomForm
