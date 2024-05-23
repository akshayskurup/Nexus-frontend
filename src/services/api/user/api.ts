import axios from "axios";
import { BASE_URL } from "../../../constants/urls";
import { store } from "../../../utils/store";
import { logoutUser, updateToken } from "../../../utils/reducers/authSlice";
const { CancelToken } = axios;
const cancelTokenSource = CancelToken.source();


export const api = axios.create({
    withCredentials: true,
    baseURL:`${BASE_URL}/api`
});

const getToken = () => {
    const state = store.getState();
    const token = state.auth.token;
    
    return token;
}

api.interceptors.request.use(
    async (config)=>{
        const token = getToken();
        if(token){
            config.headers.Authorization = `Bearer ${token}`;
        }
            config.cancelToken = cancelTokenSource.token;
            return config;
        },
        (error:any) => {
            return Promise.reject(error);
        }
    
)
api.interceptors.response.use(
    (response) => {
        console.log("Wwww");
        return response;
    },
    async (error) => {
        console.log("ERRorrr",error);
        
        if (error.response && error.response.status === 401 && error.response.message==="Token expired") {

            console.log("Wwww 22");
            try {
                const refreshToken = localStorage.getItem('refreshToken');

                if (!refreshToken) {
                    return Promise.reject(new Error('Refresh token is missing'));
                }
                const refreshedTokenResponse = await api.post('/user/refresh-token', {
                    refreshToken
                });
                const newToken = refreshedTokenResponse.data.accessToken;
                store.dispatch(updateToken(newToken));

                // Retry the original request with the new token
                const originalRequest = error.config;
                originalRequest.headers.Authorization = `Bearer ${newToken}`;
                return api(originalRequest);
            } catch (refreshError) {
                console.error('Refresh token failed:', refreshError);
                store.dispatch(logoutUser()); 
                throw refreshError;

            }
        }
        return Promise.reject(error);
    }
);