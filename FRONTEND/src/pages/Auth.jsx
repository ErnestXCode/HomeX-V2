import React, { useState } from 'react'
// import SignUp from '../components/SignUp'
// import Login from '../components/LogIn'
// import WelcomeHero from '../components/WelcomeHero'
import BottomNav from '../components/BottomNav'
import Login from './LogIn'
import SignUp from './SignUp'

const Auth = () => {
  const [loginClicked, setLoginCicked ] = useState(false)
  const loginForm = () => {
    setLoginCicked(true)
  }
  const signupForm = () => {
    setLoginCicked(false)
  }
  return (
    <>
    
  <nav className='p-2 m-2 mb-0 text-[.9rem] border-t border-white rounded-full sticky top-0'>
    <ul className='flex gap-3 justify-around'>
      <li onClick={signupForm} className={loginClicked ? '' : 'border-b-2 border-blue-600'}  >
        Sign up
      </li>
      <li onClick={loginForm} className={loginClicked ? 'border-b-2 border-blue-600' : ''}>
        Log in
      </li>
    </ul>
  </nav>
  {loginClicked ? <Login /> : <SignUp />}
  <BottomNav />
    </>
  )
}

export default Auth
