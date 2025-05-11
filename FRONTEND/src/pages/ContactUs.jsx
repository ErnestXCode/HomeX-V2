import React, { useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'

const ContactUs = () => {
  const nameRef = useRef()
  const inputDict = {
    name: '', 
    email: '', 
    message: '', 
  }
  const navigate = useNavigate()
  const [inputData , setInputData ] = useState(inputDict)
  const handleSubmit =  (e) => {
    e.preventDefault()
    // do something 
    console.log(inputData.message)
    navigate('/')
  }
  const handleChange = (e) => {
    const {name, value} = e.target
    setInputData(prevData => {
      return {
        ...prevData, 
        [name] : value
      }
    })

  }
  return (
    <>
      <form
        className="bg-black mb-10 mt-2 p-3 flex flex-col md:w-[700px] md:ml-auto md:mr-auto md:border-0 rounded-2xl"
        onSubmit={handleSubmit}
      >
        <label className="mt-2 mb-1 font-normal" htmlFor="name">
          Name:{" "}
        </label>
        <input
          ref={nameRef}
          name="name"
          required
          value={inputData.name}
          onChange={handleChange}
          type="text"
          id="name"
          className="bg-gray-700 text-slate-50 p-2 pl-3 font-normal rounded-2xl mb-3 border-2 border-blue-600"
        />
        <label className="mt-2 mb-1 font-normal" htmlFor="email">
          Email:{" "}
        </label>
        <input
          name="email"
          value={inputData.email}
          required
          onChange={handleChange}
          type="email"
          id="email"
          autoComplete="off"
          className="bg-gray-700 text-slate-50 p-2 pl-3 font-normal rounded-2xl mb-3 border-2 border-blue-600"
        />
        <label className="mt-2 mb-1 font-normal" htmlFor="message">
          Message:{" "}
        </label>
        <textarea
        rows='5'
          name="message"
          value={inputData.message}
          required
          onChange={handleChange}
          type="text"
          id="message"
          className="bg-gray-700 mb-4 text-slate-50 p-2 pl-3 font-normal rounded-2xl border-2 border-blue-600"
        />
      
          
        <button className="bg-blue-600 mb-2 cursor-pointer hover:bg-blue-500 active:border-3 hover:text-white w-[100%] text-slate-50 border-2 border-black pt-2 pb-2 pr-3 pl-3 mr-auto ml-auto rounded-2xl font-normal">
          Send message
        </button>
      </form>
    </>
  
  )
}

export default ContactUs
