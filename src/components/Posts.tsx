import {
  faBookmark,
  faCheckCircle,
  faCircleChevronRight,
  faCommentDots,
  faEllipsisV,
  faHeart,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import  {useEffect, useState } from "react";
import Modal from "react-modal";
import { useDispatch, useSelector } from "react-redux";
import {
  LikePost,
  ReportPost,
  SavePost,
  UpdatePost,
  addComment,
  getCommentsCount,
  postDeletion,
} from "../services/api/user/apiMethods";
import { setPosts, updateUser } from "../utils/reducers/authSlice";
import { toast } from "sonner";
import { useFormik } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { BASE_URL } from "../constants/urls";
import Comments from "./Modals/Comments";
import { Link } from "react-router-dom";

function ReportOptionModal({ isOpen, onClose, post, user }:any) {
  const onReport = (reason: string) => {
    ReportPost({
      userId: user._id,
      postId: post._id,
      reason,
    }).then((response: any) => {
      const data = response.data;
      if (response.status === 200) {
        toast.success(data.message);
        onClose();
      } else {
        toast.error(data.message);
      }
    });
  };
  return (
    <>
      <Modal
        isOpen={isOpen}
        onRequestClose={onClose}
        className=" border-2 border-black absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-11/12 sm:w-3/4 md:w-2/3 lg:w-1/2 xl:w-1/3 bg-white rounded-lg shadow-lg p-6"
      >
        <h2 className="text-2xl font-bold mb-4 text-center">Report</h2>
        <hr className="h-px my-3 bg-gray-200 border-0 dark:bg-gray-700" />
        <p className="cursor-pointer" onClick={() => onReport("It's a spam")}>
          It's a spam
        </p>
        <hr className="h-px my-2 bg-gray-200 border-0 dark:bg-gray-700" />
        <p
          className="cursor-pointer"
          onClick={() => onReport("Nudity or sexual activity")}
        >
          Nudity or sexual activity
        </p>
        <hr className="h-px my-2 bg-gray-200 border-0 dark:bg-gray-700" />
        <p
          className="cursor-pointer"
          onClick={() => onReport("Hate speech or symbols")}
        >
          Hate speech or symbols
        </p>
        <hr className="h-px my-2 bg-gray-200 border-0 dark:bg-gray-700" />
        <p
          className="cursor-pointer"
          onClick={() => onReport("False information")}
        >
          False information
        </p>
        <hr className="h-px my-2 bg-gray-200 border-0 dark:bg-gray-700" />
        <p className="cursor-pointer" onClick={() => onReport("Bullying")}>
          Bullying
        </p>
        <hr className="h-px my-2 bg-gray-200 border-0 dark:bg-gray-700" />
      </Modal>
    </>
  );
}

function EditPostModal({ isOpen, onClose, post, handlePost }:any) {
  const [valid, setValid] = useState(false);
  const [description, setDescription] = useState("");

  const user = useSelector((state: any) => state.auth.user);
  const dispatch = useDispatch();
  const formik = useFormik({
    initialValues: {
      description: post.description,
    },
    validationSchema: Yup.object({
      description: Yup.string().trim().min(7, "Enter something.."),
    }),
    onSubmit: async (values) => {
      const data = {
        userId: user._id,
        postId: post._id,
        description: values.description,
      };
      if (valid) {
        UpdatePost(data).then((response: any) => {
          const data = response.data;
          if (response.status === 200) {
            dispatch(setPosts(data.posts));
            toast.success(data.message);
            handlePost()
            onClose();
          } else {
            toast.error(data.message);
          }
        });
      }
    },
  });

  useEffect(() => {
    if (description.length >= 7) {
      setValid(true);
    } else {
      setValid(false);
    }
  }, [description]);

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      className=" border-2 border-black absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-11/12 sm:w-3/4 md:w-2/3 lg:w-1/2 xl:w-1/3 bg-white rounded-lg shadow-lg p-6"
    >
      <h2 className="text-2xl font-bold mb-4 text-center text-black">Edit Post</h2>
      <hr className="h-px my-3 bg-gray-200 border-0 dark:bg-gray-700" />

      <form onSubmit={formik.handleSubmit}>
        <div className="mb-4">
          <label className="block text-sm font-medium mb-2 text-black">Description:</label>
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
          {formik.touched.description && formik.errors.description && typeof formik.errors.description === 'string' && (
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
          {valid && (
            <button
              type="submit"
              className={` ${valid ? "bg-blue-500" : "bg-slate-400"} ${
                valid ? "" : "disabled"
              } h-8 flex items-center text-white px-4 py-2 rounded-md`}
            >
              Add
            </button>
          )}
        </div>
      </form>
    </Modal>
  );
}

//----------------------------------------------------------------------------------------------

function OptionsModal({ isModalOpen, onModalClose, post, handlePost}:any) {
  const dispatch = useDispatch()
  const [isEditPostModalOpen, setIsEditPostModalOpen] = useState(false);
  const [reportOptionModal, setReportOptionModal] = useState(false);

  const user = useSelector((state: any) => state.auth.user);

  const handleEditPostModal = () => {
    setIsEditPostModalOpen(true);
  };
  const handleReportModal = () => {
    setReportOptionModal(true);
  };

  const openModal = () => {
    setIsEditPostModalOpen(true);
  };
  const openReportModal = () => {
    setReportOptionModal(true);
  };

  const closeModal = () => {
    setIsEditPostModalOpen(false);
  };
  const closeReportModal = () => {
    setReportOptionModal(false);
  };
  const handleDeletion = ()=>{
    postDeletion(post._id)
    .then((response: any) => {
      const data = response.data
      if(response.status===200){
        dispatch(setPosts({posts:data.updatedPost}));
        onModalClose()
        handlePost()
      }
  })
  .catch(error => {
    console.error('Error:', error);
    toast.error("Error during getting my comments");
  });

    
  }

  return (
    <>
      <Modal
        isOpen={isModalOpen}
        onRequestClose={onModalClose}
        className=" border-2 border-black absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-11/12 sm:w-3/4 md:w-2/3 lg:w-1/2 xl:w-1/3 bg-white rounded-lg shadow-lg p-6"
      >
        {post.userId._id == user._id && (
          <>
        <p className="cursor-pointer mb-4 text-center text-black" onClick={handleDeletion}>Delete</p>
        <hr className="h-px my-3 bg-gray-200 border-0 dark:bg-gray-700" />
        </>
        )}
        {post.userId._id == user._id && (
          <>
            <p
              className=" cursor-pointer mb-4 text-center text-black"
              onClick={handleEditPostModal}
            >
              Edit
            </p>
            <hr className="h-px my-3 bg-gray-200 border-0 dark:bg-gray-700" />
          </>
        )}
        {post.userId._id !== user._id && (
          <p
            className="cursor-pointer mb-4 text-center text-black"
            onClick={handleReportModal}
          >
            Report
          </p>
        )}
      </Modal>
      {isEditPostModalOpen && (
        <EditPostModal isOpen={openModal} onClose={closeModal} post={post} handlePost={handlePost} />
      )}
      {reportOptionModal && (
        <ReportOptionModal
          isOpen={openReportModal}
          onClose={closeReportModal}
          post={post}
          user={user}
        />
      )}
    </>
  );
}

//-----------------------------------------------------------------------------------------

function Posts({ post, handlePost , handleSavedPost,explore}:any) {
  const user = useSelector((state: any) => state.auth.user);
  const [likedUsers, setLikedUsers] = useState(post.likes);
  const [isLikedByUser, setIsLikedByUser] = useState(post.likes.includes(user._id));
  const [isSavedByUser, setIsSavedByUser] = useState(user.savedPost.includes(post._id));
  const [likeCount, setLikeCount] = useState(post.likes.length);
  const [isOptionsModalOpen, setIsOptionsModalOpen] = useState(false);
  const [isCommentModalOpen, setIsCommentModalOpen] = useState(false);
  const [myComment,setMyComment] = useState('');
  const [comment,setComment] = useState('')
  const [count,setCount] = useState(0)
  const dispatch = useDispatch();

  const [refetchData, setRefetchData] = useState(false);
  console.log(likedUsers)
  // Define a callback function to trigger refetch of data
  const handleCommentDelete = () => {
    // Update state to trigger useEffect
    setRefetchData(prevState => !prevState);
  };



  const fetchData = async (userId:string, postId:string) => {
    try {
      
      const response = await axios.get(`${BASE_URL}/api/post/my-comment`, {
        params: {
          userId: userId,
          postId: postId
        }
      });
      return response.data;
    } catch (error) {
      console.error(error);
      throw new Error('Failed to fetch data');
    }
  };

  useEffect(()=>{
  fetchData(user._id, post._id)
  .then((response: any) => {
      setMyComment(response.comment);
  })
  .catch(error => {
    console.error('Error:', error);
    toast.error("Error during getting my comments");
  });

  getCommentsCount(post._id)
  .then((response: any) => {
    setCount(response.data.totalComment);
})
.catch(error => {
  console.error('Error:', error);
  toast.error("Error during getting my comments");
});

  },[post,refetchData,user._id,])
  

  const handleLike = (userId: string, postId: string) => {
    setIsLikedByUser(!isLikedByUser);
    LikePost(userId, postId).then((response: any) => {
      const data = response.data;
      if (response.status === 200) {
        dispatch(setPosts({ posts: data.posts }));
        setIsLikedByUser(!isLikedByUser);
        if (isLikedByUser) {
          setLikedUsers((prev:any) => {
            return prev.filter((likedUser:any) => likedUser._id !== userId);
          });
          setLikeCount((prev:any) => prev - 1);
        } else {
          setLikedUsers((prev:any) => [...prev, user]);
          setLikeCount((prev:any) => prev + 1);
        }
      } else {
        toast.error(data.message);
        setIsLikedByUser(!isLikedByUser);
      }
    });
  };

  const handleSavePost = (userId: string, postId: string) => {
    SavePost({ userId, postId }).then((response: any) => {
      const data = response.data;
      if (response.status === 200) {
        dispatch(updateUser({ user: data.updatedUser }));
        setIsSavedByUser(!isSavedByUser);
        handleSavedPost()
      } else {
        toast.error(data.message);
      }
    });
  };
  const handlePostComment = (userId:string,postId:string,post:any)=>{
    addComment({userId,postId,comment})
    .then((response: any) => {
      const data = response.data;
      if (response.status === 200) {
        setComment('')
        toast.success(data.message);
        if (typeof handleSavedPost === 'function') {
          console.log("Workingg");
          handleSavedPost();
        }
        if(!explore){
        handlePost(post.userId._id);
        }else{
          handlePost(post._id);
        }
      } else {
        toast.error(data.message);
      }
    });
  }

  const likeColor = isLikedByUser ? "#ff0000" : "#837D7D";
  const savedColor = isSavedByUser ? "#2892FF" : "#837D7D";

  const handleModal = () => {
    setIsOptionsModalOpen(!isOptionsModalOpen);
  };

  const handleCommentModal = ()=>{
    setIsCommentModalOpen(!isCommentModalOpen)
  }

  // const handleCommentDelete = () => {
  //   setCount((prevCount) => prevCount - 1);
  //   console.log("prevCount",count);
    
  // };

  return (
<div key={post._id} className={`w-[25rem] ${explore ? 'md:w-[40rem]' : 'md:w-[40rem]'} md:ml-3 rounded-md mt-5 bg-white`}>
  <div className={` ${explore ? 'ml-0':'ml-4'}`}>
    <div className={`flex items-center ml-5 ${explore ? 'pt-0':'pt-2'}`}>
      <img
        className="w-11 h-11 rounded-full"
        src={post.userId.profileImage}
        alt="img"
      />
      <div className="ml-8">
        <p className="font-semibold text-lg text-black">
          {user._id===post.userId._id ? (<Link to={`/my-profile`}>{post.userId.userName} {post.userId.premium?<FontAwesomeIcon icon={faCheckCircle} color='#2892FF' />:""}</Link>):
          (<Link to={`/profile/${post.userId._id}`}>{post.userId.userName} {post.userId.premium?<FontAwesomeIcon icon={faCheckCircle} color='#2892FF' />:""}</Link>)
          }
        
        </p>
        {/* <p className="text-xs text-[#8B8585]">10 minutes ago</p> */}
      </div>
      <FontAwesomeIcon
        className="ml-auto mr-11 cursor-pointer text-black"
        icon={faEllipsisV}
        onClick={handleModal}
      />
    </div>
    <p className={`ml-6 ${explore ? "mt-2 my-2":"mt-5 my-5"} font-semibold text-sm text-black`}>
      {post.description}
    </p>

    <div className="flex justify-center flex-col ml-6 ">
      <img
        className={` ${explore ? "max-h-[300px] max-w-[360px] ml-auto mr-auto":"max-h-[500px] max-w-[560px] mr-5"}  rounded-lg`}
        src={post.imageUrl}
        alt=""
      />
      <div className={`flex ${explore ? "py-2 gap-20":"py-5 gap-24"}`}>
        <div className="flex">
          <FontAwesomeIcon
            className="w-6 h-6 cursor-pointer"
            onClick={() => handleLike(user._id, post._id)}
            style={{ color: likeColor }}
            icon={faHeart}
          />
          <p className="ml-2 text-black">{likeCount}</p>
        </div>
        <div className="flex" onClick={count !== 0 ? handleCommentModal : ()=>{}}>
          <FontAwesomeIcon
            className="w-6 h-6 text-[#837D7D] cursor-pointer"
            icon={faCommentDots}
          />
          <p className="ml-2 text-black">{count}</p>
        </div>
        <FontAwesomeIcon
          className="w-6 h-6 cursor-pointer"
          style={{ color: savedColor }}
          onClick={() => handleSavePost(user._id, post._id)}
          icon={faBookmark}
        />
      </div>
      {myComment && 
      <div className="flex items-center">
        <p className="max-w-[32rem] font-semibold text-black">{user.userName}</p>
        <p className="text-black">:{myComment}</p>
      </div>
      }
      {count>1 && 
      <p className="text-sm mt-2 mb-1 cursor-pointer text-black" onClick={handleCommentModal}>View {count} comments</p>}
      <hr className="bg-slate-500 mr-10"/>
      <div className="flex items-center">
        <img
          className="w-9 h-9 rounded-full"
          src={user.profileImage}
          alt="img"
        />
        <div className="ml-5 mb-3">
          <div className="bg-[#EAEAEA] text-black mt-3 h-8 w-[17rem] md:w-[32rem] rounded-full flex items-center">
            <input
              type="text"
              name="description"
              value={comment}
              onChange={(e)=>setComment(e.target.value)}
              className="ml-2 bg-transparent border-none focus:outline-none flex-grow"
              placeholder="Write your comment"
            />
            {comment.length>=1 &&
            <button type="submit" onClick={()=>handlePostComment(user._id,post._id,post)}>
              <FontAwesomeIcon
                className="ml-7 text-[#2892FF]"
                size="xl"
                icon={faCircleChevronRight}
              />
            </button>
            }
          </div>
        </div>
      </div>
    </div>
  </div>
  {isOptionsModalOpen && (
    <OptionsModal
      isModalOpen={handleModal}
      onModalClose={handleModal}
      handlePost={handlePost}
      post={post}
    />
  )}
  {isCommentModalOpen && (
    <Comments 
      isModalOpen={handleCommentModal}
      onModalClose={handleCommentModal}
      post={post}
      onDeleteComment={handleCommentDelete}
    />
  )}
</div>


  );
}

export default Posts;
