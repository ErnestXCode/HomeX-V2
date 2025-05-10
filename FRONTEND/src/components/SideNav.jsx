import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { selectSidebarState, toggleSideNav } from '../features/stylings/styleSlice'

const SideNav = () => {
  const sideBarState = useSelector(selectSidebarState)

  const dispatch = useDispatch()

  const sideBarStyles = {
    display : sideBarState ? 'flex': 'none'
  }

  return (
      <div style={sideBarStyles} className='hidden flex-col bg-gray-900 items-start fixed right-0 top-0 h-screen z-30 min-w-80 
  
      p-5
      '
      >
      <button onClick={() => dispatch(toggleSideNav())}  className='ml-auto'>X</button>
      <button className='bg-white w-[100%] p-1 mt-4 rounded-[10px] text-black'><Link className='p-5' to='/login'>Log in</Link></button>
      <button className='bg-blue-600  w-[100%] p-1 mt-4 rounded-[10px]'><Link className='p-5' to='/signup'>Register</Link></button>
      {/* make licks cover the whole button */}
      <ul className='bg-gray-700 p-2 mt-4 w-[100%] rounded-2xl flex flex-col'>
        <li className="p-2">
          <Link
            to="/"
          >
            Home
          </Link>
        </li>
       
        <li className='p-2'>
          <Link
            to=""
          >
            Language
          </Link>
        </li>
      </ul>
      <ul className='bg-gray-700 p-2 mt-4 w-[100%] rounded-2xl flex flex-col'>
        <li className="p-2">
          <Link
            to=""
          >
            Announcement
          </Link>
        </li>
       
        <li className='p-2'>
          <Link
            to=""
          >
            Language
          </Link>
        </li>
        <li className='p-2'>
          <Link
            to="/about-us"
          >
            About us
          </Link>
        </li>
      </ul>
    </div>
  )
}

export default SideNav
