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
} 

const initialState:initialStateType = {
    user:null,
    token:null
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
            console.log("reduxx",action.payload)
            state.user = action.payload.user
        },
        updateToken:(state,action: PayloadAction<{token:string}>)=>{
            state.token = action.payload.token;
        },
        logoutUser:(state)=>{
            state.user = null,
            state.token = null
        }
    }
});

export const {login,updateUser,updateToken,logoutUser} = authSlice.actions;
export default authSlice.reducer;