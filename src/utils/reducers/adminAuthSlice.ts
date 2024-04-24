import { createSlice,PayloadAction } from "@reduxjs/toolkit";

interface AdminData {
    id: number;
    username: string;
    email: string;
    token: string;
}
interface initialStateType{
    admin:AdminData | null;
    token:string | null;
} 

const initialState:initialStateType = {
    admin:null,
    token:null
}



const authSlice = createSlice({
    name:"adminAuth",
    initialState,
    reducers:{
        adminLogin: (state, action: PayloadAction<{ admin: AdminData}>) => {
            state.admin = action.payload.admin;
            state.token = action.payload.admin.token;
          },
        adminLogout:(state)=>{
            state.admin = null;
            state.token = null;
        }
    }
});

export const {adminLogin,adminLogout} = authSlice.actions;
export default authSlice.reducer;