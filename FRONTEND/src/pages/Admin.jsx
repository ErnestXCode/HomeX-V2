import React from 'react'
import { useSelector } from 'react-redux'
import { selectCurrentUser } from '../features/users/userSlice'
import Dashboard from '../components/Dashboard'
import NotFound from './NotFound'

const Admin = () => {
    const user = useSelector(selectCurrentUser)
   console.log(user)

  return (
    <Dashboard />
  )
}

export default Admin
