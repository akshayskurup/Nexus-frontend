import { createSlice,PayloadAction } from "@reduxjs/toolkit";

interface UserData {
    id:number,
    userName:string,
    email:string,
    bio:string,
    phone:number,
    gender:string,
    profileImage:string,
    bgImage:string,
    token: string;
}
interface initialStateType{
    user:UserData | null;
    token:string | null;
    posts:any[];
    message:any
} 

const initialState:initialStateType = {
    user:null,
    token:null,
    posts:[],
    message:[]
}



const authSlice = createSlice({
    name:"authSlice",
    initialState,
    reducers:{
        login: (state, action: PayloadAction<{ user: UserData}>) => {
            state.user = action.payload.user;
            state.token = action.payload.user.token;
            state.message = []
          },
        updateUser:(state,action: PayloadAction<{ user: UserData}>)=>{
            state.user = action.payload.user
        },
        updateToken:(state,action: PayloadAction<{token:string}>)=>{
            state.token = action.payload.token;
        },
        logoutUser:(state)=>{
            state.user = null;
            state.token = null;
            state.posts = [];
            state.message = []
        },
        setPosts:(state,action: PayloadAction<{posts: any[]}>)=>{
            state.posts = action.payload.posts;
        },
        setMessage:(state,action: PayloadAction<{message:any}>)=>{
            console.log("actionnnn",action.payload)
            // state.message.push(action.payload)
            state.message = action.payload
        }
    }
});

export const {login,updateUser,updateToken,logoutUser,setPosts,setMessage} = authSlice.actions;
export default authSlice.reducer;