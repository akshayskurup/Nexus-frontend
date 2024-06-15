import React, { useEffect, useState } from 'react'
import NavBar from '../../components/NavBar'
import TopNavBar from '../../components/responsiveNavBars/TopNavBar'
import BottomNavBar from '../../components/responsiveNavBars/BottomNavBar'
import UserProfile from '../../components/UserProfile'
import Suggestion from '../../components/Suggestion'
import { getAllPost } from '../../services/api/user/apiMethods'
import { useDispatch, useSelector } from 'react-redux'
import { toast } from 'sonner'
import { setPosts } from '../../utils/reducers/authSlice'
import PostView from '../../components/Modals/PostView'
import SkeletonPostThumbnail from '../../components/skeleton/SkeletonPostThumbnail'
import SkeletonUserProfile from '../../components/skeleton/SkeletonUserProfile'

function Explore() {
  const [allPost,setAllPost] = useState([])
  const [isPostModalOpen,setIsPostModalOpen] = useState(false)
  const [loading,setLoading] = useState(false)
  const [post,setPost] = useState();
    const dispatch = useDispatch();
    useEffect(()=>{
            setLoading(true)
            getAllPost()
            .then((response:any)=>{
              const data = response.data;
              if(response.status===200){
                dispatch(setPosts({posts:data.post}))
                setAllPost(data.post);
                 setLoading(false)
              }else{
                toast.error(data.message)
              }
            })
          }
    ,[])
    const handlePost = (Post:any)=>{
        setIsPostModalOpen(!isPostModalOpen)
        setPost(Post)
    }
  return (
    <>
     <div className='hidden md:block z-10 sticky top-0 '>
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
        <div className="hidden xl:block w-1/4 sticky top-10 h-screen">
        {loading ? <SkeletonUserProfile /> : <UserProfile />}
          </div>
          <div className="md:ml-10 mt-5 flex flex-wrap gap-x-10 gap-y-5">
          {loading 
            ? Array(6).fill().map((_, index) => <SkeletonPostThumbnail key={index} />)
            : allPost && allPost.map((Post) => (
                Post.imageUrl !== "" && (
                  <div className=" w-64 h-64 cursor-pointer" onClick={() => handlePost(Post)} key={Post._id}>
                    <img src={Post.imageUrl} alt="" />
                  </div>
                )
              ))
          }
    </div>       
        </div>
        {isPostModalOpen && (
    <PostView
      isModalOpen={handlePost}
      onModalClose={handlePost}
      post={post}
    />
  )}

    </>
  )
}

export default Explore