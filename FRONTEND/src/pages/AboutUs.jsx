import React from 'react'
import { Link } from 'react-router-dom'

const AboutUs = () => {
  return <>
  <nav className="bg-black p-4 text-white sticky top-0 z-20 border-b-2 border-blue-700
  flex items-center text-center
  "
  
  >
    <p className=""><Link to='/'>Home</Link></p>
    <h1 className="text-[1.2rem] ml-30">About us</h1>
    </nav>
  <div className='bg-black opacity-70 p-4 mt-4 h-[500px]'>
    Lditate maxime quo. Dolores ad sapiente nisi! Eaque architecto itaque assumenda iusto? Quae officia tempora omnis deleniti pariatur ducimus eius odio.
  </div>
  </>
}

export default AboutUs
