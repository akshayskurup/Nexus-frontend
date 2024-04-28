import { postUrl, userUrl } from "../../../constants/routes";
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


//@des     My Comment
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

//@des     My Comment
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