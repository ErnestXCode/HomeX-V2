import React from 'react'
import { useSelector } from 'react-redux'
import { selectCurrentUser } from '../features/users/userSlice'
import Dashboard from '../components/Dashboard'

const Admin = () => {
    const user = useSelector(selectCurrentUser)
   console.log(user)

  return (
    <div>
        {user?.isAdmin ? <Dashboard /> : '404 not Found'}
    </div>
  )
}

export default Admin
