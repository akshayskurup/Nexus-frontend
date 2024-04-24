import axios from "axios";

import { BASE_URL } from "../../../constants/urls";
import { store } from "../../../utils/store";

export const adminApi = axios.create({
  baseURL: `${BASE_URL}/api`,
});

const getToken = () => {
  const state = store.getState()
  
  const token = state.adminAuth.token
  return token;
}

adminApi.interceptors.request.use(
  (config)=>{
      const token = getToken();
      if(token){
          config.headers.Authorization = `Bearer ${token}`;
      }
          return config;
      },
      (error:any) => {
          return Promise.reject(error);
      }
  
)
