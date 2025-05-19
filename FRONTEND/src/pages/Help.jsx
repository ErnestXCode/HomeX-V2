import React from 'react'
import { FaArrowLeft } from 'react-icons/fa'
import { Link } from 'react-router-dom'

const Help = () => {
  return (
    <>
     <h1 className="text-xl p-2 font-semibold text-center border-b border-blue-600">
            Help
          </h1>
          <nav className="p-3">
            <Link to={"/"}>
              <FaArrowLeft />
            </Link>
          </nav>
    <section className="bg-black opacity-70 p-4 mt-4 h-[500px]">
      Lorem ipsum dolor sit, amet consectetur adipisicing elit. Molestias nemo
      ha
      <br />
      <br />
       blanditiis! Debitis. Lorem ipsum, dolor sit amet
      consectetur adipisicing elit. Mollitia nemo, expedita architecto, quae
      consequuntur consequatur eveniet dolore eum totam assumenda nobis ipsum
      similique nostrum, velit provident repudiandae alias veritatis iusto?
    </section>
    </>
  )
}

export default Help
