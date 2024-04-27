import React, { useEffect, useState } from 'react'
import UserProfile from '../../components/UserProfile'
import NavBar from '../../components/NavBar'
import AddPost from '../../components/AddPost'
import Suggestion from '../../components/Suggestion'
import { getAllPost } from '../../services/api/user/apiMethods'
import { toast } from 'sonner'
import Posts from '../../components/Posts'

function HomePage() {
  const [allPost,setAllPost] = useState([])


  useEffect(()=>{
    getAllPost()
    .then((response:any)=>{
      const data = response.data;
      if(response.status===200){
        setAllPost(data.post);
      }else{
        toast.error(data.message)
      }
    })
  },[])

  
  return (
    <>
    
    <div className='sticky top-0'>
        <NavBar />
        <div className='flex'>
            <UserProfile />
            <div className='ml-5'>
            <AddPost />
            {allPost && allPost.map((post)=>(
              <Posts key={post._id} post={post} />
          ))}
            </div>
            <div className='ml-5'>
            <Suggestion />
            </div>
        </div>
    </div>
    </>
  )
}

export default HomePage