import { adminUrl } from "../../../constants/routes";
import { apiCall } from "./apiCalls";

//@des     Login
//method   POST

export const adminPostLogin = (adminData:{email:string,password:string})=>{
    return new Promise((resolve,reject)=>{
        try {
            apiCall("post",adminUrl.login,adminData)
            .then((response)=>{
                resolve(response);
            })
            .catch((err)=>{
                reject(err);
            });
        } catch (error) {
            resolve({status:500,message:"Error in the adminPostLogin"});
        }
    });
};

//@des     Get All Users
//method   POST

export const getAllUsers = (page:any)=>{
    return new Promise((resolve,reject)=>{
        try {
            const queryParams = `?page=${page}`;
            apiCall("get",adminUrl.AllUsers+queryParams,null)
            .then((response)=>{
                resolve(response);
            })
            .catch((err)=>{
                reject(err);
            });
        } catch (error) {
            resolve({status:500,message:"Error in the getAllUsers"});
        }
    })
}

//@des     Block/UnBlock user
//method   POST

export const changeUserStatus = (data:{userId:string,status:boolean})=>{
    return new Promise((resolve,reject)=>{
        try {
            apiCall("post",adminUrl.changeUserStatus,data)
            .then((response)=>{
                resolve(response);
            })
            .catch((err)=>{
                reject(err);
            });
        } catch (error) {
            resolve({status:500,message:"Error in the getAllUsers"});
        }
    })
}

//@des     Get All Posts
//method   POST

export const getAllPosts = (page:number)=>{
    return new Promise((resolve,reject)=>{
        try {
            const queryParams = `?page=${page}`;
            apiCall("get",adminUrl.getAllPost+queryParams,"")
            .then((response)=>{
                resolve(response);
            })
            .catch((err)=>{
                reject(err);
            });
        } catch (error) {
            resolve({status:500,message:"Error in the getAllPosts"});
        }
    })
}

//@des     Block/UnBlock Post
//method   POST

export const changePostStatus = (data:{postId:string,status:boolean},page:number)=>{
    return new Promise((resolve,reject)=>{
        try {
            const queryParams = `?page=${page}`;
            apiCall("post",adminUrl.changePostStatus+queryParams,data)
            .then((response)=>{
                resolve(response);
            })
            .catch((err)=>{
                reject(err);
            });
        } catch (error) {
            resolve({status:500,message:"Error in the changePostStatus"});
        }
    })
}