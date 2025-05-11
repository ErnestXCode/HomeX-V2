
import React, { useState } from 'react'

const Modal = ({isOpen, onclose , children}) => {
  return (
    <div
    onClick={onclose}
    className={` fixed inset-0 bg-white/50  z-50 flex items-end justify-center transition-opacity duration-1000 ${
      
      isOpen ? 'opacity-100 pointer-events-auto': 'opacity-0 pointer-events-none'}`}
    >
     <div className={`bg-white w-full max-h-[90%] rounded-t-2xl p-4 transition-transform duration-1000 ${isOpen ? 
      'translate-y-0' : 'translate-y-full'
     }`}>
      {children}
     </div>
    </div>
  )
}

const Another = () => {
  const [showModal, setShowModal] = useState(false)
  return [
    <>
    <button onClick={() => setShowModal(true)}>Show Details</button>
    <Modal isOpen={showModal} onclose={() => setShowModal(false)}>
    <h2 className='text-xl font-bold mb-2 text-black'>House Details</h2>
    </Modal>
    </>
  ]
}

const Trials = () => {
  return <Another />
}

export default Trials
