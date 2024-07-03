import axios from "axios";
import { BASE_URL } from "../../../constants/urls";
import { store } from "../../../utils/store";
import { logoutUser, updateToken } from "../../../utils/reducers/authSlice";
// import { navigate } from "../../../navigation"; // Import your navigation function

const { CancelToken } = axios;
const cancelTokenSource = CancelToken.source();

export const api = axios.create({
    withCredentials: true,
    baseURL: `${BASE_URL}/api`
});

const getToken = () => {
    const state = store.getState();
    return state.auth.token;
}

api.interceptors.request.use(
    async (config) => {
        const token = getToken();
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        config.cancelToken = cancelTokenSource.token;
        return config;
    },
    (error: any) => {
        return Promise.reject(error);
    }
);

api.interceptors.response.use(
    (response) => {
        console.log("Response received");
        return response;
    },
    async (error) => {
        console.log("Error occurred", error);
        
        if (error.response && error.response.status === 401) {
            console.log("Unauthorized error");
            
            if (error.response.data.message === "Token expired") {
                console.log("Token expired, attempting refresh");
                try {
                    const refreshToken = localStorage.getItem('refreshToken');

                    if (!refreshToken) {
                        throw new Error('Refresh token is missing');
                    }

                    const refreshedTokenResponse = await api.post('/user/refresh-token', {
                        refreshToken
                    });

                    const newToken = refreshedTokenResponse.data.accessToken;
                    store.dispatch(updateToken({token:newToken}));

                    // Retry the original request with the new token
                    const originalRequest = error.config;
                    originalRequest.headers.Authorization = `Bearer ${newToken}`;
                    return api(originalRequest);
                } catch (refreshError) {
                    console.error('Refresh token failed:', refreshError);
                    store.dispatch(logoutUser());
                    // navigate('/login'); // Redirect to login page
                    return Promise.reject(refreshError);
                }
            } else {
                // For other 401 errors, log out and redirect
                store.dispatch(logoutUser());
                // navigate('/login'); // Redirect to login page
            }
        }
        return Promise.reject(error);
    }
);