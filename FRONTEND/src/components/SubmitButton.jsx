import React from 'react'

const SubmitButton = ({children}) => {
  return (
    <button className="bg-blue-600 mb-2 cursor-pointer hover:bg-blue-500 active:border-3 hover:text-white w-[100%] text-slate-50 border-2 border-black pt-2 pb-2 pr-3 pl-3 mr-auto ml-auto rounded-2xl font-normal">
          {children}
        </button>
  )
}

export default SubmitButton
