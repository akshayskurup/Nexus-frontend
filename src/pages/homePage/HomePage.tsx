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
import SkeletonUserProfile from '../../components/skeleton/SkeletonUserProfile'
import SkeletonSuggestion from '../../components/skeleton/SkeletonSuggestion'
import SkeletonPost from '../../components/skeleton/SkeletonPost'
import SkeletonAddPost from '../../components/skeleton/SkeletonAddPost'

function HomePage() {
  const dispatch = useDispatch()
  // const posts = useSelector((state:any)=>state.auth.posts)
  const [allPost,setAllPost] = useState([])
  const [loading,setLoading] = useState(false)

  const handlePost = ()=>{
    setLoading(true)
    getAllPost()
    .then((response:any)=>{
      const data = response.data;
      if(response.status===200){
        dispatch(setPosts({posts:data.post}))
        setAllPost(data.post);
        setTimeout(()=>{
        setLoading(false)

        },1500)
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
      <div className='hidden md:block z-10 sticky top-0 '>
        <NavBar />
      </div>
      <div className='sticky top-0 md:hidden'>
        <TopNavBar />
      </div>
      <div className='fixed bottom-0 w-full md:hidden'>
        <BottomNavBar />
      </div>
      <div className='flex flex-row justify-center lg:flex lg:flex-row xl:justify-start lg:ml-5'>
        <div className='hidden xl:block w-1/4 sticky top-10 h-screen'>
          {loading ? <SkeletonUserProfile /> : <UserProfile />}
        </div>
        <div className='md:ml-4'>
          {loading ? <SkeletonAddPost /> : <AddPost handlePost={handlePost} />}
          {loading
            ? Array(3).fill().map((_, index) => <SkeletonPost key={index} />)
            : allPost && allPost.map(post => (
              <Posts key={post._id} post={post} handlePost={handlePost} explore={false} />
            ))}
        </div>
        <div className='hidden xl:block w-1/4 sticky top-10 h-screen ml-1'>
          {loading ? <SkeletonSuggestion /> : <Suggestion />}
        </div>
      </div>
    </>
  );

}

export default HomePage