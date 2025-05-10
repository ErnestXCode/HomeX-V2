import React from 'react'
import { useDispatch } from 'react-redux'
import { toggleBrowseListings } from '../features/stylings/styleSlice'
// import bgImage from '../assets/bg3.jpg'
import Header from './Header'

const AltHomepage = () => {
    const dispatch = useDispatch()
//     const bgStyles = {
//         backgroundImage: `url(${bgImage})`
//     }
//     // not working
  return (
    <>
    <Header />
    <div className='bg-cover bg-yellow-800 bg-blend-luminosity'>
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
