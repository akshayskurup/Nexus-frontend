import { combineReducers } from 'redux';
import authSlice from './reducers/authSlice';
import adminAuthSlice from './reducers/adminAuthSlice';


const rootReducer = combineReducers({
  auth:authSlice,
  adminAuth:adminAuthSlice
 
});

export default rootReducer;
