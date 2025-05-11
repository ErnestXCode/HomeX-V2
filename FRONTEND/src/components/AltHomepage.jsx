import React from 'react'
import { useDispatch } from 'react-redux'
import { toggleBrowseListings } from '../features/stylings/styleSlice'
import bgImage from '../assets/bg3.jpg'
import Header from './Header'
import { Link } from 'react-router-dom'

const AltHomepage = () => {
    const dispatch = useDispatch()
    const bgStyles = {
        backgroundImage: `url(${bgImage})`
    }

  return (
    <>
    <Header />
    <nav className="bg-black text-white sticky top-0 z-20 p-2 flex">
      <ul className='flex items-center gap-2 m-2 mr-2'>
        <li>
          <Link to='/login' className='active:bg-gray-500 text-blue-500 p-2 rounded-2xl'>Log in</Link>
        </li>
        <li>
          <Link to='/signup' className='active:bg-gray-500 text-blue-500 p-2 rounded-2xl'>Sign up</Link>
        </li>
      </ul>
      </nav>
    <div style={bgStyles} className='bg-cover'>
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

export default AltHomepage
