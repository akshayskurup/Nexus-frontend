import { chatUrl, connectionUrls, postUrl, userUrl } from "../../../constants/routes";
import { apiCall } from "./apiCalls";



//-----Register Type-----
interface formValues{
    name:string;
    email:string;
    password:string;
    confirmPassword:string;
}



//@des     User Login
//method   POST

export const postLogin = (userData:{email:string,password:string})=>{
    return new Promise((resolve,reject)=>{
        try {
            apiCall("post",userUrl.login,userData)
            .then((response)=>{
                resolve(response);
            })
            .catch((err)=>{
                reject(err);
            });
        } catch (error) {
            resolve({status:500,message:"Error in the postLogin"});
        }
    });
};

//@des     Register
//method   POST

export const postRegister = (userData:formValues)=>{
    return new Promise((resolve,reject)=>{
        try {
            apiCall("post",userUrl.register,userData)
            .then((response)=>{
                resolve(response);
            })
            .catch((err)=>{
                reject(err);
            })
        } catch (error) {
            resolve({status:500,message:"Erron in postRegister"});
        }
    });
}

//@des     Verify OTP
//method   POST

export const postOTP = (otp:{otp:string})=>{
    return new Promise((resolve,reject)=>{
        try {
            console.log("Otp from apimethod",otp)
            apiCall("post",userUrl.registerOtp,otp)
            .then((response)=>{
                resolve(response);
            })
            .catch((err)=>{
                reject(err);
            })
        } catch (error) {
            resolve({status:500,message:"Error in postOTP"});
        }
    });
} 

//@des     Resend OTP
//method   POST

export const postResendOtp = ()=>{
    return new Promise((resolve,reject)=>{
        try {
            apiCall("post",userUrl.resendOtp,"")
            .then((response)=>{
                resolve(response);
            })
            .catch((err)=>{
                reject(err);
            })
        } catch (error) {
            resolve({status:500,message:"Error in postResendOTP"});
        }
    });
}

//@des     Forget Password
//method   POST

export const postForgetPassword = (email:{email:string})=>{
    return new Promise((resolve,reject)=>{
        try {
            apiCall("post",userUrl.forgetPassword,email)
            .then((response)=>{
                resolve(response);
            })
            .catch((err)=>{
                reject(err);
            })
        } catch (error) {
            resolve({status:500,message:"Error in postForgetPassword"});
        }
    });
}

//@des     Forget Password OTP Verification
//method   POST

export const forgetOtp = (otp:{otp:string})=>{
    return new Promise((resolve,reject)=>{
        try {
            apiCall("post",userUrl.forgetOtp,otp)
            .then((response)=>{
                resolve(response);
            })
            .catch((err)=>{
                reject(err);
            })
        } catch (error) {
            resolve({status:500,message:"Error in forgetOtp"});
        }
    });
}

//@des     Reset Password
//method   POST

export const postResetPass = (userData:{password:string,confirmPassword:string})=>{
    return new Promise((resolve,reject)=>{
        try {
            apiCall("post",userUrl.resetPassword,userData)
            .then((response)=>{
                resolve(response);
            })
            .catch((err)=>{
                reject(err);
            })
        } catch (error) {
            resolve({status:500,message:"Error in postResetPass"});
        }
    });
}

//@des     Account Setup
//method   POST

export const accountSetup = (values:{userName: string, gender: string, bio: string, phone: number, profileImage: string, bgImage: string, userId:string})=>{
    return new Promise((resolve,reject)=>{
        try {
            apiCall("post",userUrl.accountSetup,values)
            .then((response)=>{
                resolve(response);
            })
            .catch((err)=>{
                reject(err)
            })
        } catch (error) {
            resolve({status:500,message:"Error in accountSetup"});

        }
    })
}

//@des     User profile
//method   GET

export const GetUserProfile = (userId:any)=>{
    return new Promise ((resolve,reject)=>{
        try {
            const url = `${userUrl.userProfile}/${userId}`
            console.log("url",url);
            
            apiCall("get",url,null)
            .then((response)=>{
                resolve(response);
            })
            .catch((err)=>{
                reject(err);
            })
        } catch (error) {
            resolve({status:500,message:"Error during fetching user data"});
        }
    })
}

