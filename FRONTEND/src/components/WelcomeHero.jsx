import React from 'react'
import NavElements from './NavElements'

const WelcomeHero = () => {
  // for some reason this is huge
  // i think its cos of NavElements,footer, fetching areas, and cards improve on that
  return (
    <div className="bg-[#333]/50 border-b-1 border-white text-center h-40 rounded-b-3xl">
      <nav className="p-2">
        <ul className="flex items-center justify-end p-2 gap-3">
          <NavElements link={'/contact-us'}>Contact us</NavElements>
          <NavElements link={''}>Web</NavElements>
        </ul>
      </nav>
      <h1 className="text-3xl">Welcome to Home<span
      className='text-blue-500 font-semibold'>X</span></h1>
      <p className="font-serif text-white/70 p-3">A motto or something</p>
    </div>
  )
}

export default WelcomeHero
