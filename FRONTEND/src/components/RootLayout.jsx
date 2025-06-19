import React from 'react'
import { Outlet } from 'react-router-dom'
import BottomNav from './BottomNav'

const RootLayout = () => {
  return (
    <>
      <Outlet />
      <BottomNav />
    </>
  )
}

export default RootLayout
