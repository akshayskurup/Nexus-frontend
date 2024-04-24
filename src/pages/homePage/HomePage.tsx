import React from 'react'
import UserProfile from '../../components/UserProfile'
import NavBar from '../../components/NavBar'
import AddPost from '../../components/AddPost'

function HomePage() {
  return (
    <>
    
    <div className='sticky top-0'>
        <NavBar />
        <div className='flex'>
            <UserProfile />
            <div className='ml-5'>
            <AddPost />
            </div>
        </div>
    </div>
    </>
  )
}

export default HomePage