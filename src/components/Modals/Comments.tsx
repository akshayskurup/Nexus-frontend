import React, { useEffect, useState } from 'react'
import Modal from 'react-modal'
import { commentReply, deleteComment, getAllComments } from '../../services/api/user/apiMethods'
import { toast } from 'sonner'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCircleChevronRight, faTrash } from '@fortawesome/free-solid-svg-icons'
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'

function Comments({ isModalOpen, onModalClose, post, onDeleteComment  }) {
    const [allComments,setAllComments] = useState([]);
    const [replyComment,setReplyComment] = useState('');
    const [replyCommentDetails,setReplyCommentDetails] = useState({userName:"",comment:""})
    const [commentId,setCommentId] = useState(null);
    const [visibleReplies, setVisibleReplies] = useState({});
    const [reply,setReply] = useState(false)

    const user = useSelector((state:any)=>state.auth.user);


    const fetchComments = ()=>{
      getAllComments(post._id)
    .then((response:any)=>{
        const data = response.data;
        if(response.status===200){
            setAllComments(data.comment);
            setReplyComment('');
            
        }
    })
  }
    useEffect(()=>{
      fetchComments()
    },[])

    const handleDelete = (commentId:string)=>{
      deleteComment(commentId)
      .then((response:any)=>{
        const data = response.data;
        if(response.status===200){
            setAllComments(data.comments);
            onDeleteComment()
        }
    })
    }

    const handleReplyComment = ()=>{
      if(commentId){
        commentReply({userId:user._id,commentId,reply:replyComment})
        .then((response:any)=>{
          if(response.status===200){
            fetchComments();
          }
      })

      }
    }

    const toggleReplies = (commentId) => {
      setVisibleReplies((prevVisibleReplies:any) => ({
        ...prevVisibleReplies,
        [commentId]: !prevVisibleReplies[commentId],
      }));
    };
    
    const handleReplyButton = (commentId:any,userName:string,comment:string) =>{
        setCommentId(commentId);
        setReply(true);
        setReplyCommentDetails({userName,comment})
    }
    

  return (
    <>
    <Modal
        isOpen={isModalOpen}
        onRequestClose={onModalClose}
        className=" border-2 border-black absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-11/12 sm:w-3/4 md:w-2/3 lg:w-1/2 xl:w-1/2 bg-white rounded-lg shadow-lg p-6"
      >
          <div className="max-h-[54vh] overflow-y-auto">

        <h2 className="text-2xl font-bold mb-4 text-center">Comments</h2>
      <hr className="h-px my-3 bg-gray-200 border-0 dark:bg-gray-700" />
      {allComments && allComments.map((comment)=>(
        <>
        <div className='flex my-2 items-center'>
        <img className='w-9 h-9 rounded-full' src={comment.userId.profileImage} alt="" />
        <p className='ml-3 font-semibold'>
        {user._id===comment.userId._id?"You":(<Link to={`/profile/${comment.userId._id}`}>{comment.userId.userName}</Link>)}        </p>
        <p className='ml-5 max-w-80'>{comment.comment}</p>
        <p className='text-xs ml-auto'>{comment.elapsed}</p>
        
        {comment.userId._id===user._id && <FontAwesomeIcon className="ml-8 cursor-pointer" onClick={()=>handleDelete(comment._id)} icon={faTrash} />
}
        </div>
        <div className='flex ml-12 -mt-4 gap-6'>

       
        <p className='text-xs  font-semibold cursor-pointer' onClick={()=>handleReplyButton(comment._id,comment.userId.userName,comment.comment)}>reply</p>
        <p className='text-xs font-semibold cursor-pointer' onClick={()=>toggleReplies(comment._id)}>{visibleReplies[comment._id] ? 'Hide Replies' : 'View Replies'}</p>
        
        
        </div>
        
        {visibleReplies[comment._id] && comment.replies.map((cmt:any)=>(
          <div className='flex gap-5 ml-12 mt-2 mb-2 items-center'>
            <img className='w-7 h-7 rounded-full' src={cmt.userId.profileImage} alt="" />
          <p className='text-sm font-semibold'>{user._id===cmt.userId._id?"You":(<Link to={`/profile/${cmt.userId._id}`}>{cmt.userId.userName}</Link>)}</p>
          <p className='text-sm'>{cmt.reply}</p>
          </div>
        ))
        
        
        
        }
        
        <p>{comment.replies.userId}</p>
        </>
      ))}
      </div>
      {reply && 
      <>
      <hr className="h-px my-3 bg-gray-200 border-0 dark:bg-gray-700" />
      <p className='text-sm'>Replying to {replyCommentDetails.userName}: {replyCommentDetails.comment}</p>
      <div className="bg-[#EAEAEA] mt-3 h-8 w-[40rem] rounded-full flex items-center">

      <input
              type="text"
              name="description"
              className="ml-2 bg-transparent border-none focus:outline-none flex-grow"
              placeholder="Write your comment"
              onChange={(e)=>setReplyComment(e.target.value)}
              value={replyComment}
            />
            {replyComment.length>0 && 
            <button type="submit">
              <FontAwesomeIcon
                className="ml-7 text-[#2892FF]"
                size="xl"
                icon={faCircleChevronRight}
                onClick={handleReplyComment}
              />
            </button>
          }
          </div>
          </>
      }
          
      </Modal> 
      </>
  )
}

export default Comments