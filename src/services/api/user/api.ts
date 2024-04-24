import axios from "axios";
import { BASE_URL } from "../../../constants/urls";
import { store } from "../../../utils/store";
import { updateToken } from "../../../utils/reducers/authSlice";

export const api = axios.create({
    withCredentials: true,
    baseURL:`${BASE_URL}/api`
});

const getToken = () => {
    const state = store.getState()
    const token = state.auth.token
    return token;
}

api.interceptors.request.use(
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
api.interceptors.response.use(
    (response) => {
        return response;
    },
    async (error) => {
        if (error.response && error.response.status === 401 && error.response.message==="Token expired") {
            try {
                const refreshToken = localStorage.getItem('refreshToken');

                if (!refreshToken) {
                    return Promise.reject(new Error('Refresh token is missing'));
                }
                const refreshedTokenResponse = await api.post('/refresh-token', {
                    refreshToken
                });
                const newToken = refreshedTokenResponse.data.accessToken;
                store.dispatch(updateToken(newToken));

                // Retry the original request with the new token
                const originalRequest = error.config;
                originalRequest.headers.Authorization = `Bearer ${newToken}`;
                return api(originalRequest);
            } catch (refreshError) {
                
                return Promise.reject(refreshError);
            }
        }
        return Promise.reject(error);
    }
);