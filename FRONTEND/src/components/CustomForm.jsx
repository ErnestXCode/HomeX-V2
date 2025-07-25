import React from 'react'
import {motion } from 'framer-motion'

// const containerVariants = {
//   hidden: {
//     opacity: 0, 
//     x: '100vw'
//   }, 
//   visible: {
//     opacity: 1, 
//     x: 0, 
//     transition: {
//       type: 'spring', 
//       delay: 0.5
//     }
//   }
// }

const CustomForm = ({onSubmit, children}) => {
  return (
   <form
        className="bg-gray-950 rounded-2xl border-t rounded-t-3xl  p-2 gap-1 flex flex-col
        // md:w-[60%] md:ml-auto md:mr-auto md:mt-10
        "
        onSubmit={onSubmit}
        // variants={containerVariants

        // }
    
      >
        {children}
      </form>
  )
}

export default CustomForm
