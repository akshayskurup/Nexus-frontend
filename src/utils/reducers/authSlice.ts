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
    posts:any[]
} 

const initialState:initialStateType = {
    user:null,
    token:null,
    posts:[]
}



const authSlice = createSlice({
    name:"authSlice",
    initialState,
    reducers:{
        login: (state, action: PayloadAction<{ user: UserData}>) => {
            state.user = action.payload.user;
            state.token = action.payload.user.token;
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
        },
        setPosts:(state,action: PayloadAction<{posts: any[]}>)=>{
            state.posts = action.payload.posts;
        }
    }
});

export const {login,updateUser,updateToken,logoutUser,setPosts} = authSlice.actions;
export default authSlice.reducer;