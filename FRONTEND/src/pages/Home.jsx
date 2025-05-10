import React from 'react'
import Listings from '../components/Listings'
import AltHomepage from '../components/AltHomepage'
import { useSelector } from 'react-redux'
import { selectBrowseListingsState } from '../features/stylings/styleSlice'


const Home = () => {
  const browseListings = useSelector(selectBrowseListingsState)
  return (
    <div>
      {browseListings ? <Listings />: <AltHomepage />}
    </div>
  )
}

export default Home
