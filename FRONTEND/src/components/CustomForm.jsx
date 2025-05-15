import React from 'react'

const CustomForm = ({onSubmit, children}) => {
  return (
   <form
        className="rounded-t-2xl mt-0 m-3 p-3 gap-1 flex flex-col"
        onSubmit={onSubmit}
      >
        {children}
      </form>
  )
}

export default CustomForm
