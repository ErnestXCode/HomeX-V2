import React from 'react'
import { Link } from 'react-router-dom'

const Help = () => {
  return (
    <>
    <nav className="bg-black p-4 text-white sticky top-0 z-20 border-b-2 border-blue-700
        flex items-center text-center
        "
        
        >
          <p className=""><Link to='/'>Back</Link></p>
          <h1 className="text-[1.2rem] ml-34 font-semibold">Help</h1>
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
