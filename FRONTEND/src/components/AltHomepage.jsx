import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { selectBrowseListingsState, toggleBrowseListings } from '../features/stylings/styleSlice'
import Header from './Header'
import { Link } from 'react-router-dom'
import Listings from './Listings'

const AltHomepage = () => {
    const dispatch = useDispatch()
    const displayState = useSelector(selectBrowseListingsState)

  return (
    <>
   
    {
      displayState ? <Listings /> : (
       <>
    <Header />
      <nav className="bg-black text-white sticky top-0 z-20 p-2 flex">
      <ul className='flex items-center gap-2 ml-auto text-white font-semibold'>
        <li>
          <Link to='/login' className='active:bg-gray-500  p-2 rounded-2xl'>Log in</Link>
        </li>
        <li>
          <Link to='/signup' className='active:bg-gray-500  p-2 rounded-2xl'>Register</Link>
        </li>
      </ul>
      </nav>
    <div className='bg-cover'>
        <section className='bg-black/70 p-3'>
        <h1 className='text-5xl font-semibold'>Find your </h1>
        <h1 className='text-5xl font-semibold mb-5'>perfect Home </h1>
        <p className='opacity-70 mb-5'>Lorem ipsum dolor sit amet consectetur adipisicing elit. Molestiae iusto blanditiis sit? Sit similique, ab doloribus voluptate earum, tenetur voluptates sunt sapiente esse asperiores fugit a odio at, fugiat et.</p>
      <button onClick={() => dispatch(toggleBrowseListings())} className='bg-blue-600 p-2 w-50 rounded-[5px] mb-5' >Browse Listings</button>
        </section>
    </div>
    </>
    )
    }
    
    </>
  
  )
}

export default AltHomepage