//@des     Edit profile
//method   POST

export const EditUserProfile = (values:{userId:any,userName?:string,bio?:string,profileImage?:string,bgImage?:string})=>{
    return new Promise ((resolve,reject)=>{
        try {
            apiCall("post",userUrl.editProfile,values)
            .then((response)=>{
                resolve(response);
            })
            .catch((err)=>{
                reject(err);
            })
        } catch (error) {
            resolve({status:500,message:"Error during profile editing"});
        }
    })
}


//@des     Add new Post
//method   POST

export const addPost = (values:{userId:string,description:string,image?:string})=>{
    return new Promise ((resolve,reject)=>{
        try {
            apiCall("post",postUrl.addPost,values)
            .then((response)=>{
                resolve(response);
            })
            .catch((err)=>{
                reject(err);
            })
        } catch (error) {
            resolve({status:500,message:"Error in addPost"});
        }
    })
}

//@des     Get All Post
//method   POST

export const getAllPost = ()=>{
    return new Promise ((resolve,reject)=>{
        try {
            apiCall("get",postUrl.getAllPost,"")
            .then((response)=>{
                resolve(response);
            })
            .catch((err)=>{
                reject(err);
            })
        } catch (error) {
            resolve({status:500,message:"Error in getAllPost"});
        }
    })
}

//@des     Like Post
//method   POST

export const LikePost = (userId:any,postId:any)=>{
    return new Promise ((resolve,reject)=>{
        try {
            apiCall("post",postUrl.likePost,{userId,postId})
            .then((response)=>{
                resolve(response);
            })
            .catch((err)=>{
                reject(err);
            })
        } catch (error) {
            resolve({status:500,message:"Error during like"});
        }
    })
}

//@des     Update Post
//method   POST

export const UpdatePost = (values:{userId:any,postId:any,description:string})=>{
    return new Promise ((resolve,reject)=>{
        try {
            apiCall("post",postUrl.updatePost,values)
            .then((response)=>{
                resolve(response);
            })
            .catch((err)=>{
                reject(err);
            })
        } catch (error) {
            resolve({status:500,message:"Error during updatePost"});
        }
    })
}

//@des     Delete Post
//method   DELETE

export const postDeletion = (postId:any)=>{
    return new Promise ((resolve,reject)=>{
        try {
            
            const url = `${postUrl.deletePost}/${postId}`
            console.log("urlll",url);
            
            apiCall("delete",url,null)
            .then((response)=>{
                resolve(response);
            })
            .catch((err)=>{
                reject(err);
            })
        } catch (error) {
            resolve({status:500,message:"Error during post saving"});
        }
    })
}

//@des     Report Post
//method   POST

export const ReportPost = (values:{userId:any,postId:any,reason:string})=>{
    return new Promise ((resolve,reject)=>{
        try {
            apiCall("post",postUrl.reportPost,values)
            .then((response)=>{
                resolve(response);
            })
            .catch((err)=>{
                reject(err);
            })
        } catch (error) {
            resolve({status:500,message:"Error during reporting post"});
        }
    })
}

//@des     Save Post
//method   POST

export const SavePost = (values:{userId:any,postId:any})=>{
    return new Promise ((resolve,reject)=>{
        try {
            apiCall("post",postUrl.savePost,values)
            .then((response)=>{
                resolve(response);
            })
            .catch((err)=>{
                reject(err);
            })
        } catch (error) {
            resolve({status:500,message:"Error during post saving"});
        }
    })
}

//@des     Get User Post
//method   POST

export const UserPost = (userId:string)=>{
    return new Promise ((resolve,reject)=>{
        try {
            const url = `${postUrl.userPost}/${userId}`
            apiCall("get",url,null)
            .then((response)=>{
                resolve(response);
            })
            .catch((err)=>{
                reject(err);
            })
        } catch (error) {
            resolve({status:500,message:"Error during fetching post"});
        }
    })
}

//@des     Get User Saved Post
//method   POST

export const UserSavedPost = (userId:string)=>{
    return new Promise ((resolve,reject)=>{
        try {
            const url = `${postUrl.getSavedPost}/${userId}`
            apiCall("get",url,null)
            .then((response)=>{
                resolve(response);
            })
            .catch((err)=>{
                reject(err);
            })
        } catch (error) {
            resolve({status:500,message:"Error during fetching savedpost"});
        }
    })
}

//@des     Add Comment
//method   POST

export const addComment = (values:{userId:any,postId:any,comment:string})=>{
    return new Promise ((resolve,reject)=>{
        try {
            apiCall("post",postUrl.addComment,values)
            .then((response)=>{
                resolve(response);
            })
            .catch((err)=>{
                reject(err);
            })
        } catch (error) {
            resolve({status:500,message:"Error during posting comment"});
        }
    })
}


//@des     My Comment
//method   POST

// export const getMyComment = (values:{userId:any,postId:any})=>{
//     return new Promise ((resolve,reject)=>{
//         try {
//             console.log("Api",values);
            
//             apiCall("get",postUrl.getMyComment,values)
//             .then((response)=>{
//                 resolve(response);
//             })
//             .catch((err)=>{
//                 reject(err);
//             })
//         } catch (error) {
//             resolve({status:500,message:"Error during posting comment"});
//         }
//     })
// }


//@des     Get All Comment
//method   POST

export const getAllComments = (postId:any)=>{
    return new Promise ((resolve,reject)=>{
        try {
            
            const url = `${postUrl.allComments}/${postId}`
            apiCall("get",url,null)
            .then((response)=>{
                resolve(response);
            })
            .catch((err)=>{
                reject(err);
            })
        } catch (error) {
            resolve({status:500,message:"Error during posting comment"});
        }
    })
}

//@des     Comments Count
//method   POST

export const getCommentsCount = (postId:any)=>{
    return new Promise ((resolve,reject)=>{
        try {
            
            const url = `${postUrl.getCommentsCount}/${postId}`
            apiCall("get",url,null)
            .then((response)=>{
                resolve(response);
            })
            .catch((err)=>{
                reject(err);
            })
        } catch (error) {
            resolve({status:500,message:"Error during posting comment"});
        }
    })
}

//@des     Reply Comment
//method   POST

export const commentReply = (values:{userId:string,commentId:string,reply:string})=>{
    return new Promise ((resolve,reject)=>{
        try {
            
            apiCall("post",postUrl.replyComment,values)
            .then((response)=>{
                resolve(response);
            })
            .catch((err)=>{
                reject(err);
            })
        } catch (error) {
            resolve({status:500,message:"Error during posting comment"});
        }
    })
}

//@des     Comment Delete
//method   POST

export const deleteComment = (commentId:string)=>{
    return new Promise ((resolve,reject)=>{
        try {
            
            apiCall("post",postUrl.commentDelete,{commentId})
            .then((response)=>{
                resolve(response);
            })
            .catch((err)=>{
                reject(err);
            })
        } catch (error) {
            resolve({status:500,message:"Error during posting comment"});
        }
    })
}

//@des     Follow User
//method   POST

export const follow = (values:{userId:string,followingUser:string})=>{
    return new Promise ((resolve,reject)=>{
        try {
            console.log("Valll",values);
            
            apiCall("post",connectionUrls.follow,values)
            .then((response)=>{
                resolve(response);
            })
            .catch((err)=>{
                reject(err);
            })
        } catch (error) {
            resolve({status:500,message:"Error during following"});
        }
    })
}

//@des     Unfollow User
//method   POST

export const unFollow = (values:{userId:string,unFollowingUser:string})=>{
    return new Promise ((resolve,reject)=>{
        try {            
            apiCall("post",connectionUrls.unFollow,values)
            .then((response)=>{
                resolve(response);
            })
            .catch((err)=>{
                reject(err);
            })
        } catch (error) {
            resolve({status:500,message:"Error during unfollowing"});
        }
    })
}

//@des     Get User Connections
//method   POST

export const getUserConnections = (userId:any)=>{
    return new Promise ((resolve,reject)=>{
        try {            
            apiCall("post",connectionUrls.getConnection,{userId})
            .then((response)=>{
                resolve(response);
            })
            .catch((err)=>{
                reject(err);
            })
        } catch (error) {
            resolve({status:500,message:"Error during getting user connection"});
        }
    })
}

//@des     Add New Conversations
//method   POST

export const addConversation = (senderId:any,receiverId:any)=>{
    return new Promise ((resolve,reject)=>{
        try {
            
            apiCall("post",chatUrl.addConversation,{senderId,receiverId})
            .then((response)=>{
                resolve(response);
            })
            .catch((err)=>{
                reject(err);
            })
        } catch (error) {
            resolve({status:500,message:"Error during creating new conversation"});
        }
    })
}

//@des     Get User Conversations
//method   GET

export const getUserConversation = (userId:any)=>{
    return new Promise ((resolve,reject)=>{
        try {
            const url = `${chatUrl.getUserConversation}/${userId}`
            apiCall("get",url,null)
            .then((response)=>{
                resolve(response);
            })
            .catch((err)=>{
                reject(err);
            })
        } catch (error) {
            resolve({status:500,message:"Error during get user conversation"});
        }
    })
}

//@des     Get User Conversations
//method   GET

export const findTwoUserConversation = (userId1:any,userId2:any)=>{
    return new Promise ((resolve,reject)=>{
        try {
            const url = `${chatUrl.findConversationOfTwoUsers}/${userId1}/${userId2}`
            apiCall("get",url,null)
            .then((response)=>{
                resolve(response);
            })
            .catch((err)=>{
                reject(err);
            })
        } catch (error) {
            resolve({status:500,message:"Error during finding two user conversation"});
        }
    })
}


//@des     Get User Messages
//method   GET

export const getUserMessages = (conversationId:any)=>{
    return new Promise ((resolve,reject)=>{
        try {
            const url = `${chatUrl.getMessages}/${conversationId}`
            apiCall("get",url,null)
            .then((response)=>{
                resolve(response);
            })
            .catch((err)=>{
                reject(err);
            })
        } catch (error) {
            resolve({status:500,message:"Error during getting user message"});
        }
    })
}

//@des     Add Message
//method   POST

export const addMessage = (value:any)=>{
    return new Promise ((resolve,reject)=>{
        try {            
            apiCall("post",chatUrl.addMessage,value)
            .then((response)=>{
                resolve(response);
            })
            .catch((err)=>{
                reject(err);
            })
        } catch (error) {
            resolve({status:500,message:"Error during adding message"});
        }
    })
}

//@des     Create New Group
//method   POST

export const createNewGroup = (userData:any)=>{
    return new Promise((resolve,reject)=>{
        try {
            apiCall("post",chatUrl.addGroup,userData)
            .then((response)=>{
                resolve(response);
            })
            .catch((err)=>{
                reject(err);
            })
        } catch (error) {
            resolve({status:500,message:"Erron in createNewGroup"});
        }
    });
}

//@des     Get User Groups
//method   GET

export const getUserGroups = (userId:string)=>{
    return new Promise((resolve,reject)=>{
        try {
            const url = `${chatUrl.getUserGroups}/${userId}`
            apiCall("get",url,null)
            .then((response)=>{
                resolve(response);
            })
            .catch((err)=>{
                reject(err);
            })
        } catch (error) {
            resolve({status:500,message:"Erron in createNewGroup"});
        }
    });
}

//@des     Add New Group Message
//method   POST

export const addNewGroupMessage = (values:{groupId:string,sender:string,text:string})=>{
    return new Promise((resolve,reject)=>{
        try {
            
            apiCall("post",chatUrl.addGroupMesssage,values)
            .then((response)=>{
                resolve(response);
            })
            .catch((err)=>{
                reject(err);
            })
        } catch (error) {
            resolve({status:500,message:"Erron in adding new Message"});
        }
    });
}

//@des     Get Group Message
//method   GET

export const getGroupMessage = (groupId:string)=>{
    return new Promise((resolve,reject)=>{
        try {
            const url = `${chatUrl.getGroupMessages}/${groupId}`
            apiCall("get",url,null)
            .then((response)=>{
                resolve(response);
            })
            .catch((err)=>{
                reject(err);
            })
        } catch (error) {
            resolve({status:500,message:"Erron during fetching Messages"});
        }
    });
}