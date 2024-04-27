import { faBookmark, faCommentDots, faEllipsisV, faHeart, faImage, faMultiply } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import Modal from "react-modal";
import { useDispatch, useSelector } from 'react-redux'
import { LikePost, UpdatePost } from '../services/api/user/apiMethods';
import { setPosts } from '../utils/reducers/authSlice';
import { toast } from 'sonner';
import { useFormik } from 'formik';
import * as Yup from'yup';


function ReportOptionModal({isOpen,onClose,post}){

  return(
    <>
    <Modal
    isOpen={isOpen}
      onRequestClose={onClose}
      className=" border-2 border-black absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-11/12 sm:w-3/4 md:w-2/3 lg:w-1/2 xl:w-1/3 bg-white rounded-lg shadow-lg p-6"
    >
      <h2 className="text-2xl font-bold mb-4 text-center">Report</h2>
      <hr className="h-px my-3 bg-gray-200 border-0 dark:bg-gray-700" />
      <p className='cursor-pointer'>Spam</p>
      <hr className="h-px my-2 bg-gray-200 border-0 dark:bg-gray-700" />
      <p className='cursor-pointer'>Spam</p>
      <hr className="h-px my-2 bg-gray-200 border-0 dark:bg-gray-700" />
      <p className='cursor-pointer'>Spam</p>
      <hr className="h-px my-2 bg-gray-200 border-0 dark:bg-gray-700" />
      <p className='cursor-pointer'>Spam</p>
      <hr className="h-px my-2 bg-gray-200 border-0 dark:bg-gray-700" />
      <p className='cursor-pointer'>Spam</p>
      <hr className="h-px my-2 bg-gray-200 border-0 dark:bg-gray-700" />

    </Modal>
    </>
  )
}

function EditPostModal({isOpen, onClose ,post}){
  const [valid, setValid] = useState(false);
  const [description, setDescription] = useState("");

  const user = useSelector((state:any)=>state.auth.user);
  const dispatch = useDispatch();
  const formik = useFormik({
    initialValues: {
      description: post.description,
    },
    validationSchema: Yup.object({
      description: Yup.string().trim().min(7, "Enter something.."),
    }),
    onSubmit: async(values) => {
      console.log("Form submitted with values:", values);
      const data = {
        userId: user._id,
        postId: post._id,
        description: values.description,
      };
      if(valid){
        UpdatePost(data)
        .then((response:any)=>{
          const data = response.data;
          if(response.status===200){
            dispatch(setPosts(data.posts));
            toast.success(data.message);
            onClose();
          }else{
            toast.error(data.message);
          }
        })
      }

    },
  });

  useEffect(() => {
    if (description.length >=7) {
        console.log(valid);
        setValid(true);
      
    } else {
        console.log(valid);
        
      setValid(false);
    }
  }, [description]);

  return(
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      className=" border-2 border-black absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-11/12 sm:w-3/4 md:w-2/3 lg:w-1/2 xl:w-1/3 bg-white rounded-lg shadow-lg p-6"
    >
      <h2 className="text-2xl font-bold mb-4 text-center">Edit Post</h2>
      <hr className="h-px my-3 bg-gray-200 border-0 dark:bg-gray-700" />

      <form onSubmit={formik.handleSubmit}>
        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">Description:</label>
          <input
            type="text"
            name="description"
            className="w-full border border-gray-300 rounded-md px-3 py-2"
            value={formik.values.description}
            onChange={(e) => {
                formik.handleChange(e);
                setDescription(e.target.value);
              }}
            onBlur={formik.handleBlur}
          />
          {formik.touched.description && formik.errors.description && (
            <div className="text-red-500 text-sm mt-1">
              {formik.errors.description}
            </div>
          )}
        </div>
        {post.imageUrl && (
          <div className="rounded-md w-36 h-48 relative">
            <>
              
              <img
                src={post.imageUrl}
                alt="Uploaded"
                className="object-conain w-full h-full rounded-md object-cover"
              />
            </>
          </div>
        )}
        <hr className="h-px my-3 bg-gray-200 border-0 dark:bg-gray-700" />
        <div className="mb-4 flex space-x-56">
          
          {valid && <button
            type="submit"
            className={` ${valid ? "bg-blue-500" : "bg-slate-400"} ${
              valid ? "" : "disabled"
            } h-8 flex items-center text-white px-4 py-2 rounded-md`}
          >
            Add
          </button>}
          
        </div>
      </form>
      
      
    </Modal>
  )
}


//----------------------------------------------------------------------------------------------


function OptionsModal({ isModalOpen, onModalClose,post }){
  const [isEditPostModalOpen,setIsEditPostModalOpen] = useState(false);
  const [reportOptionModal,setReportOptionModal] = useState(false);

  const user = useSelector((state:any)=>state.auth.user);

  const handleEditPostModal = ()=>{
    setIsEditPostModalOpen(true);
  }
  const handleReportModal = ()=>{
    setReportOptionModal(true)
  }
  const openModal = () => {
    setIsEditPostModalOpen(true);
  };

  const closeModal = () => {
    setIsEditPostModalOpen(false);
  };


  return(
    <>
    <Modal
    isOpen={isModalOpen}
    onRequestClose={onModalClose}
    className=" border-2 border-black absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-11/12 sm:w-3/4 md:w-2/3 lg:w-1/2 xl:w-1/3 bg-white rounded-lg shadow-lg p-6"
    >
      <p className="cursor-pointer mb-4 text-center">Delete</p>
      <hr className="h-px my-3 bg-gray-200 border-0 dark:bg-gray-700" />
      {post.userId._id==user._id &&
      <>
      <p className=" cursor-pointer mb-4 text-center" onClick={handleEditPostModal}>Edit</p>
      <hr className="h-px my-3 bg-gray-200 border-0 dark:bg-gray-700" />
      </>  }
      {post.userId._id!==user._id &&
            <p className="cursor-pointer mb-4 text-center" onClick={handleReportModal}>Report</p>
      }
    </Modal>
    {isEditPostModalOpen && <EditPostModal isOpen={openModal} onClose={closeModal} post={post}/>}
    {reportOptionModal && <ReportOptionModal isOpen={openModal} onClose={closeModal} post={post}/>}

    
    </>
  )
}



//-----------------------------------------------------------------------------------------

function Posts({post}) {
    const user = useSelector((state:any)=>state.auth.user);
    const [likedUsers,setLikedUsers] = useState(post.likes);
    const [isLikedByUser, setIsLikedByUser] = useState(post.likes.includes(user._id));
    const [likeCount, setLikeCount] = useState(post.likes.length)
    const [isDropdownVisible, setIsDropdownVisible] = useState(false);
    const [isOptionsModalOpen,setIsOptionsModalOpen] = useState(false);
    const dispatch = useDispatch();

    

    const handleLike = (userId:string,postId:string) => {
        LikePost(userId,postId)
        .then((response:any)=>{
          const data = response.data
          if(response.status===200){
            dispatch(setPosts({posts:data.posts}));
            setIsLikedByUser(!isLikedByUser);
            if(isLikedByUser){
              setLikedUsers((prev)=>{
                console.log("prev",prev);
                return prev.filter((likedUser)=>likedUser._id !== userId)
              })
              setLikeCount((prev)=>prev-1)
            }else{
              setLikedUsers((prev)=>[...prev,user])
              setLikeCount((prev)=>prev+1)
            }
          }else{
            toast.error(data.message)
          }
          
          
        })
      };
      
      const likeColor = isLikedByUser ? '#ff0000' : '#837D7D';

      const handleModal = ()=>{
        setIsOptionsModalOpen(!isOptionsModalOpen)
      }


  return (
    <div key={post._id} className=' w-[40rem] ml-3 rounded-md mt-5 bg-white'>
              <div className='ml-4'>
              <div className='flex items-center ml-5 pt-2'>
                <img className='w-11 h-11 rounded-full' src={post.userId.profileImage} alt="img" />
                <div className='ml-8'>
                <p className='font-semibold text-lg'>{post.userId.userName}</p>
                <p className='text-xs text-[#8B8585]'>10 minutes ago</p>
                </div>
                <FontAwesomeIcon className='ml-auto mr-11 cursor-pointer' icon={faEllipsisV} onClick={handleModal} />
                
              </div>
              {isDropdownVisible && (
          <div className='dropdown-menu'>
            {/* Add delete and edit options here */}
            <button onClick={() => handleEdit(post._id)}>Edit</button>
            <button onClick={() => handleDelete(post._id)}>Delete</button>
          </div>
        )}
                <p className='ml-6 mt-5 my-5 font-semibold text-sm'>{post.description}</p>
               
                <div className='flex justify-center flex-col ml-6 '>
                
                  <img className=' max-h-[500px] max-w-[560px] rounded-lg' src={post.imageUrl} alt="" />
                <div className='flex gap-24 py-5'>
                  <div className='flex'>
                  <FontAwesomeIcon  className='w-6 h-6 ' onClick={()=>handleLike(user._id,post._id)}  style={{ color: likeColor }} icon={faHeart} />
                  <p className='ml-2'>{likeCount}</p>
                  </div>
                  <div className='flex'>
                  <FontAwesomeIcon  className='w-6 h-6 text-[#837D7D]' icon={faCommentDots} />
                  <p>120</p>
                  </div>
                  <FontAwesomeIcon className='w-6 h-6 text-[#837D7D]' icon={faBookmark} />
                </div>
                
                </div>
                </div>
                {isOptionsModalOpen && (
                <OptionsModal isModalOpen={handleModal} onModalClose={handleModal} post={post} />
                  )}
            </div>
  )
}

export default Posts  