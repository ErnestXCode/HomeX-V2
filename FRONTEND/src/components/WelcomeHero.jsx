import React from 'react'
import { Link } from 'react-router-dom'

const WelcomeHero = () => {
  return (
    <div className="bg-[#333]/50 border-b-1 border-white text-center h-40 rounded-b-3xl">
      <nav className="p-2">
        <ul className="flex items-center justify-end p-2 gap-3">
          <li className=""><Link to='/contact-us'>Contact us</Link></li>
          <li className=""><Link to='/contact-us'>Web</Link></li>
        </ul>
      </nav>
      <h1 className="text-3xl">Welcome to Home<span
      className='text-blue-500 font-semibold'>X</span></h1>
      <p className="font-serif text-white/70 p-3">A motto or something</p>
    </div>
  )
}

export default WelcomeHero
