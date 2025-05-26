import React, { lazy, Suspense } from 'react'
import InitialLoader from '../components/InitialLoader'
const Listings = lazy(() => import('../components/Listings'))
// import AltHomepage from '../components/AltHomepage'
// import { useSelector } from 'react-redux'
// import { selectBrowseListingsState } from '../features/stylings/styleSlice'


const Home = () => {
  // const browseListings = useSelector(selectBrowseListingsState)
  return (
    <Suspense fallback={<InitialLoader />}>
      <Listings />
    </Suspense>
  )
}

export default Home
