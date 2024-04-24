import { userUrl } from "../../../constants/routes";
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

//@des     Forget password OTP verification
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