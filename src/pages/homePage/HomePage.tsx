import React, { useEffect, useState } from 'react'
import UserProfile from '../../components/UserProfile'
import NavBar from '../../components/NavBar'
import AddPost from '../../components/AddPost'
import Suggestion from '../../components/Suggestion'
import { getAllPost } from '../../services/api/user/apiMethods'
import { toast } from 'sonner'
import Posts from '../../components/Posts'
import { useDispatch, useSelector } from 'react-redux'
import { setPosts } from '../../utils/reducers/authSlice'
import BottomNavBar from '../../components/responsiveNavBars/BottomNavBar'
import TopNavBar from '../../components/responsiveNavBars/TopNavBar'

function HomePage() {
  const dispatch = useDispatch()
  // const posts = useSelector((state:any)=>state.auth.posts)
  const [allPost,setAllPost] = useState([])

  const handlePost = ()=>{
    getAllPost()
    .then((response:any)=>{
      const data = response.data;
      if(response.status===200){
        dispatch(setPosts({posts:data.post}))
        setAllPost(data.post);
      }else{
        toast.error(data.message)
      }
    })
  }

  useEffect(()=>{
    handlePost()
  },[])

  
  return (
    <>
    
    <div className='hidden md:block sticky top-0 '>
        <NavBar />
      </div>
      <div className='sticky top-0 md:hidden'>
        <TopNavBar />
      </div>
      <div className=' fixed bottom-0 w-full md:hidden'>
        <BottomNavBar />
      </div>
      <div>
        
      </div>
        <div className='flex flex-row justify-center lg:flex lg:flex-row xl:justify-start lg:ml-5'>
          <div className='hidden xl:block '>
            <UserProfile />
          </div>
            
              <div className="md:ml-4 ">
            <AddPost handlePost={handlePost}/>
            {allPost && allPost.map((post)=>(
              <Posts key={post._id} post={post} handlePost={handlePost} />
          ))}
            </div>
            <div className='ml-5 hidden'>
            <Suggestion />
            </div>
        </div>
    
    </>
  )
}

export default HomePage